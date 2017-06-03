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

function hidden(query, callback) {
    var stdin = process.openStdin();
    process.stdin.on("data", function(char) {
        char = char + "";
        switch (char) {
            case "\n":
            case "\r":
            case "\u0004":
                stdin.pause();
                break;
            default:
                process.stdout.write("\033[2K\033[200D" + query + Array(rl.line.length+1).join("*"));
                break;
        }
    });

    rl.question(query, function(value) {
        rl.history = rl.history.slice(1);
        callback(value);
    });
}

//in this project, mongodb connection can't support cert or auth connetion.
//Suggest you using local database.
if(global.webConf.mongodb.requirePassword){
    global.mongodb_path = global.webConf.mongodb.username + global.webConf.mongodb.password + global.webConf.mongodb.host;
}else{
    global.mongodb_path = global.webConf.mongodb.host;
}

console.log("\n\n\n\n\n\n");

rl.question('Create User Name: ', (answer) => {
    // TODO: Log the answer in a database
    hidden("You just create " + answer + ", please enter password:", function(password) {
        db.users.findOne({username:answer},function(err,doc){
            if(!err){

                if(doc == null){
                    db.users.insert({
                        username: answer,
                        password: bcrypt.hashSync(password, saltRounds)
                    },function(err1,doc1){
                        if(!err1){
                            console.log("\n\n\n --- User Created! --- \n\n\n");
                            rl.close();
                        }else{
                            console.log("\n\n\n Database Connection Failed! \n\n\n");
                        }
                        process.exit();
                    });
                }else{
                    console.log(answer + " This Username Has Been Used. (Failed)");
                    process.exit();
                }
                
            }else{
                console.log("\n\n\n Database Connection Failed! \n\n\n");
                process.exit();
            }
        });
    });
});

