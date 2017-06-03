var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var cookieSession = require("cookie-session");

//init custom value
var configReader = require('./library/configReader');
global.webConf = configReader();

//in this project, mongodb connection can't support cert or auth connetion.
//Suggest you using local database.
if(global.webConf.mongodb.requirePassword){
    global.mongodb_path = global.webConf.mongodb.username + global.webConf.mongodb.password + global.webConf.mongodb.host;
}else{
    global.mongodb_path = global.webConf.mongodb.host;
}

var routes = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');

var app = express();

//setup cookie session
app.set('trust proxy', 1);
app.use(cookieSession({keys: [global.webConf.cookieSessionKey]}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({
    dest: 'public/uploads/',
    limits: {
        fieldNameSize: 50,
        files: 1,
        fields: 5,
        fileSize: 1024 * 1024 * 1024
    },
    rename: function(fieldname, filename) {
        return filename;
    },
    onFileUploadStart: function(file) {
        console.log('Starting file upload process.');
        if(file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            return false;
        }
    },
    inMemory: true //This is important. It's what populates the buffer.
}).single('file'));

app.use('/', routes);
app.use('/users', users);
app.use('/admin',admin);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function(err, req, res, next) {
   if (err instanceof NotFound) {
       res.send("<pre>404 NOT FOUND</pre>");
   } else {
       console.log("This is 500 Server Error, but webpage will send back 404.");
       res.send("<pre>404 NOT FOUND</pre>");
   }
});

function NotFound() {
   this.name = "NotFound";
   Error.call(this, msg);
   Error.captureStackTrace(this, arguments.callee);
}

// below all route handlers
// If all fails, hit em with the 404
app.all('*', function(req, res){
   throw new NotFound;
});


module.exports = app;
