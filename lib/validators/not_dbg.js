"use strict";
var inherits = require('util').inherits;
var Validator = require('./core/validator');


var NotDbg = function () {
	Validator.call(this);
};
inherits(NotDbg, Validator);

NotDbg.prototype.code = 'ndbg';
NotDbg.prototype.expectedStr = 'is allowed only if not in debug mode';

NotDbg.prototype.validate = function (ctx) {
	var isValid = !ctx.debug;
	if (!isValid) {
		ctx.setPropertyCheck(true);
		this.onValidationError(ctx);
		ctx.setPropertyCheck(false);
	}
	return isValid;
};

NotDbg.ndbg = new NotDbg();

NotDbg.getShort = function (corrector) {
	return NotDbg.ndbg;
};


module.exports = NotDbg;
