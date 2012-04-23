"use strict";
var inherits = require('util').inherits;
var Props = require('./props');


var Dict = function (keyValidators, opt_options) {
	Props.call(this, keyValidators, opt_options);
};
inherits(Dict, Props);

Dict.prototype.errorCode = 'dict';
Dict.prototype.expectedStr = 'dictionary';

Dict.prototype.isTypeValid = function (ctx) {
	return ctx.value.constructor == Object;
};

Dict.dict = function (keyValidators, opt_options) {
	return new Dict(keyValidators, opt_options);
};


module.exports = Dict;
