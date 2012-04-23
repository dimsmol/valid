"use strict";
var inherits = require('util').inherits;
var Validator = require('./core/validator');


var Sibl = function (key, validator) {
	Validator.call(this);
	this.key = key;
	this.validator = validator;
};
inherits(Sibl, Validator);

Sibl.prototype.validate = function (ctx) {
	var key = ctx.key;
	ctx.leave(key);
	ctx.enter(this.key);
	var isValid = this.validator.validate(ctx);
	ctx.leave(this.key);
	ctx.enter(key);
	return isValid;
};

Sibl.sibl = function (key, validator) {
	return new Prop(key, validator);
};


module.exports = Sibl;
