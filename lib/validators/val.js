"use strict";
var inherits = require('util').inherits;
var Validator = require('./core/validator');


var Val = function (value) {
	Validator.call(this);
	this.value = value;
};
inherits(Val, Validator);

Val.prototype.code = 'val';
Val.prototype.expectedStr = 'specified by dataspec';

Val.prototype.isValid = function (ctx) {
	return ctx.value === this.value;
};

Val.val = function (value) {
	return new Val(value);
};

Val.getShort = function (corrector) {
	return Val.val;
};


module.exports = Val;
