var path = require('path');
var fs = require('fs');

module.exports = function(){
	var doc = fs.readFileSync(path.join(__dirname,'../configure.json'));
	return JSON.parse(doc);
}