var API = require('json-api');
var connectMongoDb = require('./connectMongoDb');
var Promise = require('promise');

module.exports = function(app) {
  var adapter = new API.dbAdapters.Mongoose(connectMongoDb.modelMap);
  var registry = new API.ResourceTypeRegistry({
    "users" : {
      urlTemplates : {
        "self" : "/users/{id}",
      },
      labelMappers : {
        "current" : function(model, req) {
          if(req.user) {
            //console.log("current");
            //console.log(req.user._id);
            return req.user._id.toString();
          }
          else {
            return null;
          }
        },
      },
    },
    "accounts" : {
      urlTemplates : {
        "self" : "/accounts/{id}",
      },

      beforeRender : function(resource, req, res, superFn) {
        delete resource._attrs.accessToken;
        delete resource._attrs.refreshToken;
        delete resource._attrs.account_id;
        return resource;
      },
    },
  }, {
    "dbAdapter": adapter
  });

  // Initialize the automatic documentation.
  var DocsController = new API.controllers.Documentation(registry, {name: 'Example API'});

  // Set up our controllers
  var APIController = new API.controllers.API(registry);
  var Front = new API.httpStrategies.Express(APIController, DocsController);
  var requestHandler = Front.apiRequest.bind(Front);

  app.get("/api", Front.docsRequest.bind(Front));

  // Add routes for basic list, read, create, update, delete operations
  app.route("/api/:type(accounts|users)")
     .get(requestHandler)
     .post(requestHandler)
     .patch(requestHandler);
  app.route("/api/:type(accounts|users)/:idOrLabel")
     .get(requestHandler)
     .patch(requestHandler)
     .delete(requestHandler);

  // Add routes for adding to, removing from, or updating resource relationships
  app.route("/api/:type(accounts|users)/:id/relationships/:relationship")
     .get(requestHandler)
     .post(requestHandler)
     .patch(requestHandler)
     .delete(requestHandler);

};
