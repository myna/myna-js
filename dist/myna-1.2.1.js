/*! myna - v1.2.1 - 2013-04-18\n* http://mynaweb.com/
* Copyright (c) 2013 Noel Welsh; Licensed BSD 2-Clause *//*
 Myna Javascript Client
 Copyright Untyped 2012
*/
window.Myna = window.Myna != null ? window.Myna : {};

var Log, LogLevel;

LogLevel = {
  SILENT: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4
};

Log = (function() {
  function Log(loglevel) {
    this.loglevel = loglevel;
  }

  Log.prototype.log = function(level, message) {
    if (window.console && this.loglevel >= level) {
      return window.console.log(message);
    }
  };

  return Log;

})();

window.Myna.LogLevel = LogLevel;

var extend;

extend = function(dest, src) {
  var key, value;

  for (key in src) {
    value = src[key];
    if (!dest[key]) {
      dest[key] = value;
    }
  }
  return dest;
};

var Config;

Config = (function() {
  function Config(uuid) {
    var protocol;

    protocol = 'https:' === document.location.protocol ? 'https' : 'http';
    this.cookieLifespan = 365;
    this.cookieName = "myna" + uuid;
    this.timeout = 1200;
    this.baseurl = "" + protocol + "://api.mynaweb.com";
    this.loglevel = LogLevel.ERROR;
    this.rewardSuccess = function(ok) {
      return void 0;
    };
    this.error = function(problem) {
      return void 0;
    };
  }

  Config.prototype.extend = function(options) {
    return extend(extend({}, options), this);
  };

  return Config;

})();

var Cookie;

Cookie = {
  create: function(name, value, days) {
    var date, expires;

    expires = days ? (date = new Date(), date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)), "; expires=" + date.toGMTString()) : "";
    return document.cookie = "" + name + "=" + (value + expires) + "; path=/";
  },
  read: function(name) {
    var cookie, cookieValue, cookies, found, isNameEQCookie, nameEQ, _i, _len;

    nameEQ = name + "=";
    isNameEQCookie = function(cookie) {
      var i;

      i = cookie.indexOf(nameEQ);
      return i >= 0 && cookie.substring(0, i).match('^\\s*$');
    };
    cookieValue = function(cookie) {
      var i;

      i = cookie.indexOf(nameEQ);
      return cookie.substring(i + nameEQ.length, cookie.length);
    };
    cookies = document.cookie.split(';');
    for (_i = 0, _len = cookies.length; _i < _len; _i++) {
      cookie = cookies[_i];
      if (isNameEQCookie(cookie)) {
        found = cookieValue(cookie);
      }
    }
    return found;
  },
  erase: function(name) {
    return Cookie.create(name, "", -1);
  }
};

var JsonP;

window.Myna.callbacks = [];

JsonP = {
  callbackCounter: 0,
  removeCallback: function(callbackName) {
    var e;

    if (this.readyState && this.readyState !== "complete" && this.readyState !== "loaded") {

    } else {
      this.onload = null;
      try {
        return this.parentNode.removeChild(this);
      } catch (_error) {
        e = _error;
      } finally {
        window.Myna.callbacks[callbackName] = null;
      }
    }
  },
  doJsonP: function(options) {
    var callbackName, elem, key, returned, url, value, _ref;

    returned = false;
    callbackName = "callback" + (JsonP.callbackCounter++);
    window.Myna.callbacks[callbackName] = function(args) {};
    window.Myna.callbacks[callbackName] = function(response) {
      if (!returned) {
        returned = true;
      }
      switch (response.typename) {
        case "problem":
          return options.error.call(this, response);
        default:
          return options.success.call(this, response);
      }
    };
    url = options.url + "?";
    _ref = options.data;
    for (key in _ref) {
      value = _ref[key];
      url += "" + key + "=" + value + "&";
    }
    url += "callback=window.Myna.callbacks." + callbackName;
    if (options.timeout > 0) {
      window.setTimeout(function() {
        if (!returned) {
          returned = true;
          JsonP.removeCallback.call(elem, callbackName);
          return options.error({
            typename: 'problem',
            subtype: 500,
            messages: [
              {
                typename: "timeout",
                item: "The server took longer than " + options.timeout + " ms to reply"
              }
            ]
          });
        }
      }, options.timeout);
    }
    elem = document.createElement("script");
    elem.setAttribute("type", "text/javascript");
    elem.setAttribute("async", "true");
    elem.onload = elem.onreadystatechange = function() {
      return JsonP.removeCallback.call(elem, callbackName);
    };
    elem.setAttribute("src", url);
    return document.getElementsByTagName("head")[0].appendChild(elem);
  }
};

