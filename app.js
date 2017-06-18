var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    expressValidator = require('express-validator'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    mongo = require('mongodb'),
    db = require ('monk')('localhost/nodeblog'),
    multer = require('multer'),
    flash = require('connect-flash');    
    


var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Handles file upload
app.use(multer({ dest: './public/images/uploads' }));
// app.use(multer({ dest: __dirname + '/uploads/' }).any());


//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Handles express sessions
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));


//Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));
app.use(express.static(path.join(__dirname, 'public')));

//Connect Flash
app.use(flash());
app.use(function(req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Make our db  accessible to our router
app.use(function (req, res, next ){
  req.db = db;
  next();
});

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
