'use strict';

var utils = require('./utils');
var _ = utils._;
var Promise = utils.Promise;
var models = {};
var vogels = require('vogels');

/**
 * Defines a model data.
 * @param {string} name - Model's name
 * @param {Object} config - A model config.
 * @param {RecordConfig} [recordConfig] - Record config.
 */
function define(name, config, recordConfig) {
	recordConfig = recordConfig || {};

	var modelName = recordConfig.name || name;

	// console.log('define', name, config);

	var model = vogels.define(name, config);

	models[modelName] = {
		model: model,
		config: config
	};

	recordConfig = _.pick(recordConfig, 'createSchema', 'updateSchema', 'createNormalize', 'updateNormalize', 'createValidate', 'updateValidate');
	recordConfig.name = modelName;
	recordConfig.createSchema = recordConfig.createSchema || config.schema;

	models[name].recordConfig = recordConfig;

	Promise.promisifyAll(model);

	return model;
}

function getModel(name) {
	return models[name].model;
}

function getConfig(name) {
	return models[name].config;
}

function getRecordConfig(name) {
	return models[name].recordConfig;
}

exports.define = define;
exports.getModel = getModel;
exports.getConfig = getConfig;
exports.getRecordConfig = getRecordConfig;
