'use strict';

/**
 * A function for normalizing Record data
 * @callback normalizeDataCallback
 * @param {Object} data
 * @returns {Object} Normalized data.
 */

/**
 * A function for validating Record data
 * @callback validateDataCallback
 * @param {Object} data
 */

/**
 * Record config object
 * @property {String} name - Record's name.
 * @property {Object} createSchema - Model schema.
 * @property {Object} updateSchema - Schema for updating a model.
 * @property {normalizeDataCallback} createNormalize - Function for normalizing data on create status.
 * @property {normalizeDataCallback} updateNormalize - Function for normalizing data on update status.
 * @property {validateDataCallback} createValidate - Function for validating data on create status.
 * @property {validateDataCallback} updateValidate - Function for validating data on update status.
 * @typedef RecordConfig
 */

var utils = require('./utils');
var _ = utils._;

var SCOPE_CREATE = 'create';
var SCOPE_UPDATE = 'update';
var Joi = require('joi');

function validateSchema(data, schema) {
	return _.isFunction(schema.validate) ? schema.validate(data) : Joi.validate(data, schema);
}

/**
 * Base Record class
 * @param {RecordConfig} config - Record config object.
 * @param {Object} data - Record's data object.
 * @param {String} scope - Record's scope. Can be `create` or `update`.
 * @class
 */
function Record(config, data, scope) {
	if (data instanceof Record) {
		return data;
	}
	if (_.isPlainObject(data)) {
		this.data = data;
	} else {
		throw new Error('Record must contain a data object');
	}
	if (config && _.isString(config.name)) {
		this.config = config;
	} else {
		throw new Error('Record must contain a config object');
	}

	scope = scope || SCOPE_CREATE;

	if ([SCOPE_CREATE, SCOPE_UPDATE].indexOf(scope) < 0) {
		throw new Error('Invalid Record scope: ' + scope);
	}

	this.scope = scope;

	return this;
}

/**
 * Creates a Record.
 * @param {RecodrConfig} config - Record config.
 * @param {Object} data - Record's data object.
 * @param {String} [scope='create'] - Record's scope. Can be `create` or `update`.
 * @returns {Record}
 */
Record.create = function(config, data, scope) {
	if (data instanceof Record) {
		return data;
	}
	return new Record(config, data, scope);
};

Record.prototype.isCreating = function() {
	return this.scope === SCOPE_CREATE;
};

Record.prototype.isUpdating = function() {
	return this.scope === SCOPE_UPDATE;
};

/**
 * Normalize a Record data.
 * @returns {Record} Returns this.
 */
Record.prototype.normalize = function() {
	var data = this.getData();
	if (this.isCreating()) {
		if (this.config.createNormalize) {
			this.data = this.config.createNormalize(data);
		}
	} else {
		if (this.config.updateNormalize) {
			this.data = this.config.updateNormalize(data);
		}
		if (this.config.updateSchema) {
			var keys = Object.keys(this.config.updateSchema);
			this.data = _.pick(this.data, keys);
		}
	}

	return this;
};

/**
 * Validate a Record's data object.
 * @returns {Record} Returns this.
 */
Record.prototype.validate = function() {
	var data = this.getData();
	var schema;
	if (this.isCreating()) {
		if (this.config.validateCreate) {
			this.config.validateCreate(data);
		}
	} else {
		if (this.config.validateUpdate) {
			this.config.validateUpdate(data);
		}
		schema = this.config.updateSchema;
	}
	if (schema) {
		var result = validateSchema(data, schema);
		// console.log('validate result', result);
		if (result.error) {
			throw result.error;
		}
	}
	return this;
};

/**
 * Get Record's data object.
 * @returns {Object} Returns the Record's data object.
 */
Record.prototype.getData = function() {
	return this.data;
};

module.exports = Record;
