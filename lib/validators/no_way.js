"use strict";
var inherits = require('util').inherits;
var Validator = require('./core/validator');


var NoWay = function () {
	Validator.call(this);
};
inherits(NoWay, Validator);

NoWay.prototype.code = 'noWay';
NoWay.prototype.expectedStr = 'is not allowed';
NoWay.prototype.keyOptional = true;

NoWay.prototype.validate = function (ctx) {
	ctx.enterKey();
	this.onValidationError(ctx);
	ctx.leaveKey();
	return false;
};

NoWay.noWay = new NoWay();

NoWay.getShort = function (corrector) {
	return NoWay.noWay;
};


module.exports = NoWay;
