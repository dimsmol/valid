"use strict";
var inherits = require('util').inherits;
var TypeValidator = require('./core/type_validator');


var Bool = function () {
	TypeValidator.call(this);
};
inherits(Bool, TypeValidator);

Bool.prototype.type = Boolean;
Bool.prototype.code = 'bool';
Bool.prototype.expectedStr = 'boolean (true or false)';

Bool.bool = new Bool();

Bool.getShort = function (corrector) {
	return Bool.bool;
};


module.exports = Bool;
