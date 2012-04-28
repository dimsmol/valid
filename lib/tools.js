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


module.exports = {
	basedOn: basedOn
};
