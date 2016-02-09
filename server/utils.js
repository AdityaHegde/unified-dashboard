var _ = require("lodash");

module.exports = {
  buildErrorResponse : function(err) {
    return {
      error : err,
    };
  },

  buildResponse : function(res, key, hasId) {
    var resObj = {};
    resObj[key] = hasId && _.isArray(res) ? res[0] : res;
    return resObj;
  },

  relativeDate : function(offset, date) {
    date = date || new Date();
    return new Date(date.getTime() + offset);
  },

  ensureAuthenticated : function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
  },
};
