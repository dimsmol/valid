"use strict";
var inherits = require('util').inherits;
var Validator = require('./validator');


var TypeValueValidator = function () {
	Validator.call(this);
};
inherits(TypeValueValidator, Validator);

TypeValueValidator.prototype.validate = function (ctx) {
	var wasTransformed = ctx.isTransformed;
	var isValid = this.validateType(ctx) && this.validateValue(ctx);
	if (!wasTransformed && !isValid) {
		ctx.resetTransform();
	}
	return isValid;
};

TypeValueValidator.prototype.validateType = function (ctx) {
	if (this.isTypeValid(ctx)) {
		return true;
	}
	this.onTypeError(ctx);
	return false;
};

TypeValueValidator.prototype.validateValue = function (ctx) {
	if (this.isValueValid(ctx)) {
		return true;
	}
	this.onValueError(ctx);
	return false;
};

TypeValueValidator.prototype.isTypeValid = function (ctx) {
	return false;
};

TypeValueValidator.prototype.isValueValid = function (ctx) {
	return false;
};

TypeValueValidator.prototype.onTypeError = function (ctx) {
	this.onValidationError(ctx);
};

TypeValueValidator.prototype.onValueError = function (ctx) {
	this.onValidationError(ctx);
};


module.exports = TypeValueValidator;
