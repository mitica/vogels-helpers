'use strict';

var _ = require('lodash');
var Promise = require('bluebird');

function get(data) {
	if (_.isNull(data) || _.isUndefined(data)) {
		return data;
	}
	if (Array.isArray(data)) {
		return data.map(get);
	}
	if (data.Items && data.Items.length > 0 && _.isFunction(data.Items[0].toJSON)) {
		data.Items = data.Items.map(get);
	}
	if (_.isFunction(data.toJSON)) {
		return data.toJSON();
	}
	return data;
}

function getItems(data) {
	if (data) {
		return data.Items;
	}
	return data;
}

function getFirst(data) {
	data = getItems(data);
	if (Array.isArray(data)) {
		if (data.length > 0) {
			return data[0];
		} else {
			return null;
		}
	}
	return data;
}

function formatResult(format, result) {
	if (!format || format === 'model') {
		return result;
	}

	result = get(result);

	switch (format) {
		case 'items':
			return getItems(result);
		case 'first':
			return getFirst(result);
	}

	return result;
}

exports._ = _;
exports.Promise = Promise;
exports.formatResult = formatResult;
