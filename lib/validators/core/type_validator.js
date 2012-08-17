"use strict";
var inherits = require('util').inherits;
var Validator = require('./validator');


var TypeValidator = function () {
	Validator.call(this);
};
inherits(TypeValidator, Validator);

TypeValidator.prototype.type = null;

TypeValidator.prototype.isValid = function (ctx) {
	return this.isTypeValid(ctx);
};

TypeValidator.prototype.isTypeValid = function (ctx) {
	return ctx.value != null && ctx.value.constructor == this.type;
};


module.exports = TypeValidator;
