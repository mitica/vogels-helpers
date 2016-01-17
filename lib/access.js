'use strict';

/**
 * @module access
 */

/**
 * Access options type
 * @typedef AccessOptions
 * @property {object} params - DynamoDB params.
 * @property {string} format - Result format: `json`, `first`, 'items'
 * @property {string[]} omit - Fields to omit.
 */

var models = require('./models');
var utils = require('./utils');
var Promise = utils.Promise;

/**
 * Get a data item by key.
 * @param {string} model - A model name.
 * @param {(string|number|object)} key - Item key
 * @param {AccessOptions} [options] - Access options
 * @returns {object} Founded record.
 */
exports.getItem = function(model, key, options) {
	options = options || {};
	return models.getModel(model).getAsync(key, options.params)
		.then(utils.formatResult.bind(null, options.format));
};

/**
 * Get data items by keys.
 * @param {string} model - A model name.
 * @param {(number[]|string[]|object[])} keys - Items keys
 * @param {AccessOptions} [options] - Access options
 * @returns {object[]} Founded records.
 */
exports.getItems = function(model, keys, options) {
	options = options || {};
	return models.getModel(model).getItemsAsync(keys, options.params)
		.then(utils.formatResult.bind(null, options.format));
};

/**
 * Query for items thet uses hash and range keys.
 * @param {string} model - A model name.
 * @param {object} data - Data for building query.
 * @param {(number|string)} data.key - Items hash key.
 * @param {number} [data.index] - Global or Local Secondary index.
 * @param {string} [data.select] - Select mode: COUNT | ALL_PROJECTED_ATTRIBUTES.
 * @param {string[]} [data.attributes] - Attributes to get.
 * @param {boolean} [data.consistentRead] - ConsistentRead param.
 * @param {string} [data.sort] - Sort direction: descending, ascending
 * @param {number} [data.limit] - Limit items count.
 * @param {string} [data.format] - Result form: `count`, `first`.
 * @param {object} [data.rangeKey] - Filter by range key object.
 * @param {string} [data.rangeKey.operation] - where operation name: gte, gt, lt, lte, equals, beginsWith, between.
 * @param {string} [data.rangeKey.value] - where operation value.
 * @param {object|string|number} [data.startKey] - The key to start. Used for pagging.
 * @returns {object[]} Founded records.
 */
exports.query = function(model, data) {
	var query = models.getModel(model).query(data.key);

	if (data.startKey) {
		query.startKey(data.startKey);
	}
	if (data.index) {
		query.usingIndex(data.index);
	}
	if (data.limit) {
		query.limit(data.limit);
	}
	if (data.attributes) {
		query.attributes(data.attributes);
	}
	if (data.consistentRead === true) {
		query.consistentRead(true);
	}
	if (~['ascending', 'descending'].indexOf(data.sort)) {
		query[data.sort]();
	}
	if (data.rangeKey && data.rangeKey.operation && data.rangeKey.value !== undefined) {
		var rangeKey = data.rangeKey.name || models.getConfig(model).rangeKey;
		query.where(rangeKey)[data.rangeKey.operation](data.rangeKey.value);
	}
	if (data.select) {
		query.select(data.select);
	}

	return new Promise(function(resolve, reject) {
		query.exec(function(error, result) {
			if (error) {
				return reject(error);
			}
			result = utils.formatResult(data.format, result);

			resolve(result);
		});
	});
};
