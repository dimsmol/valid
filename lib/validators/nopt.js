"use strict";
var inherits = require('util').inherits;
var And = require('./and');


var Nopt = function (validators) {
	And.call(this, validators);
};
inherits(Nopt, And);

Nopt.prototype.isKeyOptional = true;

Nopt.nopt = function () {
	return new Opt(arguments);
};


module.exports = Nopt;
