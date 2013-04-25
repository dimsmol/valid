"use strict";
var applyDefaults = require('ops').applyDefaults;


var Ctx = function (value, options) {
	this.value = value;
	this.options = applyDefaults(options, this.getDefaultOptions());

	this.key = null;
	this.keyAsValue = false; // allows to use key as value in validators

	this.stack = [];
	this.warnings = [];
	this.errors = [];

	this.isTransformed = false;
	this.origValue = null;

	this.noErrorCounter = 0;
	this.warningModeCounter = 0;
	this.strModeCounter = 0;
};

Ctx.prototype.getDefaultOptions = function () {
	return {
		stopOnFirstError: true,
		debug: false,
		errors: {
			needValidatorInfo: false,
			needValidator: false,
			needMessage: false
		},
		warnings: {
			needValidatorInfo: false,
			needValidator: false,
			needMessage: false
		}
	};
};

Ctx.prototype.isNoError = function () {
	return this.noErrorCounter > 0;
};

Ctx.prototype.setNoError = function (value) {
	this.noErrorCounter += value ? 1 : -1;
};

Ctx.prototype.isWarningMode = function () {
	return this.warningModeCounter > 0;
};

Ctx.prototype.setWarningMode = function (value) {
	this.warningModeCounter += value ? 1 : -1;
};

Ctx.prototype.isStrMode = function () {
	return this.strModeCounter > 0;
};

Ctx.prototype.setStrMode = function (value) {
	this.strModeCounter += value ? 1 : -1;
};

Ctx.prototype.setTransform = function (value) {
	this.origValue = this.value;
	this.isTransformed = true;
	this.value = value;
};

Ctx.prototype.resetTransform = function () {
	if (this.isTransformed) {
		this.value = this.origValue;
		this.isTransformed = false;
	}
};

Ctx.prototype.applyTransform = function () {
	if (this.isTransformed && this.stack.length > 0 && !this.keyAsValue) {
		var item = this.stack[this.stack.length - 1];
		item.value[this.key] = this.value;
	}
};

Ctx.prototype.enter = function (key) {
	if (this.keyAsValue) {
		throw new Error('Cannot enter while within key');
	}
	this.pushToStack();
	this.key = key;
	this.value = this.value[key];
	this.isTransformed = false;
};

Ctx.prototype.leave = function (key) {
	if (key != this.key) {
		throw new Error(['Stack mismatch, got ', JSON.stringify(key), ' while ', JSON.stringify(this.key), ' expected'].join(''));
	}
	this.popFromStack();
};

Ctx.prototype.pushToStack = function () {
	var item = {
		key: this.key,
		value: this.value
	};
	if (this.isTransformed) {
		item.isTransformed = true;
		item.origValue = this.origValue;
	}
	this.stack.push(item);
};

Ctx.prototype.popFromStack = function () {
	var item = this.stack.pop();
	this.key = item.key;
	this.value = item.value;
	if (item.isTransformed) {
		this.isTransformed = true;
		this.origValue = item.origValue;
	}
	else {
		this.isTransformed = false;
		this.origValue = null;
	}
};

Ctx.prototype.enterKey = function () {
	if (this.keyAsValue) {
		throw new Error('Already within key');
	}
	this.pushToStack();
	this.keyAsValue = true;
	this.value = this.key;
	this.isTransformed = false;
};

Ctx.prototype.leaveKey = function () {
	this.popFromStack();
	this.keyAsValue = false;
};

Ctx.prototype.getPath = function () {
	var result = [];
	for (var i = 0; i < this.stack.length; i++) {
		var item = this.stack[i];
		var key = item.key;
		if (key != null) {
			result.push(key);
		}
	}
	if (!this.keyAsValue && this.key != null) {
		result.push(this.key);
	}
	return result;
};

Ctx.prototype.getPathStr = function () {
	var items = [];
	var count = 0;
	for (var i = 0; i < this.stack.length; i++) {
		var item = this.stack[i];
		var key = item.key;
		if (key != null) {
			this.addKeyStr(items, key);
			count++;
		}
	}
	if (!this.keyAsValue && this.key != null) {
		this.addKeyStr(items, this.key);
		count++;
	}
	if (count === 0) {
		return null;
	}
	if (count == 1) {
		if (items.length == 1) {
			return JSON.stringify(items[0]);
		}
		else if (items[1][0] == '"') {
			return items[1];
		}
	}
	return items.join('');
};

