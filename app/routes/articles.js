import Ember from 'ember';

export default Ember.Route.extend({
  model : function() {
    return this.store.query("article", {});
  },

  afterModel : function(model) {
    console.log(model.get("meta"));
  },
});
