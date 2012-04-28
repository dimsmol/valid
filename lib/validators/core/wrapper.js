"use strict";
var inherits = require('util').inherits;
var Validator = require('./validator');
var And = require('../and');


var Wrapper = function (validator) {
	Validator.call(this);
	this.validator = validator;
};
inherits(Wrapper, Validator);

Wrapper.prototype.validate = function (ctx) {
	return this.validateByWrapped(ctx);
};

Wrapper.prototype.validateByWrapped = function (ctx) {
	return this.validator.validate(ctx);
};

Wrapper.wrapMany = function (validator, args, corrector) {
	if (args.length > 1) {
		var validators = corrector.ensureValidators(args);
		validator = new And(validators);
	}
	else {
		validator = corrector.ensureValidator(validator);
	}
	return validator;
};


module.exports = Wrapper;
