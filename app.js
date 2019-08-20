var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var exphbs  = require('express-handlebars');
var session = require('express-session');
var flash = require('connect-flash')
var passport = require('passport')
var bodyParser = require('body-parser');
// var validator = require('express-validator');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mongoose = require('mongoose');
var app = express();

// view engine setup
app.engine('.hbs', exphbs({defaultLayout:'homepage',extname:'.hbs'}));
app.set('view engine', '.hbs');

mongoose.connect('mongodb://localhost/demo1');
require('./config/passport');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(validator());
app.use(cookieParser());
app.use(session({secret:'mysupersecret',resave:false,saveUninitialized:false}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname,'public')));

app.use(function(req,res,next){
  res.locals.login=req.isAuthenticated();
  next();
})
// app.use(function(req,res,next){
//   res.locals.demo="hello";
//   next();
// })


app.use('/', indexRouter);
app.use('/', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
