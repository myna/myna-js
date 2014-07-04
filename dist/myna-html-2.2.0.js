(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var log,
  __slice = [].slice;

log = {
  debug: false,
  info: function() {
    var args, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (log.debug) {
      if ((_ref = window.console) != null) {
        _ref.log(args);
      }
    }
  },
  error: function() {
    var args, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (log.debug) {
      if ((_ref = window.console) != null) {
        _ref.error(args);
      }
    }
    throw args;
  }
};

module.exports = log;


},{}],2:[function(require,module,exports){
var log;

log = require('./log');

Myna.readyHandlers = [];

Myna.ready = function(callback) {
  if (Myna.client) {
    callback(Myna.client);
  } else {
    Myna.readyHandlers.push(callback);
  }
};

Myna.triggerReady = function(client) {
  var callback, _i, _len, _ref, _results;
  _ref = Myna.readyHandlers;
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    callback = _ref[_i];
    _results.push(callback.call(Myna, client));
  }
  return _results;
};

Myna.init = function(options) {
  log.debug("Myna.init", options);
  if (Myna.preview() && options.latest) {
    Myna.initRemote({
      url: options.latest
    });
  } else {
    Myna.initLocal(options);
  }
};

Myna.initLocal = function(options) {
  var apiKey, apiRoot, experiments, expt, _ref, _ref1;
  log.debug("Myna.init", options);
  apiKey = (_ref = options.apiKey) != null ? _ref : log.error("Myna.init", "no apiKey in options", options);
  apiRoot = (_ref1 = options.apiRoot) != null ? _ref1 : "//api.mynaweb.com";
  experiments = (function() {
    var _i, _len, _ref2, _ref3, _results;
    _ref3 = (_ref2 = options.experiments) != null ? _ref2 : [];
    _results = [];
    for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
      expt = _ref3[_i];
      _results.push(new Myna.Experiment(expt));
    }
    return _results;
  })();
  Myna.client = new Myna.Client({
    apiKey: apiKey,
    apiRoot: apiRoot,
    experiments: experiments
  });
  Myna.recorder = new Myna.Recorder(Myna.client);
  Myna.binder = new Myna.Binder(Myna.client);
  Myna.googleAnalytics = new Myna.GoogleAnalytics(Myna.client);
  if (Myna.preview()) {
    Myna.inspector = new Myna.Inspector(Myna.client, Myna.binder);
    Myna.$(function() {
      Myna.triggerReady(Myna.client);
      Myna.inspector.init();
      return Myna.binder.init();
    });
  } else {
    Myna.$(function() {
      Myna.triggerReady(Myna.client);
      Myna.recorder.init();
      Myna.googleAnalytics.init();
      return Myna.binder.init();
    });
  }
  return Myna.client;
};

