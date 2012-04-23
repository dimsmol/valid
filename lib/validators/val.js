"use strict";
var inherits = require('util').inherits;
var Validator = require('./core/validator');


var Val = function (value) {
	Validator.call(this);
	this.value = value;
};
inherits(Val, Validator);

Val.prototype.errorCode = 'val';
Val.prototype.expectedStr = 'specified by dataspec';

Val.prototype.isValid = function (ctx) {
	return ctx.value === this.value;
};

Val.val = function (value) {
	return new Val(value);
};


module.exports = Val;
