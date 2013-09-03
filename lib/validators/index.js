"use strict";
var core = require('./core');
var Wrapper = require('./wrapper');
var Dbg = require('./dbg');
var NotDbg = require('./not_dbg');
var Warn = require('./warn');
var StrMode = require('./str_mode');
var ApplyTransform = require('./apply_transform');
var Or = require('./or');
var And = require('./and');
var Not = require('./not');
var Arr = require('./arr');
var Props = require('./props');
var Obj = require('./obj');
var Nullable = require('./nullable');
var Opt = require('./opt');
var Any = require('./any');
var Str = require('./str');
var Num = require('./num');
var Intnum = require('./int_num');
var Bool = require('./bool');
var DateValidator = require('./date');
var Val = require('./val');
var OneOf = require('./one_of');
var Except = require('./except');
var Inst = require('./inst');
var Range = require('./range');
var RangeX = require('./range_x');
var Len = require('./len');
var Rx = require('./rx');
var NotNull = require('./not_null');
var IsNull = require('./is_null');
var Prop = require('./prop');
var Sibl = require('./sibl');
var Up = require('./up');
var Key = require('./key');
var KeyMatch = require('./key_match');
var NoWay = require('./no_way');
var Is = require('./is');
var HasKey = require('./has_key');
var Sw = require('./sw');
var sugar = require('./sugar');
var SpecCorrector = require('../spec_corrector');


var validatorClasses = {
	Wrapper: Wrapper,
	Dbg: Dbg,
	NotDbg: NotDbg,
	Warn: Warn,
	StrMode: StrMode,
	ApplyTransform: ApplyTransform,
	Or: Or,
	And: And,
	Not: Not,
	Arr: Arr,
	Props: Props,
	Obj: Obj,
	Nullable: Nullable,
	Opt: Opt,
	Any: Any,
	Str: Str,
	Num: Num,
	Intnum: Intnum,
	Bool: Bool,
	DateValidator: DateValidator,
	Val: Val,
	OneOf: OneOf,
	Except: Except,
	Inst: Inst,
	Range: Range,
	RangeX: RangeX,
	Len: Len,
	Rx: Rx,
	NotNull: NotNull,
	IsNull: IsNull,
	Prop: Prop,
	Sibl: Sibl,
	Up: Up,
	Key: Key,
	KeyMatch: KeyMatch,
	NoWay: NoWay,
	Is: Is,
	HasKey: HasKey,
	Sw: Sw
};

var fill = function (dst, src) {
	for (var k in src) {
		dst[k] = src[k];
	}
};

var getValidators = function (corrector) {
	var result = {};
	for (var k in validatorClasses) {
		var validatorClass = validatorClasses[k];
		result[validatorClass.prototype.getShortName()] = validatorClass.getShort(corrector);
	}
	fill(result, sugar.getValidators(corrector));
	return result;
};

var defaultCorrector = new SpecCorrector();

var result = getValidators(defaultCorrector);
result.defaultCorrector = defaultCorrector;
result.core = core;
result.getValidators = getValidators;
fill(result, validatorClasses);


module.exports = result;
