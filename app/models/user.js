import DS from 'ember-data';

export default DS.Model.extend({
  username    : DS.attr(),
  email       : DS.attr(),
  createdAt   : DS.attr(),
  updatedAt   : DS.attr(),
});