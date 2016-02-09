import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQueryRecord : function(query, modelName) {
    var current = !!query.current;
    delete query.current;
    var url = this._super(...arguments);
    if(current) {
      return url.replace("/users", "/users/current");
    }
    else {
      return url;
    }
  },
});
