'use strict';

var utils = require('./utils');
var _ = utils._;
var Promise = utils.Promise;
var models = {};

/**
 * Defines a model data.
 * @param {string} name - Model's name
 * @param {Object} model - A model created with vogels.
 * @param {RecordConfig} [recordConfig] - Record config.
 */
function define(name, model, recordConfig) {
	recordConfig = recordConfig || {};

	models[name] = {
		model: model
	};

	recordConfig = _.pick(recordConfig, 'createSchema', 'updateSchema', 'createNormalize', 'updateNormalize', 'createValidate', 'updateValidate');
	recordConfig.name = name;

	models[name].recordConfig = recordConfig;

	Promise.promisifyAll(model);

	return models[name];
}

function getModel(name) {
	return models[name].model;
}

function getRecordConfig(name) {
	return models[name].recordConfig;
}

exports.define = define;
exports.model = getModel;
exports.recordConfig = getRecordConfig;
