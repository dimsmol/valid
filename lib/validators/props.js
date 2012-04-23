"use strict";
var inherits = require('util').inherits;
var TypeValueValidator = require('./core/type_value_validator');
var Opt = require('./opt');
var HasKey = require('./has_key');
var Key = require('./key');


var Props = function (keyValidators, opt_options) {
	TypeValueValidator.call(this);
	this.keyValidators = keyValidators;
	var options = opt_options || {};
	this.anyKeyValidator = options['*'];
	this.strictNotOwn = options.strictNotOwn;
};
inherits(Props, TypeValueValidator);

Props.prototype.isTypeValid = function (ctx) {
	return true;
};

Props.prototype.isValueValid = function (ctx) {
	var k, validator;
	var present = {};
	var isValid = true;
	var owner = ctx.value;
	for (k in ctx.value) {
		present[k] = true;
		ctx.enter(k);
		validator = this.keyValidators[k];
		if (validator != null || this.strictNotOwn || owner.hasOwnProperty(k)) {
			if (validator == null) {
				validator = this.anyKeyValidator;
			}
			if (validator == null) {
				new Key(k).reportValidationError(ctx);
				isValid = false;
			}
			else {
				if(!validator.validate(ctx)) {
					isValid = false;
				}
			}
		}
		ctx.leave(k);
	}
	for (k in this.keyValidators) {
		if (k != '*' && !(k in present)) {
			validator = this.keyValidators[k];
			if (!validator.isKeyOptional) {
				new HasKey(k).reportValidationError(ctx);
				isValid = false;
			}
		}
	}
	return isValid;
};

Props.prototype.onValueError = function (ctx) {
};

Props.props = function (keyValidators, opt_options) {
	return new Props(keyValidators, opt_options);
};


module.exports = Props;
