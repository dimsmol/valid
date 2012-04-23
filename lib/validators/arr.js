"use strict";
var inherits = require('util').inherits;
var TypeValueValidator = require('./core/type_value_validator');


var Arr = function (opt_validator) {
	TypeValueValidator.call(this);
	this.validator = opt_validator;
};
inherits(Arr, TypeValueValidator);

Arr.prototype.errorCode = 'arr';
Arr.prototype.expectedStr = 'array';

Arr.prototype.isTypeValid = function (ctx) {
	return ctx.value.constructor == Array;
};

Arr.prototype.isValueValid = function (ctx) {
	var isValid = true;
	if (this.validator != null) {
		for (var i = 0; i < ctx.value.length; i++) {
			ctx.enter(i);
			if (!this.validator.validate(ctx)) {
				isValid = false;
			}
			ctx.leave(i);
		}
	}
	return isValid;
};

Arr.prototype.onValueError = function (ctx) {
};

Arr.arr = function (opt_validator) {
	return new Arr(opt_validator);
};


module.exports = Arr;
