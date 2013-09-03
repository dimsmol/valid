"use strict";
var inherits = require('util').inherits;
var Validator = require('./core/validator');
var Wrapper = require('./wrapper');


var Up = function (validator) {
	Wrapper.call(this, validator);
};
inherits(Up, Wrapper);

Up.prototype.code = 'up';

Up.prototype.validate = function (ctx) {
	var key = ctx.key;
	ctx.leave(key);
	var isValid = this.validateByWrapped(ctx);
	ctx.enter(key);
	return isValid;
};

Up.getShort = function (corrector) {
	return function (validator) {
		validator = Wrapper.wrapMany(validator, arguments, corrector);
		return new Up(validator);
	};
};


module.exports = Up;
