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

  application : Ember.inject.controller("application"),

  actions : {
    remove : function(account) {
      account.destroyRecord();
    },

    connect : function(provider) {
      //this.set("connectLink", provider.connectLink);
      /*var windowObjectReference = window.open(provider.connectLink, provider.label);
      var store = this.store;
      var user = this.get('application.model.id');
      var model = this.get("model");
      windowObjectReference.onunload = function() {
        Ember.run(function() {
          store.queryRecord('account', {
            provider : provider.name,
            user : user,
          }).then(function(account) {
            if(!model.contains(account)) {
              model.pushObject(account);
            }
          });
        });
      };*/
    },
  },
});
