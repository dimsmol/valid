"use strict";
var inspect = require('util').inspect;
var Validator = require('./validators/core/validator');
var Obj = require('./validators/obj');
var Arr = require('./validators/arr');
var Val = require('./validators/val');


var SpecCorrector = function () {
};

SpecCorrector.prototype.isValidator = function (validator) {
	return validator instanceof Validator;
};

SpecCorrector.prototype.toValidator = function (value) {
	var result;
	if (value != null) {
		var ctor = value.constructor;
		if (ctor == Object) {
			result = this.toObj(value);
		}
		else if (ctor == Array) {
			result = this.toArr(value);
		}
		else if (ctor == String || ctor == Number) {
			result = this.toVal(value);
		}
	}
	else if (value == null) {
		result = this.toVal(value);
	}
	if (result == null) {
		throw new Error('Cannot convert to validator: ' + inspect(value));
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

SpecCorrector.prototype.toVal = function (value) {
	return new Val(value);
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