Myna.initRemote = function(options) {
  var error, success, url, _ref, _ref1, _ref2;
  log.debug("Myna.initRemote", options);
  url = (_ref = options.url) != null ? _ref : log.error("Myna.Client.initRemote", "no url specified in options", options);
  success = (_ref1 = options.success) != null ? _ref1 : (function() {});
  error = (_ref2 = options.error) != null ? _ref2 : (function() {});
  Myna.jsonp.request({
    url: url,
    success: function(json) {
      log.debug("Myna.initRemote", "response", json);
      return success(Myna.initLocal(json));
    },
    error: error
  });
};


},{"./log":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZGF2ZS9kZXYvcHJvamVjdHMvbXluYS1qcy9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9kYXZlL2Rldi9wcm9qZWN0cy9teW5hLWpzL3NyYy9hcHAvbG9nLmNvZmZlZSIsIi9Vc2Vycy9kYXZlL2Rldi9wcm9qZWN0cy9teW5hLWpzL3NyYy9hcHAvbXluYS1odG1sLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsR0FBQTtFQUFBLGtCQUFBOztBQUFBLEdBQUEsR0FBTTtBQUFBLEVBQ0osS0FBQSxFQUFPLEtBREg7QUFBQSxFQUdKLElBQUEsRUFBTSxTQUFBLEdBQUE7QUFDSixRQUFBLFVBQUE7QUFBQSxJQURLLDhEQUNMLENBQUE7QUFBQSxJQUFBLElBQUcsR0FBRyxDQUFDLEtBQVA7O1lBQ2dCLENBQUUsR0FBaEIsQ0FBb0IsSUFBcEI7T0FERjtLQURJO0VBQUEsQ0FIRjtBQUFBLEVBUUosS0FBQSxFQUFPLFNBQUEsR0FBQTtBQUNMLFFBQUEsVUFBQTtBQUFBLElBRE0sOERBQ04sQ0FBQTtBQUFBLElBQUEsSUFBRyxHQUFHLENBQUMsS0FBUDs7WUFDZ0IsQ0FBRSxLQUFoQixDQUFzQixJQUF0QjtPQURGO0tBQUE7QUFFQSxVQUFNLElBQU4sQ0FISztFQUFBLENBUkg7Q0FBTixDQUFBOztBQUFBLE1BY00sQ0FBQyxPQUFQLEdBQWlCLEdBZGpCLENBQUE7Ozs7QUNBQSxJQUFBLEdBQUE7O0FBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxPQUFSLENBQU4sQ0FBQTs7QUFBQSxJQUdJLENBQUMsYUFBTCxHQUFxQixFQUhyQixDQUFBOztBQUFBLElBTUksQ0FBQyxLQUFMLEdBQWEsU0FBQyxRQUFELEdBQUE7QUFDWCxFQUFBLElBQUcsSUFBSSxDQUFDLE1B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SSxDQUFDLE1BQXZCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFkLENBQUEsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQXJCLENBQUEsQ0FGQSxDQUFBO2FBR0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFaLENBQUEsRUFKSztJQUFBLENBQVAsQ0FBQSxDQVBGO0dBVkE7U0F1QkEsSUFBSSxDQUFDLE9BeEJVO0FBQUEsQ0EzQmpCLENBQUE7O0FBQUEsSUFzREksQ0FBQyxVQUFMLEdBQWtCLFNBQUMsT0FBRCxHQUFBO0FBQ2hCLE1BQUEsdUNBQUE7QUFBQSxFQUFBLEdBQUcsQ0FBQyxLQUFKLENBQVUsaUJBQVYsRUFBNkIsT0FBN0IsQ0FBQSxDQUFBO0FBQUEsRUFFQSxHQUFBLHlDQUE2QixHQUFHLENBQUMsS0FBSixDQUFVLHdCQUFWLEVBQW9DLDZCQUFwQyxFQUFtRSxPQUFuRSxDQUY3QixDQUFBO0FBQUEsRUFHQSxPQUFBLCtDQUE2QixDQUFDLFNBQUEsR0FBQSxDQUFELENBSDdCLENBQUE7QUFBQSxFQUlBLEtBQUEsNkNBQTZCLENBQUMsU0FBQSxHQUFBLENBQUQsQ0FKN0IsQ0FBQTtBQUFBLEVBTUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQ0U7QUFBQSxJQUFBLEdBQUEsRUFBUyxHQUFUO0FBQUEsSUFDQSxPQUFBLEVBQVMsU0FBQyxJQUFELEdBQUE7QUFDUCxNQUFBLEdBQUcsQ0FBQyxLQUFKLENBQVUsaUJBQVYsRUFBNkIsVUFBN0IsRUFBeUMsSUFBekMsQ0FBQSxDQUFBO2FBQ0EsT0FBQSxDQUFRLElBQUksQ0FBQyxTQUFMLENBQWUsSUFBZixDQUFSLEVBRk87SUFBQSxDQURUO0FBQUEsSUFJQSxLQUFBLEVBQVMsS0FKVDtHQURGLENBTkEsQ0FEZ0I7QUFBQSxDQXREbEIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibG9nID0ge1xuICBkZWJ1ZzogZmFsc2VcblxuICBpbmZvOiAoYXJncy4uLikgLT5cbiAgICBpZiBsb2cuZGVidWdcbiAgICAgIHdpbmRvdy5jb25zb2xlPy5sb2coYXJncylcbiAgICByZXR1cm5cblxuICBlcnJvcjogKGFyZ3MuLi4pIC0+XG4gICAgaWYgbG9nLmRlYnVnXG4gICAgICB3aW5kb3cuY29uc29sZT8uZXJyb3IoYXJncylcbiAgICB0aHJvdyBhcmdzXG59XG5cbm1vZHVsZS5leHBvcnRzID0gbG9nXG4iLCJsb2cgPSByZXF1aXJlICcuL2xvZydcblxuIyBhcnJheU9mKGNsaWVudCAtPiB2b2lkKVxuTXluYS5yZWFkeUhhbmRsZXJzID0gW11cblxuIyAoY2xpZW50IC0+IHZvaWQpIC0+IHZvaWRcbk15bmEucmVhZHkgPSAoY2FsbGJhY2spIC0+XG4gIGlmIE15bmEuY2xpZW50IHRoZW4gY2FsbGJhY2soTXluYS5jbGllbnQpIGVsc2UgTXluYS5yZWFkeUhhbmRsZXJzLnB1c2goY2FsbGJhY2spXG4gIHJldHVyblxuXG4jIGNsaWVudCAtPiB2b2lkXG5NeW5hLnRyaWdnZXJSZWFkeSA9IChjbGllbnQpIC0+XG4gIGZvciBjYWxsYmFjayBpbiBNeW5hLnJlYWR5SGFuZGxlcnNcbiAgICBjYWxsYmFjay5jYWxsKE15bmEsIGNsaWVudClcblxuIyBkZXBsb3ltZW50SnNvbiAtPiB2b2lkXG5NeW5hLmluaXQgPSAob3B0aW9ucykgLT5cbiAgbG9nLmRlYnVnKFwiTXluYS5pbml0XCIsIG9wdGlvbnMpXG5cbiAgaWYgTXluYS5wcmV2aWV3KCkgJiYgb3B0aW9ucy5sYXRlc3RcbiAgICBNeW5hLmluaXRSZW1vdGUgeyB1cmw6IG9wdGlvbnMubGF0ZXN0IH1cbiAgZWxzZVxuICAgIE15bmEuaW5pdExvY2FsKG9wdGlvbnMpXG5cbiAgcmV0dXJuXG5cbiMgZGVwbG95bWVudEpzb24gLT4gdm9pZFxuTXluYS5pbml0TG9jYWwgPSAob3B0aW9ucykgLT5cbiAgbG9nLmRlYnVnKFwiTXluYS5pbml0XCIsIG9wdGlvbnMpXG5cbiAgYXBpS2V5ICAgICAgICAgICAgICAgPSBvcHRpb25zLmFwaUtleSAgPyBsb2cuZXJyb3IoXCJNeW5hLmluaXRcIiwgXCJubyBhcGlLZXkgaW4gb3B0aW9uc1wiLCBvcHRpb25zKVxuICBhcGlSb290ICAgICAgICAgICAgICA9IG9wdGlvbnMuYXBpUm9vdCA/IFwiLy9hcGkubXluYXdlYi5jb21cIlxuICBleHBlcmltZW50cyAgICAgICAgICA9IGZvciBleHB0IGluIChvcHRpb25zLmV4cGVyaW1lbnRzID8gW10pIHRoZW4gbmV3IE15bmEuRXhwZXJpbWVudChleHB0KVxuICBNeW5hLmNsaWVudCAgICAgICAgICA9IG5ldyBNeW5hLkNsaWVudCh7IGFwaUtleSwgYXBpUm9vdCwgZXhwZXJpbWVudHMgfSlcbiAgTXluYS5yZWNvcmRlciAgICAgICAgPSBuZXcgTXluYS5SZWNvcmRlcihNeW5hLmNsaWVudClcbiAgTXluYS5iaW5kZXIgICAgICAgICAgPSBuZXcgTXluYS5CaW5kZXIoTXluYS5jbGllbnQpXG4gIE15bmEuZ29vZ2xlQW5hbHl0aWNzID0gbmV3IE15bmEuR29vZ2xlQW5hbHl0aWNzKE15bmEuY2xpZW50KVxuXG4gIGlmIE15bmEucHJldmlldygpXG4gICAgTXluYS5pbnNwZWN0b3IgPSBuZXcgTXluYS5JbnNwZWN0b3IoTXluYS5jbGllbnQsIE15bmEuYmluZGVyKVxuICAgIE15bmEuJCAtPlxuICAgICAgTXluYS50cmlnZ2VyUmVhZHkoTXluYS5jbGllbnQpXG4gICAgICBNeW5hLmluc3BlY3Rvci5pbml0KClcbiAgICAgIE15bmEuYmluZGVyLmluaXQoKVxuICBlbHNlXG4gICAgTXluYS4kIC0+XG4gICAgICBNeW5hLnRyaWdnZXJSZWFkeShNeW5hLmNsaWVudClcbiAgICAgIE15bmEucmVjb3JkZXIuaW5pdCgpXG4gICAgICBNeW5hLmdvb2dsZUFuYWx5dGljcy5pbml0KClcbiAgICAgIE15bmEuYmluZGVyLmluaXQoKVxuXG4gIE15bmEuY2xpZW50XG5cbiMgeyB1cmw6IHN0cmluZywgc3VjY2VzczogZGVwbG95bWVudEpzb24gLT4gdm9pZCwgZXJyb3I6ID8/PyAtPiB2b2lkIH0gLT4gdm9pZFxuTXluYS5pbml0UmVtb3RlID0gKG9wdGlvbnMpIC0+XG4gIGxvZy5kZWJ1ZyhcIk15bmEuaW5pdFJlbW90ZVwiLCBvcHRpb25zKVxuXG4gIHVybCAgICAgID0gb3B0aW9ucy51cmwgICAgID8gbG9nLmVycm9yKFwiTXluYS5DbGllbnQuaW5pdFJlbW90ZVwiLCBcIm5vIHVybCBzcGVjaWZpZWQgaW4gb3B0aW9uc1wiLCBvcHRpb25zKVxuICBzdWNjZXNzICA9IG9wdGlvbnMuc3VjY2VzcyA/ICgtPilcbiAgZXJyb3IgICAgPSBvcHRpb25zLmVycm9yICAgPyAoLT4pXG5cbiAgTXluYS5qc29ucC5yZXF1ZXN0XG4gICAgdXJsOiAgICAgdXJsXG4gICAgc3VjY2VzczogKGpzb24pIC0+XG4gICAgICBsb2cuZGVidWcoXCJNeW5hLmluaXRSZW1vdGVcIiwgXCJyZXNwb25zZVwiLCBqc29uKVxuICAgICAgc3VjY2VzcyhNeW5hLmluaXRMb2NhbChqc29uKSlcbiAgICBlcnJvcjogICBlcnJvclxuXG4gIHJldHVyblxuIl19
