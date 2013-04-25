"use strict";
var inherits = require('util').inherits;
var TypeValidator = require('./core/type_validator');


var DateValidator = function () {
	TypeValidator.call(this);
};
inherits(DateValidator, TypeValidator);

DateValidator.prototype.type = Date;
DateValidator.prototype.code = 'date';
DateValidator.prototype.expectedStr = 'date';

DateValidator.prototype.isTypeValid = function (ctx) {
	var isTypeValid = (ctx.value != null && ctx.value.constructor == Date);
	if (!isTypeValid && !ctx.isTransformed) {
		isTypeValid = this.tryTransform(ctx);
	}
	return isTypeValid;
};

DateValidator.prototype.tryTransform = function (ctx) {
	var isValid = false;
	if (ctx.isStrMode() && ctx.value.constructor == String) {
		var v;
		try {
			v = new Date(ctx.value);
		}
		catch (err) {
		}
		if (v != null) {
			isValid = true;
			ctx.setTransform(v);
		}
	}
	return isValid;
};

DateValidator.date = new DateValidator();

DateValidator.getShort = function (corrector) {
	return DateValidator.date;
};


module.exports = DateValidator;
