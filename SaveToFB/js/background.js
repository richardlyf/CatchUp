const NOT_LOADED = 'not_loaded';
const LOADING = 'loading';
const LOADED = 'loaded';

var _cssState = NOT_LOADED;
var _jsState = NOT_LOADED;

var _timerID = undefined;
var _loadingListener = undefined;
var _backoffInterval = 1; // 1 minute to start

function requestScript(source, callback, doc) {
  doc = doc ? doc : document;

  var script  = doc.createElement('script');
  script.src  = source;
  script.type = 'text/javascript';
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.onload = function() {
    callback && callback(true);
  };

  script.onerror = function() {
    callback && callback(false);
  };

  doc.getElementsByTagName('head')[0].appendChild(script);
}

function requestCss(source, callback, doc) {
  doc = doc ? doc : document;

  var link  = doc.createElement('link');
  link.rel  = 'stylesheet';
  link.type = 'text/css';
  link.href = source;
  link.media = 'all';
  link.onload = function() {
    callback && callback(true);
  };
  link.onerror = function() {
    callback && callback(false);
  };

  doc.getElementsByTagName('head')[0].appendChild(link);
}

function getIsLoading() {
  return _cssState == LOADING || _jsState == LOADING;
}

function getIsLoaded() {
  return _cssState == LOADED &&  _jsState == LOADED;
}

function setLoadingListener(callback) {
  _loadingListener = callback;
  if (_loadingListener) {
    ensureLoaded();
  }
}

function getFullUrl(path) {
  var current = window.options.current;
  return 'https://'+current.domain+path;
}

function ensureCssLoaded() {
  // If loaded or loading, nothing to do
  if (_cssState == NOT_LOADED) {
    _cssState = LOADING;

    // We request CSS here so it is cached
    requestCss(
      getFullUrl('/saved/extension/rsrc/css/'),
      function(success) {
        _cssState = success ? LOADED : NOT_LOADED;
        onLoadStateUpdated();
      });
  }
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function ensureJSLoaded() {
  // If loaded or loading, nothing to do
  if (_jsState == NOT_LOADED) {
    _jsState = LOADING;

    // TODO (#11999424): cache key in browser to take advantage of caching JS
    var randomKey = guid();
    requestScript(
      getFullUrl('/saved/extension/rsrc/js/?key=' + randomKey),
      function(success) {
        _jsState = (success && SavedExtension !== undefined)
          ? LOADED
          : NOT_LOADED;
        onLoadStateUpdated();
      });
  }
}

function ensureLoaded() {
  if (_timerID !== undefined) {
    window.clearTimeout(_timerID);
    _timerID = undefined;
  }

  ensureJSLoaded();
  ensureCssLoaded();
}

function onLoadStateUpdated() {
  if (getIsLoading()) {
    return;
  }

  // If we failed to load, try again with backoff
  if (getIsLoaded()) {
     SavedExtension.initBackground();

     // Configure extension to re-load JS every 24 hours, fetch latest JS
     window.setTimeout(chrome.runtime.reload, 24 * 60 * 60000);
  } else {
    // Retry interval using exponential backoff, with max of 8 hours
    _backoffInterval = Math.min(_backoffInterval * 2, 480);
    _timerID = window.setTimeout(ensureLoaded, _backoffInterval * 60000);
  }

  if (_loadingListener !== undefined) {
    _loadingListener(getIsLoaded());
  }
 }

document.addEventListener('DOMContentLoaded', function () {
  // Load settings
  window.options.initDebug();

  // Fetch resources
  ensureLoaded();

  console.log("I am alive.");
});
