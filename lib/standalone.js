'use strict';

module.exports.create = function (defaults) {
  var handlers =  {
    getOptions: function () {
      return defaults;
    }
    //
    // set,get,remove challenges
    //
    // Note: this is fine for a one-off CLI tool
    // but a webserver using node-cluster or multiple
    // servers should use a database of some sort
  , _challenges: {}
  , set: function (args, domain, token, secret, cb) {
      handlers._challenges[token] = secret;
      cb(null);
    }
  , get: function (args, domain, token, cb) {
      // TODO keep in mind that, generally get args are just args.domains
      // and it is disconnected from the flow of setChallenge and removeChallenge
      cb(null, handlers._challenges[token]);
    }
  , remove: function (args, domain, token, cb) {
      delete handlers._challenges[token];
      cb(null);
    }

  };

  return handlers;
};
