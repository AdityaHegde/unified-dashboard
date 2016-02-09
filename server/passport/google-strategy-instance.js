var config = require('../config');
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var googleStrategyInstance = new GoogleStrategy(
  {
    clientID     : config.google.google_client_id,
    clientSecret : config.google.google_client_secret,
    callbackURL  : "http://" + config.host.hostname + ":" + config.host.port + "/auth/google/callback",
  }, 
  function(accessToken, refreshToken, profile, done) {
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;
    process.nextTick(function () {
      return done(null, profile);
    });
  }
);

module.exports = googleStrategyInstance;
