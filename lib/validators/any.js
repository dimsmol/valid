"use strict";
var inherits = require('util').inherits;
var Validator = require('./core/validator');


var Any = function () {
	Validator.call(this);
};
inherits(Any, Validator);

Any.prototype.validate = function (ctx) {
	return true;
};

Any.any = new Any();


module.exports = Any;
