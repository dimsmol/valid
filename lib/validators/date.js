"use strict";
var inherits = require('util').inherits;
var TypeValidator = require('./core/type_validator');


var DateValidator = function () {
	TypeValidator.call(this);
};
inherits(DateValidator, TypeValidator);

DateValidator.prototype.type = Date;
DateValidator.prototype.errorCode = 'date';
DateValidator.prototype.expectedStr = 'date';

DateValidator.date = new DateValidator();


module.exports = DateValidator;
