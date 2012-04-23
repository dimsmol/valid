"use strict";
var inherits = require('util').inherits;
var Validator = require('./core/validator');


// NOTE differs with KeyMatch in that KeyMatch will
// show underlying key matching error
// when Key just says that property is not allowed
// Use Key in cases like:
// {'*': v(key(rx(/^userProp/)), str)}
// (allows only string properties started with 'userProp')
var Key = function (validator) {
	Validator.call(this);
	this.validator = validator;
};
inherits(Key, Validator);

Key.prototype.errorCode = 'key';
Key.prototype.expectedStr = 'is not allowed';

Key.prototype.validate = function (ctx) {
	ctx.enterKey();
	ctx.setNoError(true);
	var isValid = this.validator.validate(ctx);
	ctx.setNoError(false);
	if (!isValid) {
		ctx.setPropertyCheck(true);
		this.onValidationError(ctx);
		ctx.setPropertyCheck(false);
	}
	ctx.leaveKey();
	return isValid;
};

Key.prototype.reportValidationError = function (ctx) {
	ctx.enterKey();
	ctx.setPropertyCheck(true);
	this.onValidationError(ctx);
	ctx.setPropertyCheck(false);
	ctx.leaveKey();
};

Key.key = function (validator) {
	if (arguments.length > 1) {
		validator = new And(arguments);
	}
	return new Key(validator);
};


module.exports = Key;
