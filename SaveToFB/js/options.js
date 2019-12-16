/**
 * File that contains all user configurable options. See chrome://extensions/
 * and http://code.google.com/chrome/extensions/options.html .
 */

// extend Storage API to set and get JS objects
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function(key, def) {
    var value = this.getItem(key);
    var obj = window.JSON.parse(value);
    if (obj) {
      return obj;
    } else if (def) {
      return def;
    }
};

window.options = {

  // Initialize stored to persisted values from local storage
  stored: window.localStorage.getObject('options', {}),

  // Set by init to curent working config values
  current: {},


  init: function(debug) {
    for (var prop in options.defaults) {
      var stored = options.stored[prop];
      var debug_value = options.debug[prop];
      if (typeof stored !== 'undefined') {
        options.current[prop] = stored;
      } else if (debug && typeof debug_value !== 'undefined') {
        options.current[prop] = debug_value;
      } else {
        options.current[prop] = options.defaults[prop];
      }
    }
    options.save();
    return options;
  },

  initDebug: function() {
    // Uncomment if developing locally
    // window.__DEV__ = 1;
    options.reset();
    return options.init(true);
  },

  save: function() {
    window.localStorage.setObject('options', window.options.current);
    return options;
  },

  reset: function() {
    options.stored = options.current = {};
    options.save();
    return options;
  },

  defaults: {
    domain: 'www.facebook.com', // Replace with dev server URL to test locally
    graphDomain: 'graph.facebook.com',
    protocol: 'https://'
  },

  debug: {
    domain: 'www.facebook.com', // Replace with dev server URL to test locally
    graphDomain: 'graph.facebook.com',
  },

};
