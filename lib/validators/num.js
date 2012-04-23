"use strict";
var inherits = require('util').inherits;
var TypeValueValidator = require('./core/type_value_validator');


var Num = function () {
	TypeValueValidator.call(this);
};
inherits(Num, TypeValueValidator);

Num.prototype.errorCode = 'num';
Num.prototype.expectedStr = 'number';

Num.prototype.isTypeValid = function (ctx) {
	return ctx.value.constructor == Number && isFinite(ctx.value);
};

Num.prototype.isValueValid = function (ctx) {
	return true;
};

Num.num = new Num();


module.exports = Num;
