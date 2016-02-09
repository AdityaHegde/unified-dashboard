var config = require('../config');
var TwitterStrategy = require('passport-twitter').Strategy;
var connectMongoDb = require('../connectMongoDb');
var twitterStrategyInstance = new TwitterStrategy({
    consumerKey    : config.twitter.twitter_consumer_key,
    consumerSecret : config.twitter.twitter_consumer_secret,
    callbackURL    : "http://" + config.host.hostname + ":" + config.host.port + "/connect/twitter/callback",
    passReqToCallback : true,
  },
  function(req, accessToken, accessTokenSecret, profile, done) {
    if(req.user) {
      connectMongoDb.modelMap.Account.update({
        provider : profile.provider,
        user : req.user._id,
      }, {
        provider : profile.provider,
        account_id : profile.id,
        name : profile.displayName,
        accessToken : accessToken,
        //repurposing existing attribute
        refreshToken : accessTokenSecret,
        user : req.user._id,
      }, {
        upsert : true,
      }, function(err) {
        done(null, req.user);
      });
    }
    else {
      done();
    }
  }
);

module.exports = twitterStrategyInstance;
