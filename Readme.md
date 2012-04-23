## valid

* Includes bunch of validators that can be combined
* Designed to validate web service input data (loaded from JSON) and return values
* But can be used as form validator as well

## install & usage

```
npm install valid
```

Use one of predefined validators to perform data checks or write your own by subclassing `valid.validators.core.Validator`.

## example

```js
var valid = require('valid');
var validate = valid.validate;
var validators = valid.validators;
var dict = validators.dict;
var v = validators.v;
var num = validators.num;
var intnum = validators.intnum;
var range = validators.range;
var opt = validators.opt;
var oneOf = validators.oneOf;
var any = validators.any;

var spec = dict({ // expecting dict
	a: v(num, range(0, 17)), // must be a number between 0 and 17
	b: opt(intnum), // must be an integer
	c: dict({ // also dict
		x: oneOf(1, 'hello'), // strictly one of these values
	}, {'*': any}) // any other keys with any values are allowed for c
});

var data = {
	a: '1', // error - number expected
	d: 'extra', // unexpected key
	c: {
		x: 'zzz', // unexpected value
		y: 'extra' // it's ok
	}
};

var result = validate(data, spec, {stopOnFirstError: false, needMessage: true});
console.log(result);
```

`result` will contain validation errors including messages.

## vaidators

* and(validators...) - valid if all specified validators are valid
* any - always valid
* arr(opt_validator) - valid for arrays, ensures each item is valid according to opt_validator (if specified)
* bool - valid for boolean values
* date - valid for Date objects
* dict(keyValidators, opt_options) - valid for dictionaries, option '*' specifies validator for unknown keys, option strictNotOwn implies check for not-hasOwnProperty properties when true
* except(values...) - valid if value is not one of specified (uses strict equality to compare)
* hasKey(key) - valid if object has key specified
* inst(type, opt_typeName) - valid if value is instance of type specified, opt_typeName is used for error message, type.prototype.name will be used if not specified
* intnum - valid for finite integers
* is(type, opt_typeName) - as inst, but check that value is directly of the type specified, not inherited from it
* key(validator) - valid if validator is valid for current key
* keyMatch(validator) - as key, but will produce error message according to validator, when key just says that property is not allowed
* len(min, max) - as range, but performs check of length of value, for dictionaries len will correctly check number of items
* nn - valid if value is not null
* nopt(validators...) - indicates that corresponding property is optional
* nul(validators...) - (nullable) treats null value as valid before perform checks specified by "validators"
* num - valid for finite numbers (that aren't NaN and aren't infinity)
* oneOf(values...) - valid if value is one of specified (uses strict equality to compare)
* opt(validators...) - as nopt, but also treats null (and undefined) values as valid
* or(validators...) - valid if one of specified validators is valid, use with care because it cannot produce informative error message (use sw when possible)
* prop(key, validator) - valid if property of current value located under key is valid according to validator specified, can be used for both objects and arrays
* props(keyValidators, opt_options) - as dict, but doesn't require value to be dictionary
* range(min, max) - valid if value is >= min and <= max, if min or max is null, corresponding boundary check is omitted
* rangex(min, max) - as range, but not inclusive
* rx(regexp) - valid if value matches regexp specified
* sibl(key, validator) - valid if sibling of value under key specified is valid according to validator specified
* str - valid if value is string
* sw(onClauses...) - chooses one of the "on(matchValidator, validator)" using matchValidator and is valid if chosen onClause validator is valid, behaves like a "switch" clause
* t(validator) - valid if value._type is valid according to validator specified
* up(validators...) - valid if parent of value is valid according to validators specified
* val(value) - as oneOf, but check against exactly one value
