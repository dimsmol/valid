"use strict";
var core = require('./core');
var Or = require('./or');
var And = require('./and');
var Arr = require('./arr');
var Props = require('./props');
var Dict = require('./dict');
var Nullable = require('./nullable');
var Opt = require('./opt');
var Nopt = require('./nopt');
var Any = require('./any');
var Str = require('./str');
var Num = require('./num');
var Intnum = require('./intnum');
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
var NotNull = require('./nn');
var Prop = require('./prop');
var T = require('./t');
var Sibl = require('./sibl');
var Up = require('./up');
var Key = require('./key');
var KeyMatch = require('./key_match');
var Is = require('./is');
var HasKey = require('./has_key');
var Sw = require('./sw');


module.exports = {
	core: core,
	Or: Or,
	or: Or.or,
	And: And,
	and: And.and,
	v: And.and,
	Arr: Arr,
	arr: Arr.arr,
	Props: Props,
	props: Props.props,
	Dict: Dict,
	dict: Dict.dict,
	Nullable: Nullable,
	nul: Nullable.nul,
	Opt: Opt,
	opt: Opt.opt,
	Nopt: Nopt,
	nopt: Nopt.nopt,
	Any: Any,
	any: Any.any,
	Str: Str,
	str: Str.str,
	Num: Num,
	num: Num.num,
	Intnum: Intnum,
	intnum: Intnum.intnum,
	Bool: Bool,
	bool: Bool.bool,
	DateValidator: DateValidator,
	date: DateValidator.date,
	Val: Val,
	val: Val.val,
	OneOf: OneOf,
	oneOf: OneOf.oneOf,
	Excpet: Except,
	exc: Except.exc,
	Inst: Inst,
	inst: Inst.inst,
	Range: Range,
	range: Range.range,
	RangeX: RangeX,
	rangex: RangeX.rangex,
	Len: Len,
	len: Len.len,
	Rx: Rx,
	rx: Rx.rx,
	NotNull: NotNull,
	nn: NotNull.nn,
	Prop: Prop,
	prop: Prop.prop,
	T: T,
	t: T.t,
	Sibl: Sibl,
	sibl: Sibl.sibl,
	Up: Up,
	up: Up.up,
	Key: Key,
	key: Key.key,
	KeyMatch: KeyMatch,
	keyMatch: KeyMatch.keyMatch,
	Is: Is,
	is: Is.is,
	HasKey: HasKey,
	hasKey: HasKey.hasKey,
	Sw: Sw,
	sw: Sw.sw,
	On: Sw.On,
	on: Sw.on
};
