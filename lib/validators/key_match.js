"use strict";
var inherits = require('util').inherits;
var Wrapper = require('./wrapper');


// NOTE differs with Key in that KeyMatch will
// show underlying key matching error
// when Key just says that property is not allowed
// Use KeyMatch in cases like:
// {'*': sw(on(str, keyMatch(rx(/Str$/))), on(num, keyMatch(rx(/Num$/))))}
// (requires 'Str' suffix for string properties and 'Num' for numeric)
var KeyMatch = function (validator) {
	Wrapper.call(this, validator);
};
inherits(KeyMatch, Wrapper);

KeyMatch.prototype.code = 'keyMatch';

KeyMatch.prototype.validate = function (ctx) {
	ctx.enterKey();
	var isValid = this.validateByWrapped(ctx);
	ctx.leaveKey();
	return isValid;
};

KeyMatch.getShort = function (corrector) {
	return function (validator) {
		validator = Wrapper.wrapMany(validator, arguments, corrector);
		return new KeyMatch(validator);
	};
};


module.exports = KeyMatch;
