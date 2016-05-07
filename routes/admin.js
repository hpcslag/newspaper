var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var mongojs = require("mongojs");
var db = mongojs(global.mongodb_path+'/newspaper', ['articles']);

/* Admin Function */
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

module.exports = router;
