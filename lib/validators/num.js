"use strict";
var inherits = require('util').inherits;
var TypeValueValidator = require('./core/type_value_validator');


var Num = function () {
	TypeValueValidator.call(this);
};
inherits(Num, TypeValueValidator);

Num.prototype.code = 'num';
Num.prototype.expectedStr = 'number';

Num.prototype.isTypeValid = function (ctx) {
	var isTypeValid = (ctx.value != null && ctx.value.constructor == Number);
	if (!isTypeValid && !ctx.isTransformed) {
		isTypeValid = this.tryTransform(ctx);
	}
	return isTypeValid;
};

Num.prototype.transformableStrRe = /^[\+\-]?\d+(\.\d*)?(e[\+\-]?\d+)?$/;
Num.prototype.floatCheckRe = /[\.e]/;

Num.prototype.tryTransform = function (ctx) {
	var isValid = false;
	if (ctx.isStrMode() && ctx.value.constructor == String && this.transformableStrRe.test(ctx.value)) {
		var v;
		if (this.floatCheckRe.test(ctx.value)) {
			v = parseFloat(ctx.value);
		}
		else {
			v = parseInt(ctx.value, 10);
		}
		if (!isNaN(v)) {
			isValid = true;
			ctx.setTransform(v);
		}
	}
	return isValid;
};

Num.prototype.isValueValid = function (ctx) {
	return isFinite(ctx.value);
};

Num.num = new Num();

Num.getShort = function (corrector) {
	return Num.num;
};


module.exports = Num;
