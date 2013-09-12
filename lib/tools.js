"use strict";
var basedOn = function (srcDict, updateDict) {
	var result = {};
	var k;
	for (k in srcDict) {
		result[k] = srcDict[k];
	}
	for (k in updateDict) {
		result[k] = updateDict[k];
	}
	return result;
};

var getFields = function(dict) {
	var result = [];
	for(var k in dict){
		if (!dict[k].isFieldProhibited(k)) {
			result.push(k);
		}
	}
	return result;
};


module.exports = {
	basedOn: basedOn,
	getFields: getFields
};
