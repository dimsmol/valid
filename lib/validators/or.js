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
	ctx.setNoError(true);
	for (var i = 0; i < this.validators.length; i++) {
		var validator = this.validators[i];
		if (validator.validate(ctx)) {
			return true;
		}
	}
	ctx.setNoError(false);
	return false;
};

Or.getShort = function (corrector) {
	return function () {
		var validators = corrector.ensureValidators(arguments);
		return new Or(validators);
	};
};


module.exports = Or;
