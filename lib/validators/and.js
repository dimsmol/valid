"use strict";
var inherits = require('util').inherits;
var Validator = require('./core/validator');


var And = function (validators) {
	Validator.call(this);
	this.validators = validators;
};
inherits(And, Validator);

And.prototype.validate = function (ctx) {
	for (var k in this.validators) {
		var validator = this.validators[k];
		if (!validator.validate(ctx)) {
			return false;
		}
	}
	return true;
};

And.and = function () {
	return new And(arguments);
};


module.exports = And;
