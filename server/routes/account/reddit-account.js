var passport       = require('passport');
var utils          = require('../../utils');
var _              = require('lodash');
var crypto         = require('crypto');
var connectMongoDb = require('../../connectMongoDb');
var config         = require('../../config');

module.exports = function(app) {
  app.get('/connect/reddit', function(req, res, next) {
    req.session.state = crypto.randomBytes(32).toString('hex');
    passport.authorize('reddit', {
      state: req.session.state,
      duration: 'permanent',
      failureRedirect: '/login',
    })(req, res, next);
  });

  app.get('/connect/reddit/callback', function(req, res, next) {
    if (req.query.state == req.session.state) {
      passport.authorize('reddit', {
        failureRedirect: '/login',
      })(req, res, next);
    }
    else {
      next( new Error(403) );
    }
  }, function(req, res, next) {
    res.redirect('/close.html');
  });
};
