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
  var client, error, exn, success, _ref, _ref1;
  log.debug("Myna.init", options);
  if (Myna.preview() && options.latest) {
    Myna.initRemote({
      url: options.latest
    });
  } else {
    success = (_ref = options.success) != null ? _ref : (function() {});
    error = (_ref1 = options.error) != null ? _ref1 : (function() {});
    try {
      client = Myna.initLocal(options);
      success(client);
    } catch (_error) {
      exn = _error;
      error(exn);
    }
  }
};

Myna.initLocal = function(options) {
  var apiKey, apiRoot, experiments, expt, typename, _ref, _ref1;
  log.debug("Myna.init", options);
  typename = options.typename;
  if (typename !== "deployment") {
    log.error("Myna.Client.initLocal", "Myna needs a deployment to initialise. The given JSON is not a deployment.\nIt has a typename of \"" + typename + "\". Check you are initialising Myna with the\ncorrect UUID if you are calling initRemote", options);
  }
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
  Myna.googleAnalytics = new Myna.GoogleAnalytics(Myna.client);
  if (Myna.preview()) {
    if (Myna.$) {
      Myna.inspector = new Myna.Inspector(Myna.client);
      Myna.$(function() {
        Myna.triggerReady(Myna.client);
        return Myna.inspector.init();
      });
    }
  } else {
    Myna.triggerReady(Myna.client);
    Myna.recorder.init();
    Myna.googleAnalytics.init();
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
      var client, exn;
      log.debug("Myna.initRemote", "response", json);
      try {
        client = Myna.initLocal(json);
        return success(client);
      } catch (_error) {
        exn = _error;
        return error(exn);
      }
    },
    error: error
  });
};


},{"./log":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZGF2ZS9kZXYvcHJvamVjdHMvbXluYS1qcy9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9kYXZlL2Rldi9wcm9qZWN0cy9teW5hLWpzL3NyYy9hcHAvbG9nLmNvZmZlZSIsIi9Vc2Vycy9kYXZlL2Rldi9wcm9qZWN0cy9teW5hLWpzL3NyYy9hcHAvbXluYS1qcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBLEdBQUE7RUFBQSxrQkFBQTs7QUFBQSxHQUFBLEdBQU07QUFBQSxFQUNKLEtBQUEsRUFBTyxLQURIO0FBQUEsRUFHSixJQUFBLEVBQU0sU0FBQSxHQUFBO0FBQ0osUUFBQSxVQUFBO0FBQUEsSUFESyw4REFDTCxDQUFBO0FBQUEsSUFBQSxJQUFHLEdBQUcsQ0FBQyxLQUFQOztZQUNnQixDQUFFLEdBQWhCLENBQW9CLElBQXBCO09BREY7S0FESTtFQUFBLENBSEY7QUFBQSxFQVFKLEtBQUEsRUFBTyxTQUFBLEdBQUE7QUFDTCxRQUFBLFVBQUE7QUFBQSxJQURNLDhEQUNOLENBQUE7QUFBQSxJQUFBLElBQUcsR0FBRyxDQUFDLEtBQVA7O1lBQ2dCLENBQUUsS0FBaEIsQ0FBc0IsSUFBdEI7T0FERjtLQUFBO0FBRUEsVUFBTSxJQUFOLENBSEs7RUFBQSxDQVJIO0NBQU4sQ0FBQTs7QUFBQSxNQWNNLENBQUMsT0FBUCxHQUFpQixHQWRqQixDQUFBOzs7O0FDQUEsSUFBQSxHQUFBOztBQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsT0FBUixDQUFOLENBQUE7O0FBQUEsSUFHSSxDQUFDLGFBQUwsR0FBcUIsRUFIckIsQ0FBQTs7QUFBQSxJQU1JLENBQUMsS0FBTCxHQUFhLFNBQUMsUUFBRCxHQUFBO0FBQ1gsRUFBQSxJQUFHLElBQUksQ0FBQyxNQUFS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QyxJQUF6QyxDQUFBLENBQUE7QUFDQTtBQUNFLFFBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFMLENBQWUsSUFBZixDQUFULENBQUE7ZUFDQSxPQUFBLENBQVEsTUFBUixFQUZGO09BQUEsY0FBQTtBQUlFLFFBREksWUFDSixDQUFBO2VBQUEsS0FBQSxDQUFNLEdBQU4sRUFKRjtPQUZPO0lBQUEsQ0FEVDtBQUFBLElBUUEsS0FBQSxFQUFTLEtBUlQ7R0FERixDQU5BLENBRGdCO0FBQUEsQ0F2RWxCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImxvZyA9IHtcbiAgZGVidWc6IGZhbHNlXG5cbiAgaW5mbzogKGFyZ3MuLi4pIC0+XG4gICAgaWYgbG9nLmRlYnVnXG4gICAgICB3aW5kb3cuY29uc29sZT8ubG9nKGFyZ3MpXG4gICAgcmV0dXJuXG5cbiAgZXJyb3I6IChhcmdzLi4uKSAtPlxuICAgIGlmIGxvZy5kZWJ1Z1xuICAgICAgd2luZG93LmNvbnNvbGU/LmVycm9yKGFyZ3MpXG4gICAgdGhyb3cgYXJnc1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxvZ1xuIiwibG9nID0gcmVxdWlyZSAnLi9sb2cnXG5cbiMgYXJyYXlPZihjbGllbnQgLT4gdm9pZClcbk15bmEucmVhZHlIYW5kbGVycyA9IFtdXG5cbiMgKGNsaWVudCAtPiB2b2lkKSAtPiB2b2lkXG5NeW5hLnJlYWR5ID0gKGNhbGxiYWNrKSAtPlxuICBpZiBNeW5hLmNsaWVudCB0aGVuIGNhbGxiYWNrKE15bmEuY2xpZW50KSBlbHNlIE15bmEucmVhZHlIYW5kbGVycy5wdXNoKGNhbGxiYWNrKVxuICByZXR1cm5cblxuIyBjbGllbnQgLT4gdm9pZFxuTXluYS50cmlnZ2VyUmVhZHkgPSAoY2xpZW50KSAtPlxuICBmb3IgY2FsbGJhY2sgaW4gTXluYS5yZWFkeUhhbmRsZXJzXG4gICAgY2FsbGJhY2suY2FsbChNeW5hLCBjbGllbnQpXG5cbiMgZGVwbG95bWVudEpzb24gLT4gdm9pZFxuTXluYS5pbml0ID0gKG9wdGlvbnMpIC0+XG4gIGxvZy5kZWJ1ZyhcIk15bmEuaW5pdFwiLCBvcHRpb25zKVxuXG4gIGlmIE15bmEucHJldmlldygpICYmIG9wdGlvbnMubGF0ZXN0XG4gICAgTXluYS5pbml0UmVtb3RlIHsgdXJsOiBvcHRpb25zLmxhdGVzdCB9XG4gIGVsc2VcbiAgICBzdWNjZXNzID0gb3B0aW9ucy5zdWNjZXNzID8gKC0+KVxuICAgIGVycm9yICAgPSBvcHRpb25zLmVycm9yICAgPyAoLT4pXG4gICAgdHJ5XG4gICAgICBjbGllbnQgPSBNeW5hLmluaXRMb2NhbChvcHRpb25zKVxuICAgICAgc3VjY2VzcyhjbGllbnQpXG4gICAgY2F0Y2ggZXhuXG4gICAgICBlcnJvcihleG4pXG5cbiAgcmV0dXJuXG5cbiMgZGVwbG95bWVudEpzb24gLT4gTXluYS5DbGllbnRcbk15bmEuaW5pdExvY2FsID0gKG9wdGlvbnMpIC0+XG4gIGxvZy5kZWJ1ZyhcIk15bmEuaW5pdFwiLCBvcHRpb25zKVxuXG4gIHR5cGVuYW1lID0gb3B0aW9ucy50eXBlbmFtZVxuICB1bmxlc3MgdHlwZW5hbWUgPT0gXCJkZXBsb3ltZW50XCJcbiAgICBsb2cuZXJyb3IoXG4gICAgICBcIk15bmEuQ2xpZW50LmluaXRMb2NhbFwiXG4gICAgICBcIlwiXCJcbiAgICAgIE15bmEgbmVlZHMgYSBkZXBsb3ltZW50IHRvIGluaXRpYWxpc2UuIFRoZSBnaXZlbiBKU09OIGlzIG5vdCBhIGRlcGxveW1lbnQuXG4gICAgICBJdCBoYXMgYSB0eXBlbmFtZSBvZiBcIiN7dHlwZW5hbWV9XCIuIENoZWNrIHlvdSBhcmUgaW5pdGlhbGlzaW5nIE15bmEgd2l0aCB0aGVcbiAgICAgIGNvcnJlY3QgVVVJRCBpZiB5b3UgYXJlIGNhbGxpbmcgaW5pdFJlbW90ZVxuICAgICAgXCJcIlwiXG4gICAgICBvcHRpb25zXG4gICAgKVxuXG4gIGFwaUtleSAgICAgICAgICAgICAgID0gb3B0aW9ucy5hcGlLZXkgID8gbG9nLmVycm9yKFwiTXluYS5pbml0XCIsIFwibm8gYXBpS2V5IGluIG9wdGlvbnNcIiwgb3B0aW9ucylcbiAgYXBpUm9vdCAgICAgICAgICAgICAgPSBvcHRpb25zLmFwaVJvb3QgPyBcIi8vYXBpLm15bmF3ZWIuY29tXCJcbiAgZXhwZXJpbWVudHMgICAgICAgICAgPSBmb3IgZXhwdCBpbiAob3B0aW9ucy5leHBlcmltZW50cyA/IFtdKSB0aGVuIG5ldyBNeW5hLkV4cGVyaW1lbnQoZXhwdClcbiAgTXluYS5jbGllbnQgICAgICAgICAgPSBuZXcgTXluYS5DbGllbnQoeyBhcGlLZXksIGFwaVJvb3QsIGV4cGVyaW1lbnRzIH0pXG4gIE15bmEucmVjb3JkZXIgICAgICAgID0gbmV3IE15bmEuUmVjb3JkZXIoTXluYS5jbGllbnQpXG4gIE15bmEuZ29vZ2xlQW5hbHl0aWNzID0gbmV3IE15bmEuR29vZ2xlQW5hbHl0aWNzKE15bmEuY2xpZW50KVxuXG4gIGlmIE15bmEucHJldmlldygpXG4gICAgIyBXZSBjYW4gb25seSBydW4gdGhlIGluc3BlY3RvciBpZiB3ZSBoYXZlIGpRdWVyeS5cbiAgICAjIE90aGVyd2lzZSB3ZSBoYXZlIHRvIHNpbGVudGx5IGZhaWwuXG4gICAgaWYgTXluYS4kXG4gICAgICBNeW5hLmluc3BlY3RvciA9IG5ldyBNeW5hLkluc3BlY3RvcihNeW5hLmNsaWVudClcbiAgICAgIE15bmEuJCAtPlxuICAgICAgICBNeW5hLnRyaWdnZXJSZWFkeShNeW5hLmNsaWVudClcbiAgICAgICAgTXluYS5pbnNwZWN0b3IuaW5pdCgpXG4gIGVsc2VcbiAgICBNeW5hLnRyaWdnZXJSZWFkeShNeW5hLmNsaWVudClcbiAgICBNeW5hLnJlY29yZGVyLmluaXQoKVxuICAgIE15bmEuZ29vZ2xlQW5hbHl0aWNzLmluaXQoKVxuXG4gIE15bmEuY2xpZW50XG5cbiMgeyB1cmw6IHN0cmluZywgc3VjY2VzczogZGVwbG95bWVudEpzb24gLT4gdm9pZCwgZXJyb3I6ID8/PyAtPiB2b2lkIH0gLT4gdm9pZFxuTXluYS5pbml0UmVtb3RlID0gKG9wdGlvbnMpIC0+XG4gIGxvZy5kZWJ1ZyhcIk15bmEuaW5pdFJlbW90ZVwiLCBvcHRpb25zKVxuXG4gIHVybCAgICAgID0gb3B0aW9ucy51cmwgICAgID8gbG9nLmVycm9yKFwiTXluYS5DbGllbnQuaW5pdFJlbW90ZVwiLCBcIm5vIHVybCBzcGVjaWZpZWQgaW4gb3B0aW9uc1wiLCBvcHRpb25zKVxuICBzdWNjZXNzICA9IG9wdGlvbnMuc3VjY2VzcyA/ICgtPilcbiAgZXJyb3IgICAgPSBvcHRpb25zLmVycm9yICAgPyAoLT4pXG5cbiAgTXluYS5qc29ucC5yZXF1ZXN0XG4gICAgdXJsOiAgICAgdXJsXG4gICAgc3VjY2VzczogKGpzb24pIC0+XG4gICAgICBsb2cuZGVidWcoXCJNeW5hLmluaXRSZW1vdGVcIiwgXCJyZXNwb25zZVwiLCBqc29uKVxuICAgICAgdHJ5XG4gICAgICAgIGNsaWVudCA9IE15bmEuaW5pdExvY2FsKGpzb24pXG4gICAgICAgIHN1Y2Nlc3MoY2xpZW50KVxuICAgICAgY2F0Y2ggZXhuXG4gICAgICAgIGVycm9yKGV4bilcbiAgICBlcnJvcjogICBlcnJvclxuXG4gIHJldHVyblxuIl19
