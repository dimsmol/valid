"use strict";
var Validator = function () {
};

// treat as optional in Obj and inheritants
Validator.prototype.isKeyOptional = false;

Validator.prototype.errorCode = 'invalid';
Validator.prototype.expectedStr = null;

Validator.prototype.getInfo = function () {
	return null;
};

Validator.prototype.validate = function (ctx) {
	if (this.isValid(ctx)) {
		return true;
	}
	this.onValidationError(ctx);
	return false;
};

Validator.prototype.isValid = function (ctx) {
	return false;
};

Validator.prototype.getErrorCode = function () {
	return this.errorCode;
};

Validator.prototype.getExpectedStr = function () {
	return this.expectedStr;
};

Validator.prototype.onValidationError = function (ctx) {
	ctx.validationError(this);
};


module.exports = Validator;
