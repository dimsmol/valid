"use strict";
var inherits = require('util').inherits;
var And = require('./and');


var Nullable = function (validators) {
	And.call(this, validators);
};
inherits(Nullable, And);

Nullable.prototype.validate = function (ctx) {
	if (ctx.value == null) {
		return true;
	}
	return Nullable.super_.prototype.validate.call(this, ctx);
};

Nullable.nul = function () {
	return new Nullable(arguments);
};


module.exports = Nullable;
