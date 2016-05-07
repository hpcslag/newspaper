var express = require('express');
var router = express.Router();
var mongojs = require("mongojs");
var db = mongojs(global.mongodb_path+'/newspaper', ['articles']);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{title:global.webConf.title});
});

router.get('/article',function(req,res,next) {
	var query_string = req.query.id; //?id=xx
	try{
		db.articles.findOne({_id:mongojs.ObjectId(query_string)},function(err,doc) {
			if(!!doc){
				res.render('article',{data:doc});
				db.articles.update({_id:mongojs.ObjectId(query_string)},{$inc:{view:1}});
			}else{
				res.sendStatus(404);
			}
		});
	}catch(e){
		res.sendStatus(404);
	}
});

router.get('/api/search', function(req, res, next) {
	var query_string = req.query.q; //?q=xxx
	db.articles.find({
		$or : [
			{$or:[{title: new RegExp(query_string,"gi")   }]},
			{$or:[{content: new RegExp(query_string,"gi") }]}
		]
	}).limit(20).skip(0,function(err,doc){
		res.send({results:doc,length:doc.length});
	});
});

router.get('/api/hashtags', function(req, res, next) {
	var query_string = req.query.tag; //?tag=xxx
	db.articles.find({query:{hash_tag: query_string }}).limit(20).skip(0,function(err,doc){
		res.send(doc);
	});
});

module.exports = router;
