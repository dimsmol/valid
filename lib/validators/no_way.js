"use strict";
var inherits = require('util').inherits;
var Validator = require('./core/validator');


var NoWay = function () {
	Validator.call(this);
};
inherits(NoWay, Validator);

NoWay.prototype.code = 'noWay';
NoWay.prototype.keyOptional = true;

NoWay.prototype.isFieldProhibited = function (k) {
	return true;
};

NoWay.prototype.validate = function (ctx) {
	ctx.enterKey();
	ctx.propertyNotAllowedError(this);
	ctx.leaveKey();
	return false;
};

NoWay.noWay = new NoWay();

NoWay.getShort = function (corrector) {
	return NoWay.noWay;
};


module.exports = NoWay;
