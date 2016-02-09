import DS from 'ember-data';
import Ember from 'ember';
import PROVIDER_DATA_MAP from 'unified-dashboard/data/provider-data';

export default DS.Model.extend({
  name     : DS.attr(),
  provider : DS.attr(),
  user     : DS.belongsTo('user'),

  providerData : Ember.computed('provider', function() {
    return PROVIDER_DATA_MAP[this.get('provider')];
  }),
});
