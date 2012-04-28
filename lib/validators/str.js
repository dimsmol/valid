"use strict";
var inherits = require('util').inherits;
var TypeValidator = require('./core/type_validator');


var Str = function () {
	TypeValidator.call(this);
};
inherits(Str, TypeValidator);

Str.prototype.type = String;
Str.prototype.code = 'str';
Str.prototype.expectedStr = 'string';

Str.str = new Str();

Str.getShort = function (corrector) {
	return Str.str;
};


module.exports = Str;
