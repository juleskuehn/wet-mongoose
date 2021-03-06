// Example CRUD application based upon:
// Node.js, Express, Mongoose, and Web Experience Toolkit
// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/
// https://github.com/passport/express-4.x-local-example
// https://wet-boew.github.io/themes-dist/GCWeb/gcweb-theme/release/v5.0-en.html

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const mongoose = require('mongoose');

const app = express();

// Database connection
const mongoDB = 'mongodb://127.0.0.1/wet-mongoose';
mongoose.connect(mongoDB, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Express server configuration (see also /bin/www)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// Associate routes
app.use('/', require('./routes/routes'));

// Error handling
app.use(function (req, res, next) { next(createError(404)); });
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;