var connectMongoDb = require('../connectMongoDb');
var redditAdapter = require('../adapters/reddit');
var hackerNewsAdapter = require('../adapters/hacker-news');
var twitterAdapter = require('../adapters/twitter');
var accountToAdapterMap = {
  "reddit" : redditAdapter,
  "hacker-news" : hackerNewsAdapter,
  "twitter" : twitterAdapter,
};
var Promise = require('promise');
var _ = require('lodash');
var qs = require('qs');

module.exports = function(app) {
  app.get('/api/articles', function(req, res) {
    var accounts;
    connectMongoDb.modelMap.Account.find({
      user : req.user._id,
    }).then(function(_accounts) {
      accounts = _accounts;
      return Promise.all(accounts.map(function(account) {
        return accountToAdapterMap[account.provider].getNewArticles(account, req.query[account.provider]);
      }));
    }).then(function(articlesByAccount) {
      console.log("have all articles");
      var afterParams = {}, beforeParams = {}, articles = [],
      providerToAccountMap = {};

      articlesByAccount.forEach(function(articlesPerAccount, i) {
        articles.push.apply(articles, articlesPerAccount);
        providerToAccountMap[accounts[i].provider] = accounts[i];
        if(articlesPerAccount.length > 0) {
          afterParams[accounts[i].provider] = {
            after : articlesPerAccount[articlesPerAccount.length - 1].attributes.actualID,
          };
          beforeParams[accounts[i].provider] = {
            before : articlesPerAccount[0].attributes.actualID,
          };
        }
      });

      articles = articles.sort(function(a, b) {
        return b.attributes.created - a.attributes.created;
      });

      var included = [];
      Promise.all(articles.map(function(article) {
        return accountToAdapterMap[article.attributes.provider].getComments(providerToAccountMap[article.attributes.provider], article, included);
      })).then(function() {
        res.json({
          link : {
            self   : "/api/articles",
            after  : "/api/articles?" + qs.stringify(afterParams),
            before : "/api/articles?" + qs.stringify(beforeParams),
          },
          data : articles,
          included : included,
          meta : {
            //ember-data doesnt pick up link block yet
            after  : afterParams,
            before : beforeParams,
          },
        });
      }, function(err) {
        res.json({
          errors : [err],
        });
      });

    }, function(err) {
      console.log(err.stack);
      res.json({
        errors : [err],
      });
    });
  });
};
