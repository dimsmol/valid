"use strict";
var inherits = require('util').inherits;
var Nullable = require('./nullable');


var Opt = function (validators) {
	Nullable.call(this, validators);
};
inherits(Opt, Nullable);

Opt.prototype.isKeyOptional = true;

Opt.opt = function () {
	return new Opt(arguments);
};


module.exports = Opt;
