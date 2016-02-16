var passport       = require('passport');
var utils          = require('../../utils');
var _              = require('lodash');
var crypto         = require('crypto');
var connectMongoDb = require('../../connectMongoDb');
var config         = require('../../config');

module.exports = function(app) {
  app.get('/connect/twitter', passport.authorize('twitter'));

  app.get('/connect/twitter/callback',
    passport.authorize('twitter', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/close.html');
    }
  );
};
