"use strict";
var Ctx = function (value, options) {
	this.value = value;
	this.options = options || {};
	this.stopOnFirstError = this.options.stopOnFirstError === undefined ? true : this.options.stopOnFirstError;
	this.needValidatorInfo = !!this.options.needValidatorInfo;
	this.needValidator = !!this.options.needValidator;
	this.needMessage = !!this.options.needMessage;

	this.key = null;
	this.keyAsValue = false; // allows to use key as value in validators
	this.isPropertyCheck = false;

	this.stack = [];
	this.errors = [];

	this.noErrorCounter = 0;
};

Ctx.prototype.unsafeCharsRe = /[^\w$]/;

Ctx.prototype.isNoError = function () {
	return this.noErrorCounter > 0;
};

Ctx.prototype.setNoError = function (value) {
	this.noErrorCounter += value ? 1 : -1;
};

Ctx.prototype.enter = function (key) {
	if (this.keyAsValue) {
		throw new Error('Cannot enter while within key');
	}
	this.pushToStack();
	this.key = key;
	this.value = this.value[key];
};

Ctx.prototype.leave = function (key) {
	if (key != this.key) {
		throw new Error(['Stack mismatch, got ', JSON.stringify(key), ' while ', JSON.stringify(this.key), ' expected'].join(''));
	}
	this.popFromStack();
};

Ctx.prototype.pushToStack = function () {
	this.stack.push({
		key: this.key,
		value: this.value});
};

Ctx.prototype.popFromStack = function () {
	var item = this.stack.pop();
	this.key = item.key;
	this.value = item.value;
};

Ctx.prototype.enterKey = function () {
	if (this.keyAsValue) {
		throw new Error('Already within key');
	}
	this.pushToStack();
	this.keyAsValue = true;
	this.value = this.key;
};

Ctx.prototype.leaveKey = function () {
	this.popFromStack();
	this.keyAsValue = false;
};

Ctx.prototype.setPropertyCheck = function (value) {
	this.isPropertyCheck = value;
};

Ctx.prototype.getPath = function () {
	var result = [];
	for (var k in this.stack) {
		var item = this.stack[k];
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
	for (var k in this.stack) {
		var item = this.stack[k];
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
	if (count == 0) {
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

Ctx.prototype.addKeyStr = function (items, key) {
	var useDotSyntax = true;
	if (key.constructor == Number) {
		useDotSyntax = false;
	}
	else if (this.unsafeCharsRe.test(key)) {
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

Ctx.prototype.createValidationError = function (validator) {
	var result = {
		path: this.getPath(),
		isKeyError: this.keyAsValue,
		code: validator.getErrorCode()
	};
	if (this.needValidatorInfo) {
		var info = validator.getInfo();
		if (info) {
			result.validatorInfo = info;
		}
	}
	if (this.needValidator) {
		result.validator = validator;
	}
	if (this.needMessage) {
		result.msg = this.createErrorMessage(validator);
	}
	return result;
};

Ctx.prototype.createErrorMessage = function (validator) {
	var path = this.getPathStr();
	var result;
	if (this.isPropertyCheck) {
		result = [
			'Property ',
			path ? path + ' ' : '',
			validator.getExpectedStr()
		].join('');
	}
	else {
		result = [
			'Invalid ',
			path ? path + ' property ' : '',
			this.keyAsValue ? 'name': 'value',
			', expected ',
			validator.getExpectedStr()
		].join('');
	}
	return result;
};

Ctx.prototype.validationError = function (validator) {
	if (!this.isNoError()) {
		var error = this.createValidationError(validator);
		if (this.stopOnFirstError) {
			throw error; // TODO something more appropriate
		}
		else {
			this.errors.push(error);
		}
	}
};


module.exports = Ctx;
