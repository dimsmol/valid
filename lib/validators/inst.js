"use strict";
var inherits = require('util').inherits;
var TypeValidator = require('./core/type_validator');


var Inst = function (type, opt_typeName) {
	TypeValidator.call(this);
	this.type = type;
	this.typeName = opt_typeName || (type.prototype != null ? type.prototype.name : null);
};
inherits(Inst, TypeValidator);

Inst.prototype.code = 'inst';
Inst.prototype.getExpectedStr = function () {
	return 'instance of ' + (this.typeName || 'type specified by dataspec');
};

Inst.prototype.isTypeValid = function (ctx) {
	return ctx.value instanceof this.type;
};

Inst.inst = function (type, opt_typeName) {
	return new Inst(type, opt_typeName);
};

Inst.getShort = function (corrector) {
	return Inst.inst;
};


module.exports = Inst;
