"use strict";
var inherits = require('util').inherits;
var Props = require('./props');


var Obj = function (keyValidators, opt_options) {
	Props.call(this, keyValidators, opt_options);
};
inherits(Obj, Props);

Obj.prototype.code = 'obj';
Obj.prototype.expectedStr = 'object';

Obj.prototype.isTypeValid = function (ctx) {
	return ctx.value != null && ctx.value.constructor == Object;
};

Obj.getShort = function (corrector) {
	return function (keyValidators, opt_options) {
		keyValidators = corrector.toValidatorsDict(keyValidators);
		return new Obj(keyValidators, opt_options);
	};
};


module.exports = Obj;
