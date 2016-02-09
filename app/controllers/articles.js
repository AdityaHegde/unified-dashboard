import Ember from 'ember';

export default Ember.Controller.extend({
  actions : {
    loadNewer : function() {
      var model = this.get("model");
      this.store.query('article', model.get("meta.before")).then(function(newerArticles) {
        model.addObjects(newerArticles.content);
        model.set("meta", newerArticles.get("meta"));
      });
    },

    loadOlder : function() {
      var model = this.get("model");
      this.store.query('article', model.get("meta.after")).then(function(olderArticles) {
        model.addObjects(olderArticles.content);
        model.set("meta", olderArticles.get("meta"));
      });
    },
  },
});
