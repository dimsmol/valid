"use strict";
var inherits = require('util').inherits;
var Validator = require('./core/validator');


var Dbg = function () {
	Validator.call(this);
};
inherits(Dbg, Validator);

Dbg.prototype.code = 'dbg';
Dbg.prototype.expectedStr = 'is allowed in debug mode only';

Dbg.prototype.validate = function (ctx) {
	var isValid = ctx.debug;
	if (!isValid) {
		ctx.setPropertyCheck(true);
		this.onValidationError(ctx);
		ctx.setPropertyCheck(false);
	}
	return isValid;
};

Dbg.dbg = new Dbg();

Dbg.getShort = function (corrector) {
	return Dbg.dbg;
};


module.exports = Dbg;
