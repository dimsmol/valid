"use strict";
var inherits = require('util').inherits;
var Validator = require('./core/validator');


var ApplyTransform = function () {
	Validator.call(this);
};
inherits(ApplyTransform, Validator);

ApplyTransform.prototype.code = 'applyTransform';

ApplyTransform.prototype.validate = function (ctx) {
	ctx.applyTransform();
	return true;
};

ApplyTransform.applyTransform = new ApplyTransform();

ApplyTransform.getShort = function (corrector) {
	return ApplyTransform.applyTransform;
};


module.exports = ApplyTransform;
