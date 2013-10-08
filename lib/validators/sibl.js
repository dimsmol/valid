"use strict";
var inherits = require('util').inherits;
var Prop = require('./prop');


var Sibl = function (key, validator) {
	Prop.call(this, key, validator);
};
inherits(Sibl, Prop);

Sibl.prototype.code = 'sibl';

Sibl.prototype.validate = function (ctx) {
	var key = ctx.key;
	ctx.leave(key);
	var isValid = Sibl.super_.prototype.validate.call(this, ctx);
	ctx.enter(key);
	return isValid;
};

Sibl.getShort = function (corrector) {
	return function (key, validator) {
		validator = corrector.toValidator(validator);
		return new Sibl(key, validator);
	};
};


module.exports = Sibl;
