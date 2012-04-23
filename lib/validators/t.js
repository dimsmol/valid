"use strict";
var inherits = require('util').inherits;
var Prop = require('./prop');
var And = require('./and');


var T = function (validator) {
	Prop.call(this, '_type', validator);
};
inherits(Prop, T);

T.t = function (validator) {
	if (arguments.length > 1) {
		validator = new And(arguments);
	}
	return new T(validator);
};


module.exports = T;