Ctx.prototype.allowDotSyntaxRe = /^[a-zA-Z_]\w*$/;

Ctx.prototype.addKeyStr = function (items, key) {
	var useDotSyntax = true;
	if (key.constructor == Number) {
		useDotSyntax = false;
	}
	else if (!this.allowDotSyntaxRe.test(key)) {
		useDotSyntax = false;
		key = JSON.stringify(key);
	}
	if (useDotSyntax) {
		if (items.length > 0) {
			items.push('.');
		}
		items.push(key);
	}
	else {
		items.push('[');
		items.push(key);
		items.push(']');
	}
};

Ctx.prototype.createValidationError = function (validator, subErrorCode, options) {
	var result = {
		path: this.getPath(),
		isKeyError: this.keyAsValue || this.isKeySubErrorCode(subErrorCode),
		code: validator.getCode()
	};
	if (subErrorCode != null) {
		result.subCode = subErrorCode;
	}
	if (options.needValidatorInfo) {
		var info = validator.getInfo();
		if (info) {
			result.validatorInfo = info;
		}
	}
	if (options.needValidator) {
		result.validator = validator;
	}
	if (options.needMessage) {
		result.message = this.createErrorMessage(validator, subErrorCode);
	}
	return result;
};

Ctx.prototype.isKeySubErrorCode = function (code) {
	return code == 'keyRequired' || code == 'keyNotAllowed';
};

Ctx.prototype.createErrorMessage = function (validator, subErrorCode) {
	var result;
	if (subErrorCode != null) {
		result = this.createSubErrorMessage(validator, subErrorCode);
	}
	else {
		result = this.createSimpleErrorMessage(validator);
	}
	return result;
};

Ctx.prototype.createSubErrorMessage = function (validator, subErrorCode) {
	var path = this.getPathStr();
	var subErrorMsg;
	switch (subErrorCode) {
		case 'keyRequired':
			subErrorMsg = 'is required';
			break;
		case 'keyNotAllowed':
			subErrorMsg = 'is not allowed';
			break;
		default:
			throw new Error('Unknown subErrorCode "' + subErrorCode + '"');
	}
	var items = [
		'Property ',
		path ? path + ' ' : '',
		subErrorMsg
	];
	return items.join('');
};

Ctx.prototype.createSimpleErrorMessage = function (validator) {
	var path = this.getPathStr();
	var items = [
		'Invalid ',
		path ? path + ' ' : '',
		this.keyAsValue ? 'key': 'property value',
		', expected ',
		validator.getExpectedStr()
	];
	return items.join('');
};

Ctx.prototype.validationError = function (validator) {
	this.validationErrorInternal(validator);
};

Ctx.prototype.validationErrorInternal = function (validator, subErrorCode) {
	if (!this.isNoError()) {
		var isWarning = this.isWarningMode();
		var options = isWarning ? this.options.warnings : this.options.errors;
		var error = this.createValidationError(validator, subErrorCode, options);
		if (isWarning) {
			this.warnings.push(error);
		}
		else {
			this.errors.push(error);
		}
	}
};

Ctx.prototype.propertyRequiredError = function (validator, key) {
	this.enter(key);
	this.validationErrorInternal(validator, 'keyRequired');
	this.leave(key);
};

Ctx.prototype.propertyNotAllowedError = function (validator) {
	this.validationErrorInternal(validator, 'keyNotAllowed');
};

Ctx.prototype.hasErrors = function () {
	return this.errors.length > 0;
};

Ctx.prototype.hasWarnings = function () {
	return this.warnings.length > 0;
};

Ctx.prototype.getError = function () {
	if (this.hasErrors()) {
		return this.errors[0];
	}
	return null;
};

Ctx.validate = function (data, validator, options) {
	var ctx = new Ctx(data, options);
	var isValid = validator.validate(ctx);
	if (isValid) {
		if (ctx.hasErrors()) {
			throw new Error('Got errors on valid data');
		}
	}
	else if (!ctx.hasErrors()) {
		throw new Error('Got no errors on invalid data');
	}
	return ctx;
};


module.exports = Ctx;
