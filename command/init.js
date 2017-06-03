var readline = require('readline');
var fs = require('fs');
var path = require('path');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("\n\n\n\n\n\n This program will help you setup newspaper.");

var init = {
	title:"newspaper",
	mongodb: {
		requirePassword: false,
		host:"xxx.xxx.xxx.xxxx:27017",
		username:"",
		password:"",
		certificate:""
	},
	cookieSessionKey:",fFps0!87*ldf;skfsal,v%2093msmd",
	port:3000
};

rl.question('\n\nEnter Your Website Name: ', (title) => {
    init.title = title;
    rl.question('\n\nEnter Your MongoDB IP: ', (mongoip) => {
        init.mongodb.host = mongoip;
        requirePasswordAsk(()=>{
            rl.question('\n\nEnter Your Website Session Key \n(you can enter anything, `e.g`:afpskd;fl;sdkfl;skd): ', (key) => {
                init.cookieSessionKey = key;
                rl.question('\n\nEnter Your Website Port (1-65535): ', (port) => {
                    init.port = parseInt(port);
                    fs.truncate(path.join(__filename,'../../','configure.json') , 0, function() {
                        fs.writeFile( path.join(__filename,'../../','configure.json') , JSON.stringify(init,null,4), function (err) {
                            if (err) {
                                return console.log("Error writing file: " + err);
                            }else{
                                console.log("\n\n\n --- Website Configuration Finish ---\n\n\nuse nwsp can starting server, or use nwsp help to see more usage.\n\n\n");
                                process.exit();
                            }
                        });
                    });
                    
                });
            });
        });
    });
});

function requirePasswordAsk(cb){
    rl.question('\n\nYour mongodb is require Username and Password? (y/n): ', (ans) => {
        if(ans.toLowerCase() == "y"){
            init.requirePassword = true;
            rl.question('\n\nEnter Your MongoDB Username: ', (username) => {
                init.mongodb.username = username;
                rl.question('\n\nEnter Your MongoDB Password: ', (password) => {
                    init.mongodb.password = password;
                    cb();
                });
            });
        }else{
            cb();
        }
    });
}

