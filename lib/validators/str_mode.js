"use strict";
var inherits = require('util').inherits;
var Wrapper = require('./wrapper');


var StrMode = function (validator) {
	Wrapper.call(this, validator);
};
inherits(StrMode, Wrapper);

StrMode.prototype.code = 'strMode';

StrMode.prototype.validate = function (ctx) {
	ctx.setStrMode(true);
	var isValid = this.validateByWrapped(ctx);
	ctx.setStrMode(false);
	return isValid;
};

StrMode.getShort = function (corrector) {
	return function (validator) {
		validator = Wrapper.wrapMany(validator, arguments, corrector);
		return new StrMode(validator);
	};
};


module.exports = StrMode;
