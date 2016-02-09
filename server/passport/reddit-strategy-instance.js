var config = require('../config');
var RedditStrategy = require('passport-reddit').Strategy;
var connectMongoDb = require('../connectMongoDb');
var redditStrategyInstance = new RedditStrategy({
    clientID: config.reddit.reddit_client_id,
    clientSecret: config.reddit.reddit_client_secret,
    callbackURL: "http://" + config.host.hostname + ":" + config.host.port + "/connect/reddit/callback",
    scope : ['identity', 'read'],
    passReqToCallback : true,
  },
  function(req, accessToken, refreshToken, profile, done) {
    if(req.user) {
      connectMongoDb.modelMap.Account.update({
        provider : profile.provider,
        user : req.user._id,
      }, {
        provider : profile.provider,
        account_id : profile.id,
        name : profile.name,
        accessToken : accessToken,
        refreshToken : refreshToken,
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

module.exports = redditStrategyInstance;
