"use strict";
var inherits = require('util').inherits;
var Validator = require('./core/validator');


var Except = function (values) {
	Validator.call(this);
	this.values = values;
};
inherits(Except, Validator);

Except.prototype.code = 'exc';
Except.prototype.expectedStr = 'none of mentioned by dataspec';

Except.prototype.isValid = function (ctx) {
	for (var i = 0; i < this.values.length; i++) {
		if (this.areEqual(ctx.value, this.values[i])) {
			return false;
		}
	}
	return true;
};

Except.prototype.areEqual = function (v1, v2) {
	return v1 === v2;
};

Except.exc = function () {
	return new Except(arguments);
};

Except.getShort = function (corrector) {
	return Except.exc;
};


module.exports = Except;
