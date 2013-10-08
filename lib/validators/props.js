"use strict";
var inherits = require('util').inherits;
var TypeValueValidator = require('./core/type_value_validator');
var Opt = require('./opt');


var Props = function (keyValidators, opt_options) {
	TypeValueValidator.call(this);
	this.keyValidators = keyValidators;
	var options = opt_options || {};
	this.anyKeyValidator = options['*'];
	this.strictNotOwn = options.strictNotOwn;
};
inherits(Props, TypeValueValidator);

Props.prototype.code = 'props';

Props.prototype.isTypeValid = function (ctx) {
	return ctx.value != null;
};

Props.prototype.isValueValid = function (ctx) {
	var k, validator;
	var present = {};
	var isValid = true;
	var owner = ctx.value;
	var doStop = false;
	for (k in ctx.value) {
		present[k] = true;
		ctx.enter(k);
		validator = this.keyValidators[k];
		if (validator != null || this.strictNotOwn || owner.hasOwnProperty(k)) {
			if (validator == null) {
				validator = this.anyKeyValidator;
			}
			if (validator == null) {
				ctx.propertyNotAllowedError(this);
				isValid = false;
			}
			else {
				if(!validator.validate(ctx)) {
					isValid = false;
				}
			}
		}
		ctx.leave(k);
		if (!isValid && ctx.options.stopOnFirstError) {
			doStop = true;
			break;
		}
	}
	if (!doStop) {
		for (k in this.keyValidators) {
			if (!(k in present)) {
				validator = this.keyValidators[k];
				if (!validator.isKeyOptional(ctx)) {
					ctx.propertyRequiredError(this, k);
					isValid = false;
					if (ctx.options.stopOnFirstError) {
						doStop = true;
						break;
					}
				}
			}
		}
	}
	return isValid;
};

Props.prototype.onValueError = function (ctx) {
};

Props.getShort = function (corrector) {
	return function (keyValidators, opt_options) {
		keyValidators = corrector.toValidatorsDict(keyValidators);
		return new Props(keyValidators, opt_options);
	};
};


module.exports = Props;
