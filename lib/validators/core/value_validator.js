"use strict";
var inherits = require('util').inherits;
var Validator = require('./validator');


var ValueValidator = function () {
	Validator.call(this);
};
inherits(ValueValidator, Validator);

ValueValidator.prototype.isValid = function (ctx) {
	return ctx.value != null && this.isValueValid(ctx);
};

ValueValidator.prototype.isValueValid = function (ctx) {
	return false;
};


module.exports = ValueValidator;
