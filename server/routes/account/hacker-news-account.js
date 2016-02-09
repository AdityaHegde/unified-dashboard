var utils          = require('../../utils');
var _              = require('lodash');
var connectMongoDb = require('../../connectMongoDb');
var config         = require('../../config');

module.exports = function(app) {
  app.get('/connect/hackernews', function(req, res) {
    if(req.user) {
      connectMongoDb.modelMap.Account.update({
        provider : config.hacker_news.provider_name,
        user : req.user._id,
      }, {
        provider : config.hacker_news.provider_name,
        name : req.user.username,
        user : req.user._id,
      }, {
        upsert : true,
      }, function(err) {
        res.redirect('/account');
      });
    }
    else {
      res.redirect('/');
    }
  });
};
