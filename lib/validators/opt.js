"use strict";
var inherits = require('util').inherits;
var Nullable = require('./nullable');
var Wrapper = require('./wrapper');


var Opt = function (validator) {
	Nullable.call(this, validator);
};
inherits(Opt, Nullable);

Opt.prototype.code = 'opt';
Opt.prototype.keyOptional = true;

Opt.getShort = function (corrector) {
	return function (validator) {
		validator = Wrapper.wrapMany(validator, arguments, corrector);
		return new Opt(validator);
	};
};


module.exports = Opt;
