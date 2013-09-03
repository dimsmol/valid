"use strict";
var inherits = require('util').inherits;
var Wrapper = require('./wrapper');


// NOTE differs with KeyMatch in that KeyMatch will
// show underlying key matching error
// when Key just says that property is not allowed
// Use Key in cases like:
// {'*': v(key(rx(/^userProp/)), str)}
// (allows only string properties started with 'userProp')
var Key = function (validator) {
	Wrapper.call(this, validator);
};
inherits(Key, Wrapper);

Key.prototype.code = 'key';

Key.prototype.validate = function (ctx) {
	ctx.enterKey();
	ctx.setNoError(true);
	var isValid = this.validateByWrapped(ctx);
	ctx.setNoError(false);
	if (!isValid) {
		ctx.propertyNotAllowedError(this);
	}
	ctx.leaveKey();
	return isValid;
};

Key.getShort = function (corrector) {
	return function (validator) {
		validator = Wrapper.wrapMany(validator, arguments, corrector);
		return new Key(validator);
	};
};


module.exports = Key;
