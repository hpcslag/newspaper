var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var mongojs = require("mongojs");
var db = mongojs(global.mongodb_path+'/newspaper', ['articles']);

/* REST API: Admin Function (Post Article)*/
router.post('/article/post_article',function(req,res,next){
	if(req.body.content != null && req.body.content.length > 20){//security

		var FEATURE_PICTURE_PATH = "/images/Non_Feature_Picture.png";
		/* image upload! */
		if(!!req.file){
			var originname = req.file.originalname;
			var l = originname.split('.'); //get .png / .jpg type 
			var ptn = l[l.length-1];
			var current_file_name = req.file.filename + '.' + ptn;
			fs.rename(req.file.path, path.join(req.file.destination, current_file_name) , function(err) {
				if ( err ) console.log('ERROR: ' + err);
			});
			FEATURE_PICTURE_PATH = path.join('/uploads/',current_file_name);
		}

		db.articles.insert({
			title : req.body.title,
			preface : req.body.preface,
			hash_tag : req.body.hash_tag.split(','),
			content : req.body.content,
            date : new Date(),
            liked : 0,
            view : 0,
            author : "hpcslag",
            feature_picture : FEATURE_PICTURE_PATH
		});
		res.send(JSON.stringify({status:1}));
	}else{
		res.send(JSON.stringify({status:2}));
	}
	//save article to database!
	//to do send successful message!
});

router.post('/article/upload_image', function(req, res, next) {
	var originname = req.file.originalname;
	var l = originname.split('.');
	var ptn = l[l.length-1];

	var current_file_name = req.file.filename + '.' + ptn;
	fs.rename(req.file.path, path.join(req.file.destination, current_file_name) , function(err) {
	if ( err ) console.log('ERROR: ' + err);
	});

	res.send(JSON.stringify({link: path.join('/uploads/',current_file_name)}));
	console.log(JSON.stringify(req.params));
});



/* REST API: Admin Function (Update Articles)*/
router.post('/article/update_article',function(req,res,next){
	var article_id = req.query.id;

	if(article_id == null){
		res.send(JSON.stringify({status:3}));
		return;
	}else{
		if(req.body.content != null && req.body.content.length > 20){//security
			var FEATURE_PICTURE_PATH = "";
			// image upload!
			if(!!req.file){
				var originname = req.file.originalname;
				var l = originname.split('.'); //get .png / .jpg type 
				var ptn = l[l.length-1];
				var current_file_name = req.file.filename + '.' + ptn;
				fs.rename(req.file.path, path.join(req.file.destination, current_file_name) , function(err) {
					if ( err ) console.log('ERROR: ' + err);
				});
				FEATURE_PICTURE_PATH = path.join('/uploads/',current_file_name);
			}

			var insertObject = {
				title : req.body.title,
				preface : req.body.preface,
				hash_tag : req.body.hash_tag.split(','),
				content : req.body.content,
				liked : 0,
				view : 0,
				author : "hpcslag"
			}

			if(FEATURE_PICTURE_PATH != ""){
				insertObject["feature_picture"] = FEATURE_PICTURE_PATH;
			}

			db.articles.findAndModify({
				query: { _id: mongojs.ObjectId(article_id) },
				update: { $set: insertObject },
				multi: true
			}, function(err, doc, lastErrorObject) {
				// doc.tag === 'maintainer'
			});

			res.send(JSON.stringify({status:1}));
		}else{
			res.send(JSON.stringify({status:2}));
		}
		//save article to database!
		//to do send successful message!
	}
});


/* REST API: Admin Function (Delete Articles)*/
router.post('/article/delete',function(req,res,next){
	var _id = req.body.id;
	if(_id != null){
		db.articles.remove({_id:mongojs.ObjectId(_id)},function(err){
			if(!err){
				res.status(200);
				res.send("Deleted!");
			}else{
				res.status(500);
				res.send("Not Work!");
			}
			
		});
	}else{
		res.send("<pre>404 NOT FOUND</pre>");
	}
});

/* PAGE: Admin Function (Create New Article)*/
router.get('/article/create', function(req, res, next) {
	res.status(200);
	res.render('admin-create',{webTitle: global.webConf.title});
});

/* PAGE: Admin Dashboard (Login Page)*/

/* PAGE: Admin Dashboard (Show Indexes)*/
router.get('/dashboard', function(req, res, next) {
	var per_page_data_length = 10;
	var start_length = parseInt(req.query.s); //?s=xx
	var showAllAuthor = req.query.a; //&a=true

	//get user session

	var query_rules = {author:"hpcslag"};
	if(isNaN(start_length)){
		start_length = 0;
	}

	if(!!showAllAuthor){
		query_rules = {};
	}

	db.articles.find(query_rules).sort({$natural:-1}).limit(per_page_data_length).skip(start_length,function(err,doc){
		db.articles.count(query_rules,function(err1,max_len){	
			db.articles.aggregate([ {$match:query_rules},{$group: { _id: null, liked: { $sum: "$liked" }, view: { $sum: "$view" } } } ],function(err2, doc2){
				var rendering_data = {data:doc, max_length:max_len,per_length:per_page_data_length ,now_end_length: start_length+per_page_data_length, view: 0, liked: 0,webTitle: global.webConf.title};
				if(doc2[0] != null){
					rendering_data["view"] = doc2[0].view;
					rendering_data["liked"] = doc2[0].liked;
				}
				res.render('admin-dashboard',rendering_data);
			});
		});
	});
	
});

/* PAGE: Admin Function (Get Article by _id)*/
router.get('/article/update', function(req, res, next) {
	var id = req.query.id;
	if(id!=null){
		db.articles.findOne({_id: mongojs.ObjectId(id)},function(err,doc){
			res.render('admin-update',{data:doc,webTitle: global.webConf.title});
		});
	}else{
		res.status(404);
		res.send("<pre>404 NOT FOUND</pre>");
	}
});


module.exports = router;
