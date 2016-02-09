var Promise = require('promise');
var request = require('request');
var config = require('../config');
var _ = require('lodash');

var URL_MAP = {
  "new" : "https://hacker-news.firebaseio.com/v0/newstories.json",
  "top" : "https://hacker-news.firebaseio.com/v0/topstories.json",
};
var PROVIDER = "hacker-news";

var normalizeListOfArticles = function(articles) {
  return articles.map(function(article) {
    return {
      type : "article",
      id : PROVIDER + "__" + article.id,
      attributes : {
        actualID : article.id,
        title    : article.title,
        desc     : article.text,
        author   : article.by,
        score    : article.score,
        created  : article.time,
        url      : article.url,
        provider : PROVIDER,
      },
      relationships : {
        comments : {
          data : article.kids,
        },
      },
    };
  });
};

var normalizeComments = function(comments, commentResourceList) {
  return Promise.all(comments.map(function(comment) {
    var commentResource = {
      type : "comment",
      id : PROVIDER + "__" + comment.id,
      attributes : {
        actualID : comment.id,
        text     : comment.text,
        author   : comment.by,
        created  : comment.time,
      },
      relationships : {
        replies : {
          data : [],
        },
      },
    };
    commentResourceList.push(commentResource);
    return new Promise(function(resolve, reject) {
      if(comment.kids && comment.kids.length > 0) {
        getComments(comment, commentResourceList).then(function(replies) {
          commentResource.relationships.replies.data = replies;
          resolve({
            type : "comment",
            id : commentResource.id,
          });
        });
      }
      else {
        resolve({
          type : "comment",
          id : commentResource.id,
        });
      }
    });
  }));
};

var getComments = function(article, commentResourceList) {
  if(article.relationships.comments.data && article.relationships.comments.data.length) {
    return Promise.all(article.relationships.comments.data.map(function(comment) {
      return new Promise(function(resolve, reject) {
        request({
          url : "https://hacker-news.firebaseio.com/v0/item/" + comment + ".json",
        }, function(error, response, body) {
          resolve(JSON.parse(body));
        });
      });
    })).then(function(data) {
      return normalizeComments(data, commentResourceList);
    }, function(err) {
      return Promise.reject(err);
    });
  }
  else {
    return Promise.resolve([]);
  }
};

var getArticles = function(account, articlesURL, params) {
  return new Promise(function(resolve, reject) {
    request({
      url : articlesURL,
    }, function(error, response, body) {
      var stories = JSON.parse(body);
      if(params.before) {
        var idx = stories.indexOf(Number(params.before));
        console.log("before : " + params.before + " : " + idx);
        if(idx >= 0) {
          stories = stories.slice(0, idx);
        }
        else {
          stories = stories.slice(0, config.params.limit);
        }
      }
      else if(params.after) {
        var idx = stories.indexOf(Number(params.after));
        console.log("after : " + params.after + " : " + idx);
        if(idx >= 0) {
          stories = stories.slice(idx + 1, idx + 1 + config.params.limit);
        }
        else {
          stories = stories.slice(0, config.params.limit);
        }
      }
      else {
        stories = stories.slice(0, config.params.limit);
      }
      Promise.all(stories.map(function(story) {
        return new Promise(function(_resolve, _reject) {
          request({
            url : "https://hacker-news.firebaseio.com/v0/item/" + story + ".json",
          }, function(error, response, body) {
            _resolve(JSON.parse(body));
          });
        });
      })).then(function(data) {
        console.log("have hacker news data");
        resolve(normalizeListOfArticles(data));
      }, function(err) {
        reject(err);
      });
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
    return getComments(article, commentResourceList).then(function(comments) {
      article.relationships = {
        comments : {
          links : {},
          data : comments,
        },
      };
      return Promise.resolve();
    });
  },
};
