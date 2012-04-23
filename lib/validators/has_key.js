"use strict";
var inherits = require('util').inherits;
var Validator = require('./core/validator');


var HasKey = function (key) {
	Validator.call(this);
	this.key = key;
};
inherits(HasKey, Validator);

HasKey.prototype.errorCode = 'hasKey';
HasKey.prototype.expectedStr = 'is required';

HasKey.prototype.validate = function (ctx) {
	var value = ctx.value;
	var isValid = value != null && this.key in value;
	if (!isValid) {
		this.reportValidationError(ctx);
	}
	return isValid;
};

HasKey.prototype.reportValidationError = function (ctx) {
	ctx.enter(this.key);
	ctx.enterKey();
	ctx.setPropertyCheck(true);
	this.onValidationError(ctx);
	ctx.setPropertyCheck(false);
	ctx.leaveKey();
	ctx.leave(this.key);
};

HasKey.hasKey = function (key) {
	return new HasKey(key);
};


module.exports = HasKey;
