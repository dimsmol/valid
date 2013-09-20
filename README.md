# valid

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
var spec = validators.spec;
var v = validators.v;
var num = validators.num;
var intNum = validators.intNum;
var range = validators.range;
var opt = validators.opt;
var oneOf = validators.oneOf;
var any = validators.any;

var dataSpec = { // expecting object
	a: v(num, range(0, 17)), // must be a number between 0 and 17
	b: opt(intNum), // must be an integer
	c: { // also object
		x: oneOf(1, 'hello'), // strictly one of these values
		'*': any // any other keys with any values are allowed for c
	}
};

var data = {
	a: '1', // error - number expected
	d: 'extra', // unexpected key
	c: {
		x: 'zzz', // unexpected value
		y: 'extra' // it's ok
	}
};

var result = validate(data, spec(dataSpec), {stopOnFirstError: false, errors: {needMessage: true}});
console.log(result);
```

`result` will contain validation errors including messages.

## validate()

### options

* debug - perform validation in debug mode, false by default
* stopOnFirstError - wether to collect all errors or stop on first one, true by default
* errors:
	* needValidator - include failed validator into error object or not, false by default
	* needValidatorInfo - include validator internal info into error object or not, false by default
	* needMessage - include validator generated message into error object or not, false by default
* warnings:
	* the same subitems as for "errors"

### return value properties

* hasErrors()
* errors
* getError() - returns first error from errors or null if errors is empty
* hasWarnings()
* warnings

Error or warning properties:

* path - path to invalid property or key
* isKeyError - true if validation failed for some key, not property value
* code - code of validator on which validation failed
* subCode (optional) - one of validation sub codes:
	* 'keyRequired' - indicates that key described by path wasn't found
	* 'keyNotAllowed' - indicates that key described by path is not allowed
* validatorInfo - validator.getInfo() call result, provided only if options.needValidatorInfo is true
* validator - validator detected problem, provided only if options.needValidator is true
* message - error message describing the problem, provided only if options.needMessage is true

## vaidators

### primitives

* bool - boolean values
* date - Date objects
* dateStr = strTo(date) - Date object or string value transformable to Date, see "transfroming" below
* num - finite numbers (that aren't NaN and aren't infinity)
* intNum - finite integers
* posInt = v(intNum, range(1)) - positive integer
* idx = v(intNum, range(0)) - nonnegative integer (index)
* str - string value
* rx(regexp) - value matching regexp

### range and length

* range(min, max) - value is >= min and <= max, if min or max is null, corresponding boundary check is omitted
* rangex(min, max) - as range, but not inclusive
* len(min, max) - as range, but performs check of length of value, for dictionaries len will correctly check number of items

### constants

* oneOf(values...) - value is one of specified (uses strict equality to compare)
* except(values...) - value is not one of specified (uses strict equality to compare)
* val(value) - as oneOf, but check against exactly one value
* isNull - null or undefined
* notNull - not null or undefined

### objects, dictionaries, arrays

* prop(key, validator) - validates property of current value located under key with validator specified, can be used for both objects and arrays
* props(keyValidators, opt_options) - validates js object properties, option '*' specifies validator for unknown keys, option strictNotOwn implies check for not-hasOwnProperty properties when is true
* obj(keyValidators, opt_options) - as props(), but valid for only for Object instances
* dict(keySpec, valueSpec) = obj({}, {'*': v(key(strMode(keySpec)), valueSpec)})
* arr(opt_validator) - valid for arrays, ensures each item is valid according to opt_validator (if specified)
* sibl(key, validator) - validates sibling of value under key with validator specified
* up(validators...) - validates parent of value with validators specified
* hasKey(key) - valid if object has key
* fields(dict) = v([new OneOf(arr)], range(0, arr.length)) where arr is array of keys of dict

### keys

* key(validator) - valid if validator is valid for current key
* keyMatch(validator) - as key, but will produce error message according to validator, when key just says that property is not allowed
* noWay - always not valid, produces "property not allowed" error

### types

* inst(type, opt_typeName) - value is instance of type specified, opt_typeName is used for error message, type.prototype.name will be used if not specified
* is(type, opt_typeName) - as inst, but check that value is directly of the type specified, not inherited from it
* t(validator) = prop('_type', validator)

### logic

* any - always valid
* and(validators...) - valid if all specified validators are valid
* v(validators...) - same as and() but shorter
* or(validators...) - valid if one of specified validators is valid, use with care because it cannot produce informative error message (use sw when possible)
* not(validator) - valid if not valid according to validator specified, hides actual error, designed primarily to be used in conditions (like sw/on), note also it's problems with transforming (see below)

### modifiers

* nul(validators...) - (nullable) treats null value as valid before perform checks specified by "validators"
* opt(validators...) - as nopt, but also treats null (and undefined) values as valid
* strMode(validators...) - allows attempts to transform value from string to appropriate type, see "transforming" below
* warn(validators...) - implies "warning" mode, all validation errors inside of warn will be reported as warnings, warn itself is always valid

### control flow

* sw(onClauses...) - chooses one of the "on(matchValidator, validator)" using matchValidator and is valid if chosen onClause validator is valid, behaves like a "switch" clause. Validator can imply key optionality and it will be exposed on sw() itself.
* iif(caseValidator, thenValidator, opt_elseValidator) = sw(on(caseValidator, thenValidator), on(any, opt_elseValidator || noWay))
* optIf(caseValidator, validator) = iif(caseValidator, opt(validator), validator)
* onlyIf(caseValidator, validator) = iif(caseValidator, validator, opt(isNull))

### misc

* wrapper(validator) - works exactly as validator wrapped, for use cases see "recursive constructions" below
* dbg - valid in debug mode only
* ndbg - valid only if not in debug mode
* spec(validators...) - returns validator itself if only one is provided, else returns and(validators...)
* applyTransform - saves transformed value directy to data tree, see "transforming" below
* strTo(validator) = strMode(validator, applyTransform) - enables strMode() and then applies transfromed value, see "transforming" below

## corrections

Values of several types are replaced to corresponding validators automatically if found within validators tree:

* JS dictionary value => obj(value, options), options will be got from value by key '~' (if present) and value under key '*' will be transferred to options
* [validator] => arr(validator), validator is optional
* null, undefined, string, number or NaN value => val(value)

## transforming

Transforming is an attempt to deserialize desired type from string value on type validation. In this case type validator reports that value is valid and replaces initial string value with deserialized one for sequential validators.

Example:

```js
validate('3', v(strMode(intNum), range(0, 5)));
```

intNum here will cast '3' to number during validation, so range() validator will be able to perform it's check too.

dict() sugar uses strMode because dictionary keys can be only strings even if they store values that are numeric according to application logic.

Currently following validators support transforming:

* num
* intNum
* date

General rule for implementing transforming validators is to reset any transformation performed if value is invalid and to provide transformed value in other case.

Be careful implementing validators performing flow control.
For example, and() validator must manually reset transformation when any of validators fails, because transformation could be established by some of previous validators. The same behavior is taken in account in sw() and should be kept in mind when designing your custom validators with flow control.

not(validators...) validator always breaks transformation because if validators are valid, it is invalid itself and must reset transformation.

Transforming does not modify source data, but you can use applyTransform validator to do it. applyTransform saves transformed value directly to source data tree.

Note, that if you are validating a primitive, it's transformed value will be available as ctx.value regardless of using applyTransform. strTo() sugar uses strMode() and applyTransform to transform a value and apply transformation to source data.

Example:

```js
var d = { a: '3' };
validate(d, { a: strTo(intNum) });
// d.a now is 3 instead of '3'
```

## recursive constructions

It can be tricky to create recursive validator. For example, this naive attempt will fail:

```js
var recursiveValidator = spec({
	title: str,
	items: [recursiveValidator] // will not work correctly
});
```

That's because recursiveValidator has undefined value at the moment of calling spec() function. The same problem occurs in the following example:

```js
var a = { a: a }; // a will be { a: undefined } actually
```

To resolve the problem, wrapper() can be used:

```js
var ref = wrapper();
var recursiveValidator = spec({
	title: str,
	items: [ref]
});
ref.validator = recursiveValidator; // now recursion will work
```

Note that wrapper() called without arguments actually creates wrapper for val(undefined) validator, see "corrections" above. Also note, that correction won't be applyed on assigning a value to wrapper's `validator` property, so this will fail:

```js
var ref = wrapper();
ref.validator = { a: str }; // dict will not be converted to corresponding validator
```

You must use validator or call spec() to convert your expression to validator before assignment.

## tools

* basedOn(srcDict, updateDict) - updates srcDict with values from updateDict. Can be used to "inherit" dataspecs.
* getFields(dict) - returns keys of dict ignoring having validator that prohibits corresponding key (NoWay prohibits any key). Can be used to obtain fields, provided by dataspec.

## License

MIT
