var connectMongoDb = require('../connectMongoDb');
var Promise = require('promise');
var redditStrategyInstance = require('../passport/reddit-strategy-instance');
var request = require('request');
var config = require('../config');
var qs = require('qs');

var URL_MAP = {
  new : "https://oauth.reddit.com/r/dota2/new",
  top : "https://oauth.reddit.com/r/dota2/hot",
};
var PROVIDER = "reddit";

var normalizeListOfArticles = function(redditPosts) {
  return redditPosts.map(function(redditPost) {
    var actualID = redditPost.kind + "_" + redditPost.data.id;
    return {
      type    : "article",
      id      : PROVIDER + "__" + actualID,
      attributes : {
        actualID : actualID,
        postID   : redditPost.data.id,
        title    : redditPost.data.title,
        desc     : redditPost.data.selftext,
        author   : redditPost.data.author,
        ups      : redditPost.data.ups,
        downs    : redditPost.data.downs,
        score    : redditPost.data.score,
        created  : redditPost.data.created_utc,
        url      : redditPost.data.url,
        provider : PROVIDER,
      },
    };
  });
};

var normalizeComments = function(comments, commentResourceList) {
  return comments.map(function(comment) {
    var commentResource = {
      type : "comment",
      id : PROVIDER + "__" + comment.data.id,
      attributes : {
        actualID : comment.data.id,
        text     : comment.data.body,
        author   : comment.data.author,
        created  : comment.data.created,
        ups      : comment.data.ups,
        downs    : comment.data.downs,
        score    : comment.data.score,
      },
      relationships : {
        replies : {
          data : [],
        },
      },
    };
    commentResourceList.push(commentResource);
    if(comment.data.replies) {
      commentResource.relationships.replies.data = normalizeComments(comment.data.replies.data.children, commentResourceList);
    }
    return {
      type : "comment",
      id : commentResource.id,
    };
  });
};

var getArticles = function(account, articlesURL, params) {
  var queryParams = {
    limit : config.params.limit,
  };
  if(params.before) {
    queryParams.before = params.before;
  }
  else if(params.after) {
    queryParams.after = params.after;
  }
  console.log(qs.stringify(queryParams));
  return new Promise(function(resolve, reject) {
    request({
      url : articlesURL + "?" + qs.stringify(queryParams),
      headers : {
        "Authorization" : "bearer " + account.accessToken,
        "User-Agent" : config.reddit.user_agent,
      },
    }, function(error, response, body) {
      console.log("reddit data recieved");
      resolve(normalizeListOfArticles(JSON.parse(body).data.children));
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
    return new Promise(function(resolve, reject) {
      request({
        url : "https://oauth.reddit.com/r/dota2/comments/" + article.attributes.postID,
        headers : {
          "Authorization" : "bearer " + account.accessToken,
          "User-Agent" : config.reddit.user_agent,
        },
      }, function(error, response, body) {
        var bodyJSON = JSON.parse(body);
        article.relationships = {
          comments : {
            links : {},
            data : normalizeComments(bodyJSON[1] && bodyJSON[1].data.children || [], commentResourceList),
          },
        };
        resolve();
      });
    });
  },
};
