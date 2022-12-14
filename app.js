var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileUpload = require('express-fileupload')
var session = require('express-session')
const nocache = require("nocache");
const multer=require('multer'); 
var hbs = require('express-handlebars')
const mongoose = require( 'mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/usersweek6",()=>console.log("database connected"))
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const app = express();
// var db=require('./config/connection')
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/layout/'
}))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())
app.use(session({
  secret:"this is a secret key",cookie:{maxAge:1200000},saveUninitialized:true,resave:false
}))
app.use((req,res,next)=>{
  res.set('cache-control','no-store')
  next();
})

app.use('/', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler


module.exports = app;

