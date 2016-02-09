var dbConfig  = require("./config").database;
var mongoose = require('mongoose');
//disconnect previouse connections
mongoose.disconnect(function() {
  mongoose.connect('mongodb://' + dbConfig.user + ':' + dbConfig.password + '@' + dbConfig.hostname + ':' + dbConfig.port + '/' + dbConfig.database, {
    server : {
      poolSize : 2,
    },
  });
});

var globSync = require('glob').sync;
var models   = globSync('./models/**/*.js', { cwd: __dirname }).map(require);
var modelMap = {};

models.forEach(function(model) {
  modelMap[model.modelName] = model;
  //modelMap[model.singular] = model;
  //modelMap[model.plural] = model;
});

module.exports = {
  modelMap : modelMap,
};
