'use strict';

var models = require('./models');
var Record = require('./record');
var utils = require('./utils');
var cache = require('memory-cache');

/**
 * Creates a new model record.
 * @param {string} model - Model name.
 * @param {object} data - Model data.
 * @param {object} options - Options.
 * @returns {object} Created record.
 */
function create(model, data, options) {
	try {
		data = Record.create(models.recordConfig(model), data).normalize().validate().getData();
	} catch (error) {
		return Promise.reject(error);
	}

	options = options || {};
	options.params = options.params || {};
	if (options.keys) {
		var keys = options.keys;
		var params = options.params;

		params.ConditionExpression = '';
		params.ExpressionAttributeNames = {};
		params.ExpressionAttributeValues = {};

		for (var i = keys.length - 1; i >= 0; i--) {
			var key = keys[i];

			var cacheKey = ['control-create', model, key, data[key]].join('#');
			if (cache.get(cacheKey)) {
				return Promise.reject(new Error(model + ' object is in creating state:'+cacheKey));
			}
			cache.put(cacheKey, true, 1000 * 3);

			params.ConditionExpression += '#' + key + ' <> :' + key + ' AND ';
			params.ExpressionAttributeNames['#' + key] = key;
			params.ExpressionAttributeValues[':' + key] = data[key];
		}

		params.ConditionExpression = params.ConditionExpression.substr(0, params.ConditionExpression.length - 5);
	}

	return models.model(model).createAsync(data, options.params)
		.then(utils.formatResult.bind(null, options.format));
}

/**
 * @function
 */
exports.create = create;
