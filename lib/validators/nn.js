"use strict";
var inherits = require('util').inherits;
var Validator = require('./core/validator');


var NotNull = function () {
	Validator.call(this);
};
inherits(NotNull, Validator);

NotNull.prototype.errorCode = 'nn';
NotNull.prototype.expectedStr = 'not null';

NotNull.prototype.isValid = function (ctx) {
	return ctx.value != null;
};

NotNull.nn = new NotNull();


module.exports = NotNull;
