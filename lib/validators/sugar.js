"use strict";
var Wrapper = require('./core/wrapper');
var Obj = require('./obj');
var And = require('./and');
var KeyMatch = require('./key_match');
var StrMode = require('./str_mode');
var Sw = require('./sw');
var Any = require('./any');
var Opt = require('./opt');
var NoWay = require('./no_way');
var Prop = require('./opt');
var IsNull = require('./is_null');


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

	return {
		spec: spec,
		dict: dict,
		v: v,
		iif: iif,
		optIf: optIf,
		onlyIf: onlyIf,
		t: t
	};
};

module.exports = {
	getValidators: getValidators
};
