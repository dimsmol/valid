"use strict";
var Ctx = require('./ctx');
var validators = require('./validators');


var validate = function (data, validator, options) {
	var ctx = new Ctx(data, options);
	validator.validate(ctx);
	return ctx.errors;
};


module.exports = {
	validate: validate,
	Ctx: Ctx,
	validators: validators
};
