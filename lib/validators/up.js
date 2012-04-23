"use strict";
var inherits = require('util').inherits;
var Validator = require('./core/validator');
var And = require('./and');


var Up = function (validator) {
	Validator.call(this);
	this.validator = validator;
};
inherits(Up, Validator);

Up.prototype.validate = function (ctx) {
	var key = ctx.key;
	ctx.leave(key);
	var isValid = this.validator.validate(ctx);
	ctx.enter(key);
	return isValid;
};

Up.up = function (validator) {
	if (arguments.length > 1) {
		validator = new And(arguments);
	}
	return new Up(validator);
};


module.exports = Up;
