"use strict";
var inspect = require('util').inspect;
var mt = require('marked_types');
var Validator = require('./validators/core/validator');
var Obj = require('./validators/obj');
var Arr = require('./validators/arr');
var Val = require('./validators/val');


var SpecCorrector = function () {
};

SpecCorrector.prototype.isValidator = function (validator) {
	return mt.is(validator, Validator);
};

SpecCorrector.prototype.toValidator = function (value) {
	var result;
	if (this.isValidator(value)) {
		result = value;
	}
	else {
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
	}
	return result;
};

SpecCorrector.prototype.toObj = function (value) {
	var options = this.getObjOptions(value);
	var keyValidators = this.toValidatorsDict(value, { '~': true, '*': true });
	return new Obj(keyValidators, options);
};

SpecCorrector.prototype.getObjOptions = function (value) {
	var options = value['~'];
	if (options == null) {
		options = {};
	}
	var anyKeyValidator = value['*'];
	if (anyKeyValidator != null) {
		options['*'] = anyKeyValidator;
	}
	return options;
};

SpecCorrector.prototype.toArr = function (value) {
	var l = value.length;
	if (l > 1) {
		throw new Error('Cannot convert to validator: ' + inspect(value));
	}
	var validator;
	if (l > 0) {
		validator = this.toValidator(value[0]);
	}
	return new Arr(validator);
};

SpecCorrector.prototype.toVal = function (value) {
	return new Val(value);
};

SpecCorrector.prototype.toValidators = function (values) {
	var result = [];
	for (var i = 0; i < values.length; i++) {
		result.push(this.toValidator(values[i]));
	}
	return result;
};

SpecCorrector.prototype.toValidatorsDict = function (d, opt_excludeKeys) {
	var result = {};
	for (var k in d) {
		if (opt_excludeKeys == null || !opt_excludeKeys[k]) {
			result[k] = this.toValidator(d[k]);
		}
	}
	return result;
};


module.exports = SpecCorrector;
