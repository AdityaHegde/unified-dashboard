var passport       = require('passport');
var utils          = require('../../utils');
var _              = require('lodash');
var connectMongoDb = require('../../connectMongoDb');
var strategyInstance = require('../../passport/google-strategy-instance');

module.exports = function(app) {
  app.get('/auth/google', passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/plus.profile.emails.read',
      //'https://www.googleapis.com/auth/contacts.readonly',
    ],
  }));

  app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      connectMongoDb.modelMap.User.update({
        email : req.user.email,
      }, req.user, {
        upsert : true,
        setDefaultsOnInsert : true,
      }, function(err, user) {
        if(err || !user) {
          console.log(err.stack);
          res.redirect('/login');
        }
        else {
          res.redirect('/account');
        }
      });
    }
  );

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });
};
