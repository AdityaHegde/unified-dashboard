import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  keyForAttribute: function(attr) {
    return attr;
  },

  keyForRelationship: function(rawKey) {
    return rawKey;
  },

  extractMeta: function(store, typeClass, payload) {
    console.log(payload);
    return this._super(...arguments);
  },
});
