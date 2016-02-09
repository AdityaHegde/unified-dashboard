var passport                = require('passport');
var googleStrategyInstance  = require('./google-strategy-instance');
var redditStrategyInstance  = require('./reddit-strategy-instance');
var twitterStrategyInstance = require('./twitter-strategy-instance');
var connectMongoDb          = require('../connectMongoDb');
var User                    = connectMongoDb.modelMap.User;
var LocalStrategy           = require('passport-local').Strategy;

passport.use(googleStrategyInstance);
passport.use(redditStrategyInstance);
passport.use(twitterStrategyInstance);
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
