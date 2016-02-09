import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  namespace : 'api',

  buildURL : function(modelName, id, snapshot, requestType, query) {
    var
    url = this._super(...arguments),
    model = this.store.modelFor(modelName),
    relations = [];
    model.eachRelationship(function(relation) {
      relations.push(relation);
    }, this);

    if(relations.length > 0) {
      url += (url.match(/\?.*/) ? "&" : "?") + "include=" + relations.join(",");
    }
    return url;
  },

  shouldBackgroundReloadAll : function(store, snapshotRecordArray) {
    if(snapshotRecordArray.type === "user") {
      return false;
    }
    else {
      return this._super(...arguments);
    }
  },

  shouldBackgroundReloadRecord : function(store, snapshot) {
    if(snapshot.type === "user") {
      return false;
    }
    else {
      return this._super(...arguments);
    }
  },
});
