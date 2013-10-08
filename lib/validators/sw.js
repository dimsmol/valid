"use strict";
var inherits = require('util').inherits;
var Validator = require('./core/validator');


var On = function (matchValidator, validator) {
	this.matchValidator = matchValidator;
	this.validator = validator;
};

On.prototype.matches = function (ctx) {
	ctx.setNoError(true);
	var matches = this.matchValidator.validate(ctx);
	ctx.setNoError(false);
	return matches;
};

On.prototype.performValidation = function (ctx) {
	return this.validator.validate(ctx);
};

On.prototype.isKeyOptional = function (ctx) {
	return this.validator.isKeyOptional(ctx);
};


var Sw = function (onClauses) {
	Validator.call(this);
	this.onClauses = onClauses;
};
inherits(Sw, Validator);

Sw.prototype.code = 'sw';
Sw.prototype.expectedStr = 'one of provided by dataspec';

Sw.prototype.isKeyOptional = function (ctx) {
	for (var i = 0; i < this.onClauses.length; i++) {
		var on = this.onClauses[i];
		if (on.matches(ctx)) {
			return on.isKeyOptional(ctx);
		}
	}
	return false;
};

Sw.prototype.validate = function (ctx) {
	var found = false;
	var result = false;
	for (var i = 0; i < this.onClauses.length; i++) {
		var on = this.onClauses[i];
		var wasTransformed = ctx.isTransformed;
		if (on.matches(ctx)) {
			var isValid = on.performValidation(ctx);
			if (!wasTransformed && !isValid) {
				// NOTE could be transformed by on.matches()
				ctx.resetTransform();
			}
			found = true;
			result = isValid;
			break;
		}
	}
	if (!found) {
		this.onValidationError(ctx);
	}
	return result;
};

Sw.On = On;

Sw.getShort = function (corrector) {
	var result = function () {
		return new Sw(arguments);
	};
	result.on = function (matchValidator, validator) {
		matchValidator = corrector.toValidator(matchValidator);
		validator = corrector.toValidator(validator);
		return new On(matchValidator, validator);
	};
	return result;
};


module.exports = Sw;
