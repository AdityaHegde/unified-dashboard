import Ember from 'ember';

export default Ember.Object.create({
  'reddit' : Ember.Object.create({
    label : 'Reddit',
    connectLink : '/connect/reddit',
  }),
  'twitter' : Ember.Object.create({
    label : 'Twitter',
    connectLink : '/connect/twitter',
  }),
  'hacker-news' : Ember.Object.create({
    label : 'Hacker News',
    connectLink : '/connect/hackernews',
  }),
});
