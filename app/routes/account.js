import Ember from 'ember';

export default Ember.Route.extend({
  model : function() {
    return this.store.query('account', {
      filter : {
        user : this.modelFor('application').get('id'),
      }
    });
  },
});
