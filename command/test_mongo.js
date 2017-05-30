var mongojs = require("mongojs");

var db = mongojs('192.168.0.100:27017/newspaper', ['articles']);

db.on('error', function (err) {
    console.log('database error', err)
})

db.on('connect', function () {
    console.log('database connected')
})

db.articles.find(function (err, docs) {
    // docs is an array of all the documents in mycollection
    console.log(docs);
})