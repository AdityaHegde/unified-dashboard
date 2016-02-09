import DS from 'ember-data';

export default DS.Model.extend({
  actualID : DS.attr(),
  author   : DS.attr(),
  text     : DS.attr(),
  created  : DS.attr(),
  provider : DS.attr(),
  replies : DS.hasMany('comment'),
});
