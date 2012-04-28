"use strict";
var inherits = require('util').inherits;
var Validator = require('./core/validator');


var HasKey = function (key) {
	Validator.call(this);
	this.key = key;
};
inherits(HasKey, Validator);

HasKey.prototype.code = 'hasKey';

HasKey.prototype.validate = function (ctx) {
	var value = ctx.value;
	var isValid = value != null && this.key in value;
	if (!isValid) {
		ctx.propertyRequiredError(this, this.key);
	}
	return isValid;
};

HasKey.hasKey = function (key) {
	return new HasKey(key);
};

HasKey.getShort = function (corrector) {
	return HasKey.hasKey;
};


module.exports = HasKey;
