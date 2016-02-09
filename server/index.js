module.exports = function(app) {
  var bodyParser   = require('body-parser');
  var cookieParser = require('cookie-parser');
  var session      = require('express-session');
  var globSync     = require('glob').sync;
  var routes       = globSync('./routes/**/*.js', { cwd: __dirname }).map(require);
  var passport     = require('passport');
  var config       = require('./config');
  var passportInit = require('./passport');
  var connectMongoDb = require('./connectMongoDb');
  var jsonApiInit = require('./json-api-init');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(session({
    secret : config.session.secret,
    resave : true,
    saveUninitialized : true,
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  routes.forEach(function(route) { route(app); });

  jsonApiInit(app);
};
