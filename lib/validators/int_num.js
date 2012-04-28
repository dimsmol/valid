"use strict";
var inherits = require('util').inherits;
var Num = require('./num');


var IntNum = function () {
	Num.call(this);
};
inherits(IntNum, Num);

IntNum.prototype.code = 'intNum';
IntNum.prototype.expectedStr = 'integer';

IntNum.prototype.isValueValid = function (ctx) {
	// WARN does not guarantee that value is not large inaccurate float
	// add len() check when need
	return Math.floor(ctx.value) === ctx.value;
};

Num.prototype.transformableStrRe = /^[\+\-]?\d+$/;

IntNum.prototype.tryTransform = function (ctx) {
	var isValid = false;
	if (ctx.isStrMode() && ctx.value.constructor == String && this.transformableStrRe.test(ctx.value)) {
		var v = parseInt(ctx.value, 10);
		if (!isNaN(v)) {
			isValid = true;
			ctx.setTransform(v);
		}
	}
	return isValid;
};

IntNum.intNum = new IntNum();

IntNum.getShort = function (corrector) {
	return IntNum.intNum;
};


module.exports = IntNum;
