"use strict";
var inherits = require('util').inherits;
var Range = require('./range');


var RangeX = function (min, max) {
	Range.call(this, min, max);
};
inherits(RangeX, Range);

RangeX.prototype.code = 'rangex';

RangeX.prototype.getExpectedStr = function () {
	var items = [];
	if (this.min != null) {
		if (this.max != null) {
			items.push('between ');
			items.push(this.min);
			items.push(' and ');
			items.push(this.max);
			items.push(' not inclusive');
		}
		else {
			items.push('> ');
			items.push(this.min);
		}
	}
	else if (this.max != null) {
		items.push('< ');
		items.push(this.max);
	}
	return items.join('');
};

RangeX.prototype.isValueValid = function (ctx) {
	var value = this.getValue(ctx);
	return (this.min == null || value > this.min) &&
		(this.max == null || value < this.max);
};

RangeX.rangex = function (min, max) {
	return new RangeX(min, max);
};

RangeX.getShort = function (corrector) {
	return RangeX.rangex;
};


module.exports = RangeX;
