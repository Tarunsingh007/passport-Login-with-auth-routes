var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash= require('connect-flash');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mongoose=require("mongoose");
var hbs=require("hbs");
var passport=require("passport");
require("./config/passport")(passport);

var app = express();

//connect mongoose

mongoose.connect('mongodb://localhost/newapp', {useNewUrlParser: true,useUnifiedTopology: true}).then(()=>{
  console.log("Connecting to database...")
  setTimeout(()=>{
    console.log("Successfully connected to database")
  },1000);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//session and flash
app.use(session({
  secret: 'some secret',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req,res,next)=>{
  res.locals.success_msg=req.flash('success_msg');
  res.locals.error_msg=req.flash('error_msg');
  next();
})

app.use('/api', indexRouter);
app.use('/users', usersRouter);
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
