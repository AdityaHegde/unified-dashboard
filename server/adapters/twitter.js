var connectMongoDb = require('../connectMongoDb');
var Promise = require('promise');
var redditStrategyInstance = require('../passport/reddit-strategy-instance');
var request = require('request');
var config = require('../config');
var qs = require('qs');
var Twitter = require('twitter');

var URL_MAP = {
  new : "statuses/home_timeline",
  top : "statuses/home_timeline",
};
var PROVIDER = "twitter";

var normalizeListOfArticles = function(tweets) {
  return tweets.map(function(tweet) {
    return {
      type    : "article",
      id      : PROVIDER + "__" + tweet.id,
      attributes : {
        actualID : tweet.id,
        title    : tweet.text,
        author   : tweet.user.name,
        score    : tweet.retweet_count,
        created  : new Date(tweet.created_at).getTime() / 1000,
        provider : PROVIDER,
      },
    };
  });
};

var normalizeComments = function(retweets, commentResourceList) {
  return retweets.map(function(tweet) {
    var commentResource = {
      type    : "comment",
      id      : PROVIDER + "__" + tweet.id,
      attributes : {
        actualID : tweet.id,
        text     : tweet.text,
        author   : tweet.user.name,
        score    : tweet.retweet_count,
        created  : new Date(tweet.created_at).getTime() / 1000,
        provider : PROVIDER,
      },
    };
    commentResourceList.push(commentResource);
    return {
      type : "comment",
      id : commentResource.id,
    };
  });
};

var getComments = function(twitterClient, article, commentResourceList) {
  //console.log(article.attributes.actualID);
  return new Promise(function(resolve, reject) {
    twitterClient.get("statuses/retweets/" + article.attributes.actualID, {
      count : 10,
    }, function(error, tweets, response) {
      //console.log("retweets data recieved");
      if(error) {
        resolve();
      }
      else {
        normalizeComments(tweets, commentResourceList);
        resolve();
      }
    });
  });
};

var getArticles = function(account, articlesURL, params) {
  var queryParams = {
    count : config.params.limit,
  };
  if(params.before) {
    queryParams.since_id = params.before;
  }
  else if(params.after) {
    queryParams.max_id = params.after - 1;
  }
  console.log(qs.stringify(queryParams));
  return new Promise(function(resolve, reject) {
    new Twitter({
      consumer_key        : config.twitter.twitter_consumer_key,
      consumer_secret     : config.twitter.twitter_consumer_secret,
      access_token_key    : account.accessToken,
      //repurposed attribute
      access_token_secret : account.refreshToken,
    }).get(articlesURL, queryParams, function(error, tweets, response) {
      console.log("twitter data recieved");
      resolve(normalizeListOfArticles(tweets));
    });
  });
};

module.exports = {
  getNewArticles : function(account, params) {
    return getArticles(account, URL_MAP.new, params || {});
  },

  getTopArticles : function(account, params) {
    return getArticles(account, URL_MAP.top, params || {});
  },

  getComments : function(account, article, commentResourceList) {
    return getComments(new Twitter({
      consumer_key        : config.twitter.twitter_consumer_key,
      consumer_secret     : config.twitter.twitter_consumer_secret,
      access_token_key    : account.accessToken,
      //repurposed attribute
      access_token_secret : account.refreshToken,
    }), article, commentResourceList).then(function(retweers) {
      article.relationships = {
        comments : {
          links : {},
          data : retweers,
        },
      };
      return Promise.resolve();
    });
  },
};
