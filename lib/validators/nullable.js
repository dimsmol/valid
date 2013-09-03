"use strict";
var inherits = require('util').inherits;
var Wrapper = require('./wrapper');


var Nullable = function (validator) {
	Wrapper.call(this, validator);
};
inherits(Nullable, Wrapper);

Nullable.prototype.code = 'nul';

Nullable.prototype.validate = function (ctx) {
	if (ctx.value == null) {
		return true;
	}
	return this.validateByWrapped(ctx);
};

Nullable.getShort = function (corrector) {
	return function (validator) {
		validator = Wrapper.wrapMany(validator, arguments, corrector);
		return new Nullable(validator);
	};
};


module.exports = Nullable;
