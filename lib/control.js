'use strict';

/**
 * @module control
 */

var models = require('./models');
var Record = require('./record');
var utils = require('./utils');

/**
 * Creates a new record.
 * @param {string} model - Model name.
 * @param {object} data - Model data.
 * @param {object} [options] - Options.
 * @param {object} [options.params] - AWS DynamoDB params.
 * @param {string[]} [options.keys] - Unique keys names, for building ConditionExpression.
 * @returns {object} Created record.
 */
exports.create = function(model, data, options) {
	try {
		data = Record.create(models.getRecordConfig(model), data).normalize().validate().getData();
	} catch (error) {
		return Promise.reject(error);
	}

	options = options || {};
	var params = options.params = options.params || {};
	if (!params.ConditionExpression) {
		var keys = [];

		var modelConfig = models.getConfig(model);
		keys.push(modelConfig.hashKey);
		if (modelConfig.rangeKey) {
			keys.push(modelConfig.rangeKey);
		}

		params.ConditionExpression = '';
		params.ExpressionAttributeNames = {};
		params.ExpressionAttributeValues = {};

		for (var i = keys.length - 1; i >= 0; i--) {
			var key = keys[i];

			params.ConditionExpression += '#' + key + ' <> :' + key + ' AND ';
			params.ExpressionAttributeNames['#' + key] = key;
			params.ExpressionAttributeValues[':' + key] = data[key];
		}

		params.ConditionExpression = params.ConditionExpression.substr(0, params.ConditionExpression.length - 5);
	}

	return models.getModel(model).createAsync(data, options.params)
		.then(utils.formatResult.bind(null, options.format));
};

/**
 * Updates an existing record.
 * @param {string} model - Model name.
 * @param {object} data - Model data.
 * @param {object} [options] - Options.
 * @param {object} [options.params] - AWS DynamoDB params.
 * @param {string[]} [options.keys] - Unique keys names, for building ConditionExpression.
 * @returns {object} Created record.
 */
exports.update = function(model, data, options) {
	try {
		data = Record.create(models.getRecordConfig(model), data, 'update').normalize().validate().getData();
	} catch (error) {
		return Promise.reject(error);
	}

	options = options || {};
	var params = options.params = options.params || {};
	if (!params.ConditionExpression) {
		var keys = [];

		var modelConfig = models.getConfig(model);
		keys.push(modelConfig.hashKey);
		if (modelConfig.rangeKey) {
			keys.push(modelConfig.rangeKey);
		}

		params.ConditionExpression = '';
		params.ExpressionAttributeNames = {};
		params.ExpressionAttributeValues = {};

		for (var i = keys.length - 1; i >= 0; i--) {
			var key = keys[i];

			params.ConditionExpression += '#' + key + ' = :' + key + ' AND ';
			params.ExpressionAttributeNames['#' + key] = key;
			params.ExpressionAttributeValues[':' + key] = data[key];
		}

		params.ConditionExpression = params.ConditionExpression.substr(0, params.ConditionExpression.length - 5);
	}

	return models.getModel(model).updateAsync(data, options.params)
		.then(utils.formatResult.bind(null, options.format));
};

/**
 * Creates or replaces a record.
 * @param {string} model - Model name.
 * @param {object} data - Model data.
 * @param {object} [options] - Options.
 * @param {object} [options.params] - AWS DynamoDB params.
 * @returns {object} Created record.
 */
exports.put = function(model, data, options) {
	try {
		data = Record.create(models.getRecordConfig(model), data).normalize().validate().getData();
	} catch (error) {
		return Promise.reject(error);
	}

	options = options || {};

	var params = options.params || {};

	return models.getModel(model).createAsync(data, params)
		.then(utils.formatResult.bind(null, options.format));
};

/**
 * Delete an item.
 * @param {string} model - Model name.
 * @param {string|number|object} key - An item key.
 * @param {object} [options] - Options.
 * @param {object} [options.params] - AWS DynamoDB params.
 * @returns {object}
 */
exports.destroy = function(model, key, options) {
	options = options || {};

	var params = options.params || {};

	return models.getModel(model).destroyAsync(key, params)
		.then(utils.formatResult.bind(null, options.format));
};
