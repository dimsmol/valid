"use strict";
var inherits = require('util').inherits;
var TypeValidator = require('./core/type_validator');


var Is = function (type, opt_typeName) {
	TypeValidator.call(this);
	this.type = type;
	this.typeName = opt_typeName || (type.prototype != null ? type.prototype.name : null);
};
inherits(Is, TypeValidator);

Is.prototype.code = 'is';
Is.prototype.getExpectedStr = function () {
	return this.typeName || 'type specified by dataspec';
};

Is.is = function (type, opt_typeName) {
	return new Is(type, opt_typeName);
};

Is.getShort = function (corrector) {
	return Is.is;
};


module.exports = Is;
