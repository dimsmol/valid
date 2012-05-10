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
var v = validators.v;
var num = validators.num;
var intnum = validators.intnum;
var range = validators.range;
var opt = validators.opt;
var oneOf = validators.oneOf;
var any = validators.any;

var dataSpec = spec({ // expecting object
	a: v(num, range(0, 17)), // must be a number between 0 and 17
	b: opt(intnum), // must be an integer
	c: { // also object
		x: oneOf(1, 'hello'), // strictly one of these values
		'*': any // any other keys with any values are allowed for c
	}
});

var data = {
	a: '1', // error - number expected
	d: 'extra', // unexpected key
	c: {
		x: 'zzz', // unexpected value
		y: 'extra' // it's ok
	}
};

var result = validate(data, spec, {stopOnFirstError: false, errors: {needMessage: true}});
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

* and(validators...) - valid if all specified validators are valid
* any - always valid
* arr(opt_validator) - valid for arrays, ensures each item is valid according to opt_validator (if specified)
* bool - valid for boolean values
* date - valid for Date objects
* dbg - valid in debug mode only
* except(values...) - valid if value is not one of specified (uses strict equality to compare)
* hasKey(key) - valid if object has key specified
* inst(type, opt_typeName) - valid if value is instance of type specified, opt_typeName is used for error message, type.prototype.name will be used if not specified
* intNum - valid for finite integers
* is(type, opt_typeName) - as inst, but check that value is directly of the type specified, not inherited from it
* isNull - valid if value is null or undefined
* key(validator) - valid if validator is valid for current key
* keyMatch(validator) - as key, but will produce error message according to validator, when key just says that property is not allowed
* len(min, max) - as range, but performs check of length of value, for dictionaries len will correctly check number of items
* ndbg - valid only if not in debug mode
* notNull - valid if value is not null
* not(validator) - valid if not valid according to validator specified, hides actual error, designed primarily to be used in conditions (like sw/on), note also it's problems with transforming (see below)
* noWay - always not valid, produces "property not allowed" error
* nul(validators...) - (nullable) treats null value as valid before perform checks specified by "validators"
* num - valid for finite numbers (that aren't NaN and aren't infinity)
* obj(keyValidators, opt_options) - as props(), but valid for only for Object instances
* oneOf(values...) - valid if value is one of specified (uses strict equality to compare)
* opt(validators...) - as nopt, but also treats null (and undefined) values as valid
* or(validators...) - valid if one of specified validators is valid, use with care because it cannot produce informative error message (use sw when possible)
* prop(key, validator) - valid if property of current value located under key is valid according to validator specified, can be used for both objects and arrays
* props(keyValidators, opt_options) - validates js object properties, option '*' specifies validator for unknown keys, option strictNotOwn implies check for not-hasOwnProperty properties when is true
* range(min, max) - valid if value is >= min and <= max, if min or max is null, corresponding boundary check is omitted
* rangex(min, max) - as range, but not inclusive
* rx(regexp) - valid if value matches regexp specified
* sibl(key, validator) - valid if sibling of value under key specified is valid according to validator specified
* str - valid if value is string
* strMode(validators...) - allows attempts to transform value from string to appropriate type, see "transforming" below
* sw(onClauses...) - chooses one of the "on(matchValidator, validator)" using matchValidator and is valid if chosen onClause validator is valid, behaves like a "switch" clause. Validator can imply key optionality and it will be exposed on sw() itself.
* up(validators...) - valid if parent of value is valid according to validators specified
* val(value) - as oneOf, but check against exactly one value
* warn(validators...) - implies "warning" mode, all validation errors inside of warn will be reported as warnings, warn itself is always valid

## sugar

* spec(validators...) - returns validator itself if only one is provided, else returns and(validators...)
* dict(keySpec, valueSpec) = obj({}, {'*': v(key(strMode(keySpec)), valueSpec)})
* iif(caseValidator, thenValidator, opt_elseValidator) = sw(on(caseValidator, thenValidator), on(any, opt_elseValidator || noWay))
* optIf(caseValidator, validator) = iif(caseValidator, opt(validator), validator)
* onlyIf(caseValidator, validator) = iif(caseValidator, validator, opt(isNull))
* t(validator) = prop('_type', validator)

## corrections

Values of several types are replaced to corresponding validators automatically if found within validators tree:

* JS dictionary value => obj(value, options), options will be got from value by key '~' (if present) and value under key '*' will be transferred to options
* [validator] => arr(validator), validator is optional
* string, number or NaN value => val(value)

## transforming

Transforming is an attempt to deserialize desired type from string value on type validation. In this case type validator reports that value is valid and replaces initial string value with deserialized one for sequential validators.

Example:

```js
validate('3', strMode(intNum, range(0, 5)));
```

intNum here will cast '3' to number during validation, so range() validator will be able to perform it's check too.

dict() sugar uses strMode because dictionary keys can be only strings even if they store values that are numeric according to application logic.

Currently following validators support transforming:
* num
* intNum

General rule for implementing transforming validators is to reset any transformation performed if value is invalid and to provide transformed value in other case.

Be careful implementing validators performing flow control.
For example, and() validator must manually reset transformation when any of validators fails, because transformation could be established by some of previous validators. The same behavior is taken in account in sw() and should be kept in mind when designing your custom validators with flow control.

not(validators...) validator always breaks transformation because if validators are valid, it is invalid itself and must reset transformation.
