"use strict";
var inherits = require('util').inherits;
var Num = require('./num');


var Intnum = function () {
	Num.call(this);
};
inherits(Intnum, Num);

Intnum.prototype.errorCode = 'intnum';
Intnum.prototype.expectedStr = 'integer';

Intnum.prototype.isValueValid = function (ctx) {
	return Math.floor(ctx.value) === ctx.value;
};

Intnum.intnum = new Intnum();


module.exports = Intnum;
