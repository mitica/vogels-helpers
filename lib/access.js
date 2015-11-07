'use strict';

/**
 * Access options type
 * @typedef AccessOptions
 * @property {object} params - DynamoDB params.
 * @property {string} format - Result format: `json`, `first`, 'items'
 * @property {string[]} omit - Fields to omit.
 */

var models = require('./models');
var utils = require('./utils');

/**
 * Get a data item by key.
 * @param {string} model - A model name.
 * @param {(string|number)} key - Item key
 * @param {AccessOptions} [options] - Access options
 * @returns {object} Founded record.
 * @protected
 */
exports.getItemByKey = function(model, key, options) {
	return models.model(model).getAsync(key, options && options.params)
		.then(utils.formatResult.bind(null, options && options.format));
};

/**
 * Get a data item by key and range key.
 * @param {string} model - A model name.
 * @param {(string|number)} key - Item key
 * @param {(string|number)} rangeKey - Item range key
 * @param {AccessOptions} [options] - Access options
 * @returns {object} Founded record.
 * @protected
 */
exports.getItemByRangeKey = function(model, key, rangeKey, options) {
	return models.model(model).getAsync(key, rangeKey, options && options.params)
		.then(utils.formatResult.bind(null, options && options.format));
};

/**
 * Get data items by keys.
 * @param {string} model - A model name.
 * @param {(number[]|string[]|object[])} keys - Items keys
 * @param {AccessOptions} [options] - Access options
 * @returns {object[]} Founded records.
 * @protected
 */
exports.getItems = function(model, keys, options) {
	options = options || {};
	options.format = options.format || 'items';
	return models.model(model).getItemsAsync(keys, options && options.params)
		.then(utils.formatResult.bind(null, options && options.format));
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
 * @param {number} [data.limit] - Limit items count.
 * @param {string} [data.format] - Result form: `count`, `first`.
 * @param {object} [data.where] - Filter by range key object.
 * @param {string} [data.where.rangeKey] - Range key name.
 * @param {string} [data.where.operation] - where operation name: gte, gt, lt, lte, equals, beginsWith, between.
 * @param {string} [data.where.value] - where operation value.
 * @returns {object[]} Founded records.
 * @protected
 */
exports.query = function(model, data) {
	var query = models.model(model).query(data.key);

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
	if (data.where && data.where.rangeKey && data.where.operation && data.where.value !== undefined) {
		query.where(data.where.rangeKey)[data.where.operation].call(query, data.where.value);
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
