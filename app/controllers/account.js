import Ember from 'ember';
import PROVIDER_DATA_MAP from 'unified-dashboard/data/provider-data';

export default Ember.Controller.extend({
  accountsNotConnected : Ember.computed('model.@each.provider', function() {
    var accountsNotConnected = [];
    var model = this.get("model");
    Object.keys(PROVIDER_DATA_MAP).forEach(function(provider) {
      if(!model.findBy('provider', provider)) {
        accountsNotConnected.push(PROVIDER_DATA_MAP[provider]);
      }
    });
    return accountsNotConnected;
  }),

  actions : {
    remove : function(account) {
      account.destroyRecord();
    },
  },
});
