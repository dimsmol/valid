"use strict";
var Wrapper = require('./wrapper');
var Obj = require('./obj');
var And = require('./and');
var KeyMatch = require('./key_match');
var StrMode = require('./str_mode');
var Sw = require('./sw');
var Any = require('./any');
var OneOf = require('./one_of');
var Opt = require('./opt');
var NoWay = require('./no_way');
var Prop = require('./opt');
var IsNull = require('./is_null');
var Len = require('./len');
var IntNum = require('./int_num');
var Range = require('./range');
var DateValidator = require('./date');
var ApplyTransform = require('./apply_transform');


var getValidators = function (corrector) {
	var obj = Obj.getShort(corrector);
	var and = And.getShort(corrector);
	var keyMatch = KeyMatch.getShort(corrector);
	var strMode = StrMode.getShort(corrector);
	var sw = Sw.getShort(corrector);
	var on = sw.on;
	var any = Any.getShort(corrector);
	var opt = Opt.getShort(corrector);
	var noWay = NoWay.getShort(corrector);
	var prop = Prop.getShort(corrector);
	var isNull = IsNull.getShort(corrector);
	var len = Len.getShort(corrector);
	var intNum = IntNum.getShort(corrector);
	var range = Range.getShort(corrector);
	var date = DateValidator.getShort(corrector);
	var applyTransform = ApplyTransform.getShort(corrector);

	var spec = function (validator) {
		return Wrapper.wrapMany(validator, arguments, corrector);
	};

	var v = and;

	var dict = function (keySpec, valueSpec) {
		return obj({}, {
			'*': v(keyMatch(strMode(keySpec)), valueSpec)});
	};

	var iif = function (caseValidator, thenValidator, opt_elseValidator) {
		return sw(
			on(caseValidator, thenValidator),
			on(any, opt_elseValidator || noWay)
		);
	};

	var optIf = function (caseValidator, validator) {
		return iif(caseValidator, opt(validator), validator);
	};

	var onlyIf = function (caseValidator, validator) {
		return iif(caseValidator, validator, opt(isNull));
	};

	var t = function (validator) {
		return prop('_type', validator);
	};

	var fields = function (d) {
		var arr = [];
		for (var k in d) {
			arr.push(k);
		}
		return v([new OneOf(arr)], len(0, arr.length));
	};

	var posInt = v(intNum, range(1));
	var idx = v(intNum, range(0));

	var strTo = function (validator) {
		return strMode(validator, applyTransform);
	};

	var dateStr = strTo(date);

	return {
		spec: spec,
		dict: dict,
		v: v,
		iif: iif,
		optIf: optIf,
		onlyIf: onlyIf,
		t: t,
		fields: fields,
		posInt: posInt,
		idx: idx,
		strTo: strTo,
		dateStr: dateStr
	};
};

module.exports = {
	getValidators: getValidators
};
