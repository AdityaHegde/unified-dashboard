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
      'https://www.googleapis.com/auth/contacts.readonly'
    ],
  }));

  app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {

      //TODO : find a better way to fix the json-api interaction
      req.user.user_id = req.user.id;
      delete req.user.id;

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
          res.redirect('/');
        }
      });
    }
  );

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/api/contacts', function(req, res) {
    if(req.user && req.user.accessToken) {
      strategyInstance.getContacts(req.user, req.query, function(err, contacts) {
        if(err || !contacts) {
          res.json({
            error : err,
          });
        }
        else {
          var
          contactsMap = {},
          contacts = _.filter(_.map(contacts.feed.entry, function(contact) {
            var
            email = _.result(_.find(contact.gd$email, "primary", "true"), "address"),
            contactObj = {
              displayName : contact.gd$name && contact.gd$name.gd$fullName && contact.gd$name.gd$fullName.$t,
              email : email,
            };
            contactsMap[email] = contactObj;
            return contactObj;
          }), "email"),
          emails = _.map(contacts, "email");

          /*connectMongoDb.modelMap.User.find({
            email : { $in : emails },
          }, function(err, usersFound) {
            if(err || !usersFound) {
              res.json({
                error : err.message,
              });
            }
            else {
              _.forEach(usersFound, function(user) {
                contactsMap[user.email].mongoid = user._id;
              });
              res.json({
                contacts : contacts,
              });
            }
          });*/
          res.json({
            contacts : contacts,
          });
        }
      });
    }
    else {
      res.json({
        error : "Not logged in",
      });
    }
  });
};
