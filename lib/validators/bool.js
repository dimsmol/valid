"use strict";
var inherits = require('util').inherits;
var TypeValidator = require('./core/type_validator');


var Bool = function () {
	TypeValidator.call(this);
};
inherits(Bool, TypeValidator);

Bool.prototype.type = Boolean;
Bool.prototype.errorCode = 'bool';
Bool.prototype.expectedStr = 'boolean (true or false)';

Bool.bool = new Bool();


module.exports = Bool;
