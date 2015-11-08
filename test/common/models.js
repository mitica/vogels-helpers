'use strict';

var vogels = require('../../lib');
var Joi = require('joi');

exports.Account = vogels.define('Account', {
	tableName: 'Accounts',
	hashKey: 'id',
	timestamps: true,
	schema: {
		// const ObjectID
		id: Joi.string().trim().length(24).lowercase().alphanum().required(),
		// UUID
		key: Joi.string().trim().length(36).lowercase().required(),

		email: Joi.string().trim().min(5).max(100).lowercase().email().required(),
		username: Joi.string().trim().min(3).max(50).required(),
		// sha1(password)
		password: Joi.string().trim().length(40).lowercase().required(),

		displayName: Joi.string().trim().min(3).max(100),
		familyName: Joi.string().trim().max(50),
		givenName: Joi.string().trim().max(50),
		middleName: Joi.string().trim().max(50),

		gender: Joi.valid('male', 'female'),
		status: Joi.valid('active', 'blocked').default('active').required(),
		role: Joi.string().trim().default('user').required(),

		photo: Joi.string().trim().max(255),

		customData: Joi.string().trim().max(800)
	}
});
