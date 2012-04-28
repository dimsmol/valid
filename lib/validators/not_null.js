"use strict";
var inherits = require('util').inherits;
var Validator = require('./core/validator');


var NotNull = function () {
	Validator.call(this);
};
inherits(NotNull, Validator);

NotNull.prototype.code = 'notNull';
NotNull.prototype.expectedStr = 'not null';

NotNull.prototype.isValid = function (ctx) {
	return ctx.value != null;
};

NotNull.notNull = new NotNull();

NotNull.getShort = function (corrector) {
	return NotNull.notNull;
};


module.exports = NotNull;
