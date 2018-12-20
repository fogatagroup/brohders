var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var clientsRouter = require('./routes/clients');

var app = express();
app.locals.userStore = [];
app.locals.users = [{
  id: 1,
  name: "Bryan Cruz",
  user: "bcruz",
  pass: "123456"
},{
  id: 2,
  name: "Laura Cruz",
  user: "lcruz",
  pass: "123456"
}]

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
/*
app.use('/*', function(req, res, next){
  let token = req.headers['x-access-token'];
  if(!token && req.baseUrl.indexOf("login") == -1){
    res.sendStatus(401);
  } else {
    let user = req.app.locals.userStore.find(a => a.token == token);
    if(!user && req.baseUrl.indexOf("login") == -1){
      res.sendStatus(403);
    } else {
      res.locals.user = user;
      next();
    }
    
  }
})
*/

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/clients', clientsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log("ERROR:", err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({error: "An error has ocurred"});
});



module.exports = app;
