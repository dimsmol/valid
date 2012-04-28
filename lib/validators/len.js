"use strict";
var inherits = require('util').inherits;
var Range = require('./range');


var Len = function (min, max) {
	Range.call(this, min, max);
};
inherits(Len, Range);

Len.prototype.code = 'len';

Len.prototype.getExpectedStr = function () {
	var items = ['length '];
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

Len.prototype.getValue = function (ctx) {
	var result;
	if (ctx.value.constructor == Object) {
		for (var k in ctx.value) {
			result++;
		}
	}
	else {
		result = ctx.value.length;
	}
	return result;
};

Len.len = function (min, max) {
	return new Len(min, max);
};

Len.getShort = function (corrector) {
	return Len.len;
};


module.exports = Len;
