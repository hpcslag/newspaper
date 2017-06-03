var path = require('path');
var fs = require('fs');

module.exports = function(){
	var doc = fs.readFileSync(path.join(__filename,'../../','configure.json'));
	return JSON.parse(doc);
}