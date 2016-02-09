import Ember from 'ember';

export default Ember.Route.extend({
  model : function() {
    return this.store.queryRecord("user", {
      current : true,
    });
  },

  afterModel : function(model) {
    if(!model) {
      this.transitionTo("login");
    }
    else {
      //this.transitionTo("articles");
    }
  },
});
