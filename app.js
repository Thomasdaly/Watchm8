var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: 'ASIA5DYSEEJ4WIUP5RBL',
  secretAccessKey: 'bFn22qmDXaWhfo0JWBcLLj4xzwa1y+dyqK7pFXkF',
  region: 'ap-southeast-2', // Update with your AWS region
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'Users';

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var movieselectRouter = require('./routes/movieSelect');
var countryselectRouter = require('./routes/countryselect');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'some secret',
  name: 'uniquesessionid',
  cookie: { maxAge: 60000 },
  saveUninitialized: false,
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/movieselect', movieselectRouter);
app.use('/countryselect', countryselectRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


module.exports = app;
