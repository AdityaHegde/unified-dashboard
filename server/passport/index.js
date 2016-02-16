var passport                = require('passport');
var googleStrategyInstance  = require('./google-strategy-instance');
var redditStrategyInstance  = require('./reddit-strategy-instance');
var twitterStrategyInstance = require('./twitter-strategy-instance');
var connectMongoDb          = require('../connectMongoDb');
var User                    = connectMongoDb.modelMap.User;
//var LocalStrategy           = require('passport-local').Strategy;

passport.use(googleStrategyInstance);
passport.use(redditStrategyInstance);
passport.use(twitterStrategyInstance);
//passport.use(new LocalStrategy(User.authenticate()));

//passport.serializeUser(User.serializeUser());
//passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function(user, done) {
  //console.log("serializeUser");
  //console.log(user.user_id || user.id);
  done(null, user.user_id || user.id);
});

passport.deserializeUser(function(id, done) {
  //console.log("deserializeUser");
  //console.log(id);
  User.findOne({
    user_id : id
  }, function(err, user) {
    if(err || !user) {
      done(err);
    }
    else {
      done(null, user);
    }
  });
});
