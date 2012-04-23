"use strict";
var inherits = require('util').inherits;
var Validator = require('./core/validator');


var Or = function (validators) {
	Validator.call(this);
	this.validators = validators;
};
inherits(Or, Validator);

Or.prototype.errorCode = 'or';
Or.prototype.expectedStr = 'one of allowed by dataspec';

Or.prototype.isValid = function (ctx) {
	ctx.setNoError(true);
	for (var k in this.validators) {
		var validator = this.validators[k];
		if (validator.validate(ctx)) {
			return true;
		}
	}
	ctx.setNoError(false);
	return false;
};

Or.or = function () {
	return new Or(arguments);
};


module.exports = Or;
