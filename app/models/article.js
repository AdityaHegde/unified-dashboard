import DS from 'ember-data';

export default DS.Model.extend({
  actualID : DS.attr(),
  title    : DS.attr(),
  desc     : DS.attr(),
  author   : DS.attr(),
  ups      : DS.attr(),
  downs    : DS.attr(),
  score    : DS.attr(),
  created  : DS.attr(),
  url      : DS.attr(),
  provider : DS.attr(),
  comments : DS.hasMany('comment'),
});
