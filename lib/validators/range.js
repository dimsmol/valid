"use strict";
var inherits = require('util').inherits;
var ValueValidator = require('./core/value_validator');


var Range = function (min, max) {
	ValueValidator.call(this);
	if (min == null && max == null) {
		throw new Error('min and max cannot be both null');
	}
	this.min = min;
	this.max = max;
};
inherits(Range, ValueValidator);

Range.prototype.code = 'range';

Range.prototype.getExpectedStr = function () {
	var items = [];
	if (this.min != null) {
		if (this.max != null) {
			if (this.min == this.max) {
				items.push('= ');
				items.push(this.min);
			}
			else {
				items.push('between ');
				items.push(this.min);
				items.push(' and ');
				items.push(this.max);
				items.push(' inclusive');
			}
		}
		else {
			items.push('>= ');
			items.push(this.min);
		}
	}
	else if (this.max != null) {
		items.push('<= ');
		items.push(this.max);
	}
	return items.join('');
};

Range.prototype.isValueValid = function (ctx) {
	var value = this.getValue(ctx);
	return (this.min == null || value >= this.min) &&
		(this.max == null || value <= this.max);
};

Range.prototype.getValue = function (ctx) {
	return ctx.value;
};

Range.range = function (min, max) {
	return new Range(min, max);
};

Range.getShort = function (corrector) {
	return Range.range;
};


module.exports = Range;
