# Unified-dashboard

This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`
* server/config.json is not included. Make sure to add it. Here is a sample,
```
{
  "host" : {
    "hostname" : "localhost",
    "port"     : "8080"
  },
  "database" : {
    "hostname" : "<mongodb hosetname>",
    "port"     : "<port>",
    "user"     : "<user>",
    "password" : "<password>",
    "database" : "<database name>"
  },
  "google" : {
    "google_client_id" : "1234",
    "google_client_secret" : "1234",
    "google_places_api_key" : "1234"
  },
  "reddit" : {
    "reddit_client_id" : "1234",
    "reddit_client_secret" : "1234",
    "user_agent" : "user agent as per reddit"
  },
  "twitter" : {
    "twitter_consumer_key" : "",
    "twitter_consumer_secret" : ""
  },
  "hacker_news" : {
    "provider_name" : "hacker-news"
  },
  "params" : {
    "limit" : 10
  },
  "session" : {
    "secret" : "randon-secret"
  }
}
```

## Running / Development

* `ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

