"use strict";
var inherits = require('util').inherits;
var Wrapper = require('./wrapper');


var Not = function (validator) {
	Wrapper.call(this, validator);
};
inherits(Not, Wrapper);

Not.prototype.code = 'not';
Not.prototype.expectedStr = 'allowed by dataspec';

Not.prototype.isValid = function (ctx) {
	var wasTransformed = ctx.isTransformed;
	ctx.setNoError(true);
	var isWrappedValid = this.validateByWrapped(ctx);
	ctx.setNoError(false);
	if (!wasTransformed && isWrappedValid) {
		ctx.resetTransform();
	}
	return !isWrappedValid;
};

Not.getShort = function (corrector) {
	return function (validator) {
		validator = corrector.toValidator(validator);
		return new Not(validator);
	};
};


module.exports = Not;
