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
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


//in this project, mongodb connection can't support cert or auth connetion.
//Suggest you using local database.
if(global.webConf.mongodb.requirePassword){
    global.mongodb_path = global.webConf.mongodb.username + global.webConf.mongodb.password + global.webConf.mongodb.host;
}else{
    global.mongodb_path = global.webConf.mongodb.host;
}

console.log("\n\n\n\n\n\n");

rl.question('Which User You Want To Delete? \n\n *Enter `all--` to delete all users. \n\n(Enter Username): ', (answer) => {
    var query = {username:answer};
    if(answer == "all--"){
        query = {};
    }
    db.users.remove(query,function(err,doc){
        if(!err){
            console.log("\n\n\n --- User DELETED! --- \n\n\n");
            process.exit();
        }else{
            console.log("\n\n\n Database Connection Failed! \n\n\n");
            process.exit();
        }
    });
});

