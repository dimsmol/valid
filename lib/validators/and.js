"use strict";
var inherits = require('util').inherits;
var Validator = require('./core/validator');


var And = function (validators) {
	Validator.call(this);
	this.validators = validators;
};
inherits(And, Validator);

And.prototype.code = 'and';

And.prototype.validate = function (ctx) {
	var wasTransformed = ctx.isTransformed;
	var isValid = true;
	for (var i = 0; i < this.validators.length; i++) {
		var validator = this.validators[i];
		isValid = validator.validate(ctx);
		if (!isValid) {
			if (!wasTransformed) {
				// NOTE could be transformed by some validator,
				// then failed on another => must reset
				ctx.resetTransform();
			}
			break;
		}
	}
	return isValid;
};

And.getShort = function (corrector) {
	return function () {
		var validators = corrector.toValidators(arguments);
		return new And(validators);
	};
};


module.exports = And;
