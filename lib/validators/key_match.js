"use strict";
var inherits = require('util').inherits;
var Validator = require('./core/validator');


// NOTE differs with Key in that KeyMatch will
// show underlying key matching error
// when Key just says that property is not allowed
// Use KeyMatch in cases like:
// {'*': sw(on(str, keyMatch(rx(/Str$/))), on(num, keyMatch(rx(/Num$/))))}
// (requires 'Str' suffix for string properties and 'Num' for numeric)
var KeyMatch = function (validator) {
	Validator.call(this);
	this.validator = validator;
};
inherits(KeyMatch, Validator);

KeyMatch.prototype.errorCode = 'keyMatch';

KeyMatch.prototype.validate = function (ctx) {
	ctx.enterKey();
	var isValid = this.validator.validate(ctx);
	ctx.leaveKey();
	return isValid;
};

KeyMatch.keyMatch = function (validator) {
	if (arguments.length > 1) {
		validator = new And(arguments);
	}
	return new KeyMatch(validator);
};


module.exports = KeyMatch;
