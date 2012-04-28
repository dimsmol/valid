"use strict";
var inherits = require('util').inherits;
var ValueValidator = require('./core/value_validator');


var Rx = function (re) {
	ValueValidator.call(this);
	this.re = re;
};
inherits(Rx, ValueValidator);

Rx.prototype.code = 'rx';

Rx.prototype.getExpectedStr = function () {
	return ['matching regexp ', this.re].join('');
};

Rx.prototype.isValueValid = function (ctx) {
	return this.re.test(ctx.value);
};

Rx.rx = function (re) {
	return new Rx(re);
};

Rx.getShort = function (corrector) {
	return Rx.rx;
};


module.exports = Rx;
