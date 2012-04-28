"use strict";
var Validator = require('./validators/core/validator');
var Wrapper = require('./validators/core/wrapper');
var Obj = require('./validators/obj');
var Arr = require('./validators/arr');


var SpecCorrector = function () {
};

SpecCorrector.prototype.isValidator = function (validator) {
	return validator instanceof Validator;
};

SpecCorrector.prototype.toValidator = function (value) {
	var result;
	if (value != null) {
		if (value.constructor == Object) {
			result = this.toObj(value);
		}
		else if (value.constructor == Array) {
			result = this.toArr(value);
		}
	}
	if (result == null) {
		throw new Error('Cannot convert to validator');
	}
	return result;
};

SpecCorrector.prototype.toObj = function (value) {
	var options = this.gatherObjOptions(value);
	var keyValidators = this.ensureValidatorsDict(value);
	return new Obj(keyValidators, options);
};

SpecCorrector.prototype.gatherObjOptions = function (value) {
	var options = value['~'];
	if (options != null) {
		delete value['~'];
	}
	else {
		options = {};
	}
	var anyKeyValidator = value['*'];
	if (anyKeyValidator != null) {
		delete value['*'];
		options['*'] = anyKeyValidator;
	}
	return options;
};

SpecCorrector.prototype.toArr = function (value) {
	var l = value.length;
	if (l > 1) {
		throw new Error();
	}
	var validator;
	if (l > 0) {
		validator = this.ensureValidator(value[0]);
	}
	return new Arr(validator);
};

SpecCorrector.prototype.ensureValidator = function (value) {
	var validator;
	if (!this.isValidator(value)) {
		validator = this.toValidator(value);
	}
	else {
		validator = value;
	}
	return validator;
};

SpecCorrector.prototype.ensureValidators = function (values) {
	for (var i = 0; i < values.length; i++) {
		var value = values[i];
		if (!this.isValidator(value)) {
			values[i] = this.toValidator(value);
		}
	}
	return values;
};

SpecCorrector.prototype.ensureValidatorsDict = function (d) {
	for (var k in d) {
		var value = d[k];
		if (!this.isValidator(value)) {
			d[k] = this.toValidator(value);
		}
	}
	return d;
};


module.exports = SpecCorrector;
