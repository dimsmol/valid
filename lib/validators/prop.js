"use strict";
var inherits = require('util').inherits;
var Validator = require('./core/validator');


var Prop = function (key, validator) {
	Validator.call(this);
	this.key = key;
	this.validator = validator;
};
inherits(Prop, Validator);

Prop.prototype.validate = function (ctx) {
	if (ctx.value == null) {
		return true;
	}
	ctx.enter(this.key);
	var isValid = this.validator.validate(ctx);
	ctx.leave(this.key);
	return isValid;
};

Prop.prop = function (key, validator) {
	return new Prop(key, validator);
};


module.exports = Prop;
