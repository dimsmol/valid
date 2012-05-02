"use strict";
var inherits = require('util').inherits;
var Validator = require('./core/validator');


var OneOf = function (values) {
	Validator.call(this);
	this.values = values;
};
inherits(OneOf, Validator);

OneOf.prototype.code = 'oneOf';
OneOf.prototype.expectedStr = 'one of allowed by dataspec';

OneOf.prototype.isValid = function (ctx) {
	for (var i = 0; i < this.values.length; i++) {
		if (this.areEqual(ctx.value, this.values[i])) {
			return true;
		}
	}
	return false;
};

OneOf.prototype.areEqual = function (v1, v2) {
	return v1 === v2;
};

OneOf.oneOf = function () {
	return new OneOf(arguments);
};

OneOf.getShort = function (corrector) {
	return OneOf.oneOf;
};


module.exports = OneOf;
