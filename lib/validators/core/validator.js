"use strict";
var Validator = function () {
};

// treat as optional in Obj and inheritants
Validator.prototype.keyOptional = false;
Validator.prototype.isKeyOptional = function (ctx) {
	return this.keyOptional;
};

Validator.prototype.code = null;
Validator.prototype.expectedStr = null;

Validator.prototype.getInfo = function () {
	return null;
};

Validator.prototype.validate = function (ctx) {
	var wasTransformed = ctx.isTransformed;
	var isValid = this.isValid(ctx);
	if (!wasTransformed && !isValid) {
		ctx.resetTransform();
	}
	if (!isValid) {
		this.onValidationError(ctx);
	}
	return isValid;
};

Validator.prototype.isValid = function (ctx) {
	return false;
};

Validator.prototype.getCode = function () {
	if (this.code == null) {
		throw new Error('Code not provided');
	}
	return this.code;
};

Validator.prototype.getExpectedStr = function () {
	return this.expectedStr;
};

Validator.prototype.onValidationError = function (ctx) {
	ctx.validationError(this);
};

Validator.prototype.getShortName = function () {
	return this.getCode();
};

Validator.prototype.getShort = function () {
	throw new Error('Not implemented');
};


module.exports = Validator;
