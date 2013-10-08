"use strict";
var inherits = require('util').inherits;
var Validator = require('./core/validator');


var Or = function (validators) {
	Validator.call(this);
	this.validators = validators;
};
inherits(Or, Validator);

Or.prototype.code = 'or';
Or.prototype.expectedStr = 'one of allowed by dataspec';

Or.prototype.isValid = function (ctx) {
	var result = false;
	ctx.setNoError(true);
	for (var i = 0; i < this.validators.length; i++) {
		var validator = this.validators[i];
		if (validator.validate(ctx)) {
			result = true;
			break;
		}
	}
	ctx.setNoError(false);
	return result;
};

Or.getShort = function (corrector) {
	return function () {
		var validators = corrector.toValidators(arguments);
		return new Or(validators);
	};
};


module.exports = Or;
