"use strict";
var inherits = require('util').inherits;
var Validator = require('./core/validator');


var On = function (matchValidator, validator) {
	this.matchValidator = matchValidator;
	this.validator = validator;
};

On.prototype.matches = function (ctx) {
	ctx.setNoError(true);
	var matches = this.matchValidator.validate(ctx);
	ctx.setNoError(false);
	return matches;
};

On.prototype.performValidation = function (ctx) {
	return this.validator.validate(ctx);
};


var Sw = function (onClauses) {
	Validator.call(this);
	this.onClauses = onClauses;
};
inherits(Sw, Validator);

Sw.prototype.errorCode = 'sw';
Sw.prototype.expectedStr = 'one of provided by dataspec';

Sw.prototype.validate = function (ctx) {
	for (var k in this.onClauses) {
		var on = this.onClauses[k];
		if (on.matches(ctx)) {
			return on.performValidation(ctx);
		}
	}
	this.onValidationError(ctx);
	return false;
};

Sw.sw = function () {
	return new Sw(arguments);
};

Sw.On = On;

Sw.on = function (matchValidator, validator) {
	return new On(matchValidator, validator);
};


module.exports = Sw;
