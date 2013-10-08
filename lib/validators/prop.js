"use strict";
var inherits = require('util').inherits;
var Wrapper = require('./wrapper');


var Prop = function (key, validator) {
	Wrapper.call(this, validator);
	this.key = key;
};
inherits(Prop, Wrapper);

Prop.prototype.code = 'prop';

Prop.prototype.validate = function (ctx) {
	var isValid;
	if (!(this.key in ctx.value)) {
		if (!this.validator.isKeyOptional(ctx)) {
			isValid = false;
			ctx.propertyRequiredError(this, this.key);
		}
	}
	else {
		ctx.enter(this.key);
		isValid = this.validateByWrapped(ctx);
		ctx.leave(this.key);
	}
	return isValid;
};

Prop.getShort = function (corrector) {
	return function (key, validator) {
		validator = corrector.toValidator(validator);
		return new Prop(key, validator);
	};
};


module.exports = Prop;
