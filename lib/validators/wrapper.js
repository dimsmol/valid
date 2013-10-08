"use strict";
var inherits = require('util').inherits;
var Validator = require('./core/validator');
var And = require('./and');


var Wrapper = function (validator) {
	Validator.call(this);
	this.validator = validator;
};
inherits(Wrapper, Validator);

Wrapper.prototype.code = 'wrapper';

Wrapper.prototype.validate = function (ctx) {
	return this.validateByWrapped(ctx);
};

Wrapper.prototype.validateByWrapped = function (ctx) {
	return this.validator.validate(ctx);
};

Wrapper.getShort = function (corrector) {
	return function (validator) {
		validator = corrector.toValidator(validator);
		return new Wrapper(validator);
	};
};

Wrapper.wrapMany = function (validator, args, corrector) {
	if (args.length > 1) {
		var validators = corrector.toValidators(args);
		validator = new And(validators);
	}
	else {
		validator = corrector.toValidator(validator);
	}
	return validator;
};


module.exports = Wrapper;
