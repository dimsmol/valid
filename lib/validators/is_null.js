"use strict";
var inherits = require('util').inherits;
var Validator = require('./core/validator');


var IsNull = function () {
	Validator.call(this);
};
inherits(IsNull, Validator);

IsNull.prototype.code = 'isNull';
IsNull.prototype.expectedStr = 'null';

IsNull.prototype.isValid = function (ctx) {
	return ctx.value == null;
};

IsNull.isNull = new IsNull();

IsNull.getShort = function (corrector) {
	return IsNull.isNull;
};


module.exports = IsNull;