var Experiment,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Experiment = (function() {
  function Experiment(uuid, options) {
    this.uuid = uuid;
    if (options == null) {
      options = {};
    }
    this.recallOrSuggest = __bind(this.recallOrSuggest, this);
    this.forget = __bind(this.forget, this);
    this.recall = __bind(this.recall, this);
    this.suggest = __bind(this.suggest, this);
    this.config = new Config(this.uuid).extend(options);
    this.logger = new Log(this.config.loglevel);
  }

  Experiment.prototype.suggest = function(success, error) {
    var doOnSuggest, errorWrapper, options, successWrapper,
      _this = this;

    if (error == null) {
      error = this.config.error;
    }
    doOnSuggest = function(data) {
      var f, _i, _len, _ref, _results;

      _ref = Myna.onsuggest;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        f = _ref[_i];
        _results.push(f(_this, data));
      }
      return _results;
    };
    successWrapper = function(data) {
      var suggestion;

      _this.logger.log(LogLevel.DEBUG, "Experiment.suggest successWrapper called");
      _this.logger.log(LogLevel.DEBUG, data);
      if (data.typename === "suggestion") {
        _this.logger.log(LogLevel.INFO, "Myna suggested " + data.choice);
        _this.logger.log(LogLevel.DEBUG, "Response token is " + data.token);
        suggestion = new Suggestion(_this, data.choice, data.token);
        doOnSuggest(suggestion);
        if (success) {
          return success(suggestion);
        } else {
          return _this.logger.log(LogLevel.WARN, "You should pass a success function to Experiment.suggest. See the docs for details.");
        }
      } else if (data.typename === "problem") {
        _this.logger.log(LogLevel.ERROR, "Experiment.suggest returned an API error: " + data.subtype + " " + data.messages);
        return errorWrapper(data);
      } else {
        _this.logger.log(LogLevel.ERROR, "Experiment.suggest did something unexpected");
        _this.logger.log(LogLevel.ERROR, data);
        return errorWrapper({
          typename: 'problem',
          subtype: 400,
          messages: [
            {
              typename: "unexpected",
              item: data
            }
          ]
        });
      }
    };
    errorWrapper = function(data) {
      _this.logger.log(LogLevel.ERROR, "Experiment.suggest errorWrapper called");
      _this.logger.log(LogLevel.ERROR, data);
      doOnSuggest(data);
      if (error) {
        return error(data);
      }
    };
    options = {
      url: this.config.baseurl + ("/v1/experiment/" + this.uuid + "/suggest"),
      data: {},
      success: successWrapper,
      error: errorWrapper
    };
    return JsonP.doJsonP(extend(options, this.config));
  };

  Experiment.prototype.recall = function() {
    var choice, cookie, i, token;

    cookie = Cookie.read(this.config.cookieName);
    if (cookie) {
      i = cookie.indexOf(':');
      if (i >= 0) {
        token = cookie.substring(0, i);
        choice = cookie.substring(i + 1, cookie.length);
        return new Suggestion(this, choice, token);
      } else {
        return void 0;
      }
    } else {
      return void 0;
    }
  };

  Experiment.prototype.forget = function() {
    return Cookie.erase(this.config.cookieName);
  };

  Experiment.prototype.recallOrSuggest = function(success, error) {
    var recalled;

    if (error == null) {
      error = this.config.error;
    }
    recalled = this.recall();
    if (recalled) {
      return success(recalled);
    } else {
      return this.suggest(success, error);
    }
  };

  return Experiment;

})();

window.Myna.Experiment = Experiment;

var Suggestion;

Suggestion = (function() {
  function Suggestion(experiment, choice, token) {
    this.experiment = experiment;
    this.choice = choice;
    this.token = token;
  }

  Suggestion.prototype.reward = function(amount, success, error) {
    var data, doOnReward, errorWrapper, options, successWrapper,
      _this = this;

    if (amount == null) {
      amount = 1.0;
    }
    if (success == null) {
      success = this.experiment.config.rewardSuccess;
    }
    if (error == null) {
      error = this.experiment.config.error;
    }
    doOnReward = function(result) {
      var f, _i, _len, _ref, _results;

      _ref = Myna.onreward;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        f = _ref[_i];
        _results.push(f(_this, amount, result));
      }
      return _results;
    };
    data = {
      token: this.token,
      amount: amount
    };
    successWrapper = function(data) {
      doOnReward(data);
      return success(data);
    };
    errorWrapper = function(data) {
      _this.experiment.logger.log(LogLevel.ERROR, "Suggestion.reward errorWrapper called");
      _this.experiment.logger.log(LogLevel.ERROR, data);
      doOnReward(data);
      if (error) {
        return error(data);
      }
    };
    options = {
      url: this.experiment.config.baseurl + ("/v1/experiment/" + this.experiment.uuid + "/reward"),
      data: data,
      success: successWrapper,
      error: errorWrapper
    };
    return JsonP.doJsonP(extend(options, this.experiment.config));
  };

  Suggestion.prototype.remember = function() {
    return Cookie.create(this.experiment.config.cookieName, "" + this.token + ":" + this.choice, this.experiment.config.cookieLifespan);
  };

  Suggestion.prototype.rewardOnClick = function(elt, location, amount) {
    var handler, redirect,
      _this = this;

    if (amount == null) {
      amount = 1.0;
    }
    redirect = function() {
      return window.location = location;
    };
    handler = function(evt) {
      if (!evt) {
        evt = window.event;
      }
      if (evt.stopPropagation) {
        evt.stopPropagation();
      }
      if (evt.returnValue) {
        evt.returnValue = false;
      }
      _this.reward(amount, redirect, redirect);
      return false;
    };
    return elt.onclick = handler;
  };

  return Suggestion;

})();

var f, _i, _len, _ref,
  __slice = [].slice;

extend(window.Myna, {
  onload: [],
  onsuggest: [],
  onreward: []
});

window.Myna.onload.push = function() {
  var elts, f, _i, _len, _results;

  elts = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  _results = [];
  for (_i = 0, _len = elts.length; _i < _len; _i++) {
    f = elts[_i];
    _results.push(f());
  }
  return _results;
};

_ref = window.Myna.onload;
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  f = _ref[_i];
  f();
}
