var bcrypt = require('bcrypt');
const saltRounds = 10;

var configReader = require('../library/configReader');
global.webConf = configReader();

//in this project, mongodb connection can't support cert or auth connetion.
//Suggest you using local database.
if(global.webConf.mongodb.requirePassword){
    global.mongodb_path = global.webConf.mongodb.username + global.webConf.mongodb.password + global.webConf.mongodb.host;
}else{
    global.mongodb_path = global.webConf.mongodb.host;
}


var mongojs = require("mongojs");
var db = mongojs(global.mongodb_path+'/newspaper', ['users']);

//in this project, mongodb connection can't support cert or auth connetion.
//Suggest you using local database.
if(global.webConf.mongodb.requirePassword){
    global.mongodb_path = global.webConf.mongodb.username + global.webConf.mongodb.password + global.webConf.mongodb.host;
}else{
    global.mongodb_path = global.webConf.mongodb.host;
}

console.log("\n\n\n\n\n\n");
db.users.find(function(err,doc){
    if(!err){
        for(var i in doc){
            console.log(i+". "+doc[i].username);
        }
        console.log("\n\n\n\n");
    }else{
        console.log("Database Connection Failed!");
    }
    db.close();
});