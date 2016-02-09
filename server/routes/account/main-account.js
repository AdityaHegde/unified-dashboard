var passport = require('passport');
var connectMongoDb = require('../../connectMongoDb');
var User = connectMongoDb.modelMap.User;

module.exports = function(app) {
  app.post('/register', function(req, res, next) {
    User.register(new User({
      username : req.body.username,
      email : req.body.email,
    }), req.body.password, function(err, account) {
      if (err) {
        return res.redirect('/#register');
      }

      passport.authenticate('local')(req, res, function () {
        req.session.save(function (err) {
          if (err) {
            return next(err);
          }
          res.redirect('/#account');
        });
      });
    });
  });

  app.post('/login', passport.authenticate('local'), function(req, res, next) {
    req.session.save(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect('/#account');
    });
  });

  app.get('/logout', function(req, res, next) {
    req.logout();
    req.session.save(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect('/login');
    });
  });
};
