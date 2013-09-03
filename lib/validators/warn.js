"use strict";
var inherits = require('util').inherits;
var Wrapper = require('./wrapper');


var Warn = function (validator) {
	Wrapper.call(this, validator);
};
inherits(Warn, Wrapper);

Warn.prototype.code = 'warn';

Warn.prototype.validate = function (ctx) {
	ctx.setWarningMode(true);
	this.validateByWrapped(ctx);
	ctx.setWarningMode(false);
	return true;
};

Warn.getShort = function (corrector) {
	return function (validator) {
		validator = Wrapper.wrapMany(validator, arguments, corrector);
		return new Warn(validator);
	};
};


module.exports = Warn;
