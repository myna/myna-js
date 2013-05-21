/*! myna - v2.0.0 - 2013-05-21 - http://mynaweb.com/
* Copyright (c) 2013 Noel Welsh; Licensed BSD 2-Clause */(function() {
  var _ref,
    __slice = [].slice;

  if ((_ref = window.Myna) == null) {
    window.Myna = {};
  }

  Myna.debug = true;

  Myna.log = function() {
    var args, item, _ref1;

    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (Myna.debug) {
      if ((_ref1 = window.console) != null) {
        _ref1.log((function() {
          var _i, _len, _results;

          _results = [];
          for (_i = 0, _len = args.length; _i < _len; _i++) {
            item = args[_i];
            _results.push(JSON.stringify(item));
          }
          return _results;
        })());
      }
    }
  };

  Myna.error = function() {
    var args;

    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    throw args;
  };

  Myna.extend = function() {
    var des, key, sources, src, value, _i, _len;

    des = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = sources.length; _i < _len; _i++) {
      src = sources[_i];
      for (key in src) {
        value = src[key];
        if (!des[key]) {
          des[key] = value;
        }
      }
    }
    return des;
  };

  Myna.dateToString = function(date) {
    var day, hour, milli, minute, month, pad, second, year;

    pad = function(num, len) {
      var str;

      str = "" + num;
      while (str.length < len) {
        str = '0' + str;
      }
      return str;
    };
    year = pad(date.getUTCFullYear(), 4);
    month = pad(date.getUTCMonth() + 1, 2);
    day = pad(date.getUTCDate(), 2);
    hour = pad(date.getUTCHours(), 2);
    minute = pad(date.getUTCMinutes(), 2);
    second = pad(date.getUTCSeconds(), 2);
    milli = pad(date.getUTCMilliseconds(), 2);
    return "" + year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second + "." + milli + "Z";
  };

}).call(this);

(function() {
  Myna.jsonp = {
    callbacks: {},
    counter: 0,
    request: function(options) {
      var callbackName, error, key, onComplete, onTimeout, returned, scriptElem, success, timeout, timer, url, urlRoot, value, _ref, _ref1, _ref2, _ref3, _ref4;

      if (options == null) {
        options = {};
      }
      urlRoot = (function() {
        if ((_ref = options.url) != null) {
          return _ref;
        } else {
          throw "no URL specified";
        }
      })();
      success = (_ref1 = options.success) != null ? _ref1 : (function() {});
      error = (_ref2 = options.error) != null ? _ref2 : (function() {});
      timeout = (_ref3 = options.timeout) != null ? _ref3 : 0;
      callbackName = "callback" + (Myna.jsonp.counter++);
      returned = false;
      url = "" + urlRoot + "?";
      _ref4 = options.params;
      for (key in _ref4) {
        value = _ref4[key];
        url += "" + key + "=" + value + "&";
      }
      url += "callback=Myna.jsonp.callbacks." + callbackName;
      Myna.log("Myna.jsonp.request", url, success, error, timeout);
      scriptElem = document.createElement("script");
      scriptElem.setAttribute("type", "text/javascript");
      scriptElem.setAttribute("async", "true");
      scriptElem.setAttribute("src", url);
      scriptElem.setAttribute("class", "myna-jsonp");
      scriptElem.setAttribute("data-callback", callbackName);
      scriptElem.onload = scriptElem.onreadystatechange = function() {
        return Myna.jsonp.remove(callbackName, scriptElem);
      };
      onTimeout = function() {
        if (returned) {
          return Myna.log("Myna.jsonp.request.onTimeout", callbackName, timeout, "already returned");
        } else {
          returned = true;
          Myna.log("Myna.jsonp.request.onTimeout", callbackName, timeout);
          Myna.jsonp.remove(callbackName, scriptElem);
          return error({
            typename: 'problem',
            subtype: 500,
            messages: [
              {
                typename: 'timeout',
                message: 'request timed out after #{timeout}ms',
                callback: callbackName,
                timeout: timeout
              }
            ]
          });
        }
      };
      if (timeout > 0) {
        timer = window.setTimeout(onTimeout, timeout);
      } else {
        timer = null;
      }
      onComplete = function(response) {
        if (returned) {
          return Myna.log("Myna.jsonp.request.onComplete", callbackName, "already returned");
        } else {
          returned = true;
          Myna.log("Myna.jsonp.request.onComplete", callbackName, response.typename, response.typename === "problem", response);
          window.clearTimeout(timer);
          Myna.jsonp.remove(callbackName, scriptElem);
          if (response.typename === "problem") {
            return error(response);
          } else {
            return success(response);
          }
        }
      };
      Myna.jsonp.callbacks[callbackName] = onComplete;
      document.getElementsByTagName("head")[0].appendChild(scriptElem);
    },
    remove: function(callbackName, scriptElem) {
      var readyState;

      if (callbackName == null) {
        callbackName = null;
      }
      if (scriptElem == null) {
        scriptElem = null;
      }
      readyState = scriptElem != null ? scriptElem.readyState : void 0;
      if (!(readyState && readyState !== "complete" && readyState !== "loaded")) {
        try {
          if (scriptElem) {
            scriptElem.onload = null;
            scriptElem.parentNode.removeChild(scriptElem);
          }
        } finally {
          if (callbackName) {
            delete Myna.jsonp.callbacks[callbackName];
          }
        }
      }
    }
  };

}).call(this);

(function() {
  var Field, Nil, Path, Root, nil,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Path = (function() {
    function Path(next) {
      if (next == null) {
        next = null;
      }
      this.next = next;
    }

    return Path;

  })();

  Root = (function(_super) {
    __extends(Root, _super);

    function Root(next) {
      this.set = __bind(this.set, this);
      this.get = __bind(this.get, this);
      this.path = __bind(this.path, this);      Root.__super__.constructor.call(this, next);
    }

    Root.prototype.path = function() {
      return this.next.path().substring(1);
    };

    Root.prototype.get = function(data) {
      return this.next.get(data);
    };

    Root.prototype.set = function(data, value) {
      return this.next.set(data, value);
    };

    return Root;

  })(Path);

  Field = (function(_super) {
    __extends(Field, _super);

    function Field(next, name) {
      this.set = __bind(this.set, this);
      this.get = __bind(this.get, this);
      this.path = __bind(this.path, this);      Field.__super__.constructor.call(this, next);
      this.name = name;
    }

    Field.prototype.path = function() {
      return "." + this.name + (this.next.path());
    };

    Field.prototype.get = function(data) {
      return this.next.get(data != null ? data[this.name] : void 0);
    };

    Field.prototype.set = function(data, value) {
      var ans, k, v;

      ans = {};
      for (k in data) {
        v = data[k];
        ans[k] = v;
      }
      ans[this.name] = this.next.set(ans[this.name], value);
      return ans;
    };

    return Field;

  })(Path);

  Nil = (function(_super) {
    __extends(Nil, _super);

    function Nil() {
      Nil.__super__.constructor.call(this, null);
    }

    Nil.prototype.path = function() {
      return "";
    };

    Nil.prototype.get = function(data) {
      return data;
    };

    Nil.prototype.set = function(data, value) {
      return value;
    };

    return Nil;

  })(Path);

  nil = new Nil();

  Myna.Settings = (function() {
    function Settings(data) {
      if (data == null) {
        data = {};
      }
      this.toJson = __bind(this.toJson, this);
      this.parse = __bind(this.parse, this);
      this.set = __bind(this.set, this);
      this.get = __bind(this.get, this);
      this.data = {};
      this.set(data);
    }

    Settings.prototype.get = function(path, orElse) {
      var ans, _ref;

      if (orElse == null) {
        orElse = null;
      }
      ans = (_ref = this.parse(path).get(this.data)) != null ? _ref : orElse;
      Myna.log("Myna.Settings.get", path, ans);
      return ans;
    };

    Settings.prototype.set = function() {
      var key, value, _ref;

      switch (arguments.length) {
        case 2:
          key = arguments[0];
          value = arguments[1];
          Myna.log("Myna.Settings.set", key, value);
          this.data = this.parse(key).set(this.data, value);
          break;
        case 1:
          _ref = arguments[0];
          for (key in _ref) {
            value = _ref[key];
            Myna.log("Myna.Settings.set", key, value);
            this.data = this.parse(key).set(this.data, value);
          }
          break;
        default:
          throw ["wrong number of arguments", arguments];
      }
      return this;
    };

    Settings.prototype.parse = function(path) {
      var memo, name, _i, _ref;

      memo = nil;
      _ref = path.split(".");
      for (_i = _ref.length - 1; _i >= 0; _i += -1) {
        name = _ref[_i];
        memo = new Field(memo, name);
      }
      return new Root(memo);
    };

    Settings.prototype.toJson = function() {
      return this.data;
    };

    return Settings;

  })();

  Myna.cache = new Myna.Settings;

}).call(this);

(function() {
  var decodeCookieValue, encodeCookieValue, exn, readCookie, readLocalStorage, removeCookie, removeLocalStorage, writeCookie, writeLocalStorage, _ref,
    _this = this;

  if ((_ref = Myna.cache) == null) {
    Myna.cache = {};
  }

  Myna.cache.localStorageSupported = (function() {
    try {
      localStorage.setItem('modernizer', 'modernizer');
      localStorage.removeItem('modernizer');
      return true;
    } catch (_error) {
      exn = _error;
      return false;
    }
  })();

  Myna.cache.localStorageEnabled = true;

  readLocalStorage = function(key) {
    var str;

    str = window.localStorage.getItem("myna-" + key);
    if (str != null) {
      try {
        return JSON.parse(str);
      } catch (_error) {
        exn = _error;
        return null;
      }
    } else {
      return null;
    }
  };

  writeLocalStorage = function(key, obj) {
    if (obj != null) {
      window.localStorage.setItem("myna-" + key, JSON.stringify(obj));
    } else {
      window.localStorage.removeItem("myna-" + key);
    }
  };

  removeLocalStorage = function(key) {
    window.localStorage.removeItem("myna-" + key);
  };

  encodeCookieValue = function(obj) {
    return encodeURIComponent(JSON.stringify(obj));
  };

  decodeCookieValue = function(str) {
    if (str.indexOf('"') === 0) {
      JSON.parse(str.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\'));
    } else {
      JSON.parse(str);
    }
    return JSON.parse(decodeURIComponent(str.replace(/\+/g, ' ')));
  };

  writeCookie = function(name, obj, days) {
    var date, expires, path, value;

    if (days == null) {
      days = 365;
    }
    value = "myna-" + name + "=" + encodeCookieValue(obj);
    expires = days ? (date = new Date(), date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)), "; expires=" + date.toGMTString()) : "";
    path = "; path=/";
    document.cookie = "" + value + expires + path;
  };

  readCookie = function(name) {
    var cookie, cookieValue, cookies, isNameEQCookie, nameEQ, str, _i, _len;

    nameEQ = "myna-" + name + "=";
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
        if ((str = cookieValue(cookie)) != null) {
          return decodeCookieValue(str);
        }
      }
    }
    return null;
  };

  removeCookie = function(name) {
    writeCookie(name, "", -1);
  };

  Myna.cache.load = function(key) {
    if (Myna.cache.localStorageSupported && Myna.cache.localStorageEnabled) {
      return readLocalStorage(key);
    } else {
      return readCookie(key);
    }
  };

  Myna.cache.save = function(key, value) {
    if (Myna.cache.localStorageSupported && Myna.cache.localStorageEnabled) {
      writeLocalStorage(key, value);
    } else {
      writeCookie(key, value);
    }
  };

  Myna.cache.remove = function(key) {
    if (Myna.cache.localStorageSupported && Myna.cache.localStorageEnabled) {
      removeLocalStorage(key);
    } else {
      removeCookie(key);
    }
  };

}).call(this);

(function() {
  Myna.Variant = (function() {
    function Variant(id, options) {
      var _ref, _ref1;

      this.id = id;
      if (options == null) {
        options = {};
      }
      this.settings = new Myna.Settings((_ref = options.settings) != null ? _ref : {});
      this.weight = (function() {
        if ((_ref1 = options.weight) != null) {
          return _ref1;
        } else {
          throw "no weight provided";
        }
      })();
      this.views = 0;
      this.reward = 0;
    }

    return Variant;

  })();

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  Myna.BaseExperiment = (function() {
    function BaseExperiment(options) {
      var data, id, variant, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;

      if (options == null) {
        options = {};
      }
      this.save = __bind(this.save, this);
      this.load = __bind(this.load, this);
      this.loadAndSave = __bind(this.loadAndSave, this);
      this.enqueueReward = __bind(this.enqueueReward, this);
      this.enqueueView = __bind(this.enqueueView, this);
      this.requeueEvents = __bind(this.requeueEvents, this);
      this.enqueueEvent = __bind(this.enqueueEvent, this);
      this.clearQueuedEvents = __bind(this.clearQueuedEvents, this);
      this.loadQueuedEvents = __bind(this.loadQueuedEvents, this);
      this.clearVariant = __bind(this.clearVariant, this);
      this.saveVariant = __bind(this.saveVariant, this);
      this.loadVariant = __bind(this.loadVariant, this);
      this.clearLastReward = __bind(this.clearLastReward, this);
      this.saveLastReward = __bind(this.saveLastReward, this);
      this.loadLastReward = __bind(this.loadLastReward, this);
      this.clearLastSuggestion = __bind(this.clearLastSuggestion, this);
      this.saveLastSuggestion = __bind(this.saveLastSuggestion, this);
      this.loadLastSuggestion = __bind(this.loadLastSuggestion, this);
      this.callback = __bind(this.callback, this);
      this.randomVariant = __bind(this.randomVariant, this);
      this.totalWeight = __bind(this.totalWeight, this);
      this.record = __bind(this.record, this);
      this.rewardVariant = __bind(this.rewardVariant, this);
      this.reward = __bind(this.reward, this);
      this.view = __bind(this.view, this);
      this.suggest = __bind(this.suggest, this);
      Myna.log("Myna.BaseExperiment.constructor", options);
      this.uuid = (_ref = options.uuid) != null ? _ref : Myna.error("Myna.Experiment.constructor", this.id, "no uuid in options", options);
      this.id = (_ref1 = options.id) != null ? _ref1 : Myna.error("Myna.Experiment.constructor", this.id, "no id in options", options);
      this.apiKey = (_ref2 = options.apiKey) != null ? _ref2 : Myna.error("Myna.Experiment.constructor", this.id, "no apiKey in options", options);
      this.apiRoot = (_ref3 = options.apiRoot) != null ? _ref3 : "//api.mynaweb.com";
      this.callbacks = (_ref4 = options.callbacks) != null ? _ref4 : {};
      this.settings = new Myna.Settings((_ref5 = options.settings) != null ? _ref5 : {});
      this.variants = {};
      _ref7 = (_ref6 = options.variants) != null ? _ref6 : {};
      for (id in _ref7) {
        data = _ref7[id];
        variant = new Myna.Variant(id, data);
        this.variants[id] = variant;
      }
      this.recordSemaphore = 0;
      this.waitingToRecord = [];
    }

    BaseExperiment.prototype.suggest = function(success, error) {
      var ans, exn, variant;

      if (success == null) {
        success = (function() {});
      }
      if (error == null) {
        error = (function() {});
      }
      try {
        Myna.log("Myna.BaseExperiment.suggest", this.id);
        variant = this.randomVariant();
        if (this.callback('beforeSuggest').call(this, variant) === false) {
          return;
        }
        ans = this.view(variant.id, success, error);
        this.callback('afterSuggest').call(this, variant);
        return ans;
      } catch (_error) {
        exn = _error;
        return this.error(exn);
      }
    };

    BaseExperiment.prototype.view = function(variantId, success, error) {
      var ans, exn, variant;

      if (success == null) {
        success = (function() {});
      }
      if (error == null) {
        error = (function() {});
      }
      try {
        Myna.log("Myna.BaseExperiment.view", this.id, variantId);
        variant = this.variants[variantId];
        if (this.callback('beforeView').call(this, variant) === false) {
          return;
        }
        this.saveLastSuggestion(variant);
        this.clearLastReward();
        this.enqueueView(variant);
        ans = success(variant);
        this.callback('afterView').call(this, variant);
        return ans;
      } catch (_error) {
        exn = _error;
        return error(exn);
      }
    };

    BaseExperiment.prototype.reward = function(amount, success, error) {
      var ans, exn, variant;

      if (amount == null) {
        amount = 1.0;
      }
      if (success == null) {
        success = (function() {});
      }
      if (error == null) {
        error = (function() {});
      }
      try {
        Myna.log("Myna.BaseExperiment.reward", this.id, amount);
        variant = this.loadLastSuggestion();
        if (variant != null) {
          if (this.callback('beforeReward').call(this, variant, amount) === false) {
            return;
          }
          ans = this.rewardVariant(variant, amount, success, error);
          return this.callback('afterReward').call(this, variant, amount);
        } else {
          return error();
        }
      } catch (_error) {
        exn = _error;
        return error(exn);
      }
    };

    BaseExperiment.prototype.rewardVariant = function(variant, amount, success, error) {
      var exn, rewarded;

      if (amount == null) {
        amount = 1.0;
      }
      if (success == null) {
        success = (function() {});
      }
      if (error == null) {
        error = (function() {});
      }
      try {
        Myna.log("Myna.BaseExperiment.rewardVariant", this.id, variant.id, amount);
        rewarded = this.loadLastReward();
        Myna.log(" - rewarded", rewarded);
        if (rewarded != null) {
          return error();
        } else {
          this.clearLastSuggestion();
          this.saveLastReward(variant);
          this.enqueueReward(variant, amount);
          return success(variant);
        }
      } catch (_error) {
        exn = _error;
        return error(exn);
      }
    };

    BaseExperiment.prototype.record = function(success, error) {
      var allError, allSuccess, callbacks, finish, recordAll, recordOne,
        _this = this;

      if (success == null) {
        success = (function() {});
      }
      if (error == null) {
        error = (function() {});
      }
      this.waitingToRecord.push({
        success: success,
        error: error
      });
      if (this.recordSemaphore > 0) {
        return Myna.log("Myna.Experiment.record", "queued");
      } else {
        this.recordSemaphore++;
        callbacks = this.waitingToRecord;
        this.waitingToRecord = [];
        Myna.log("Myna.Experiment.record", "starting", callbacks.length);
        allSuccess = function() {
          var args, item, _i, _len, _results;

          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          _results = [];
          for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
            item = callbacks[_i];
            _results.push(item.success.apply(item, args));
          }
          return _results;
        };
        allError = function() {
          var args, item, _i, _len, _results;

          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          _results = [];
          for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
            item = callbacks[_i];
            _results.push(item.error.apply(item, args));
          }
          return _results;
        };
        recordAll = function(events, successEvents, errorEvents) {
          var head, tail;

          Myna.log("Myna.Experiment.record.recordAll", events, successEvents, errorEvents);
          if (events.length === 0) {
            return finish(successEvents, errorEvents);
          } else {
            head = events[0], tail = 2 <= events.length ? __slice.call(events, 1) : [];
            return recordOne(head, tail, successEvents, errorEvents);
          }
        };
        recordOne = function(event, otherEvents, successEvents, errorEvents) {
          Myna.log("Myna.Experiment.record.recordOne", event, otherEvents, successEvents, errorEvents);
          return Myna.jsonp.request({
            url: "" + _this.apiRoot + "/v2/experiment/" + _this.uuid + "/record",
            success: function() {
              return recordAll(otherEvents, successEvents.concat([event]), errorEvents);
            },
            error: function() {
              return recordAll(otherEvents, successEvents, errorEvents.concat([event]));
            },
            params: Myna.extend({}, event, {
              apikey: _this.apiKey
            })
          });
        };
        finish = function(successEvents, errorEvents) {
          Myna.log("Myna.Experiment.record.finish", successEvents, errorEvents);
          if (errorEvents.length > 0) {
            _this.requeueEvents(errorEvents);
            allError(errorEvents);
          } else {
            allSuccess(successEvents);
          }
          _this.recordSemaphore--;
          if (_this.waitingToRecord.length > 0) {
            return _this.record();
          }
        };
        return recordAll(this.clearQueuedEvents(), [], []);
      }
    };

    BaseExperiment.prototype.totalWeight = function() {
      var ans, id, variant, _ref;

      ans = 0.0;
      _ref = this.variants;
      for (id in _ref) {
        variant = _ref[id];
        ans += variant.weight;
      }
      return ans;
    };

    BaseExperiment.prototype.randomVariant = function() {
      var id, random, total, variant, _ref;

      Myna.log("Myna.BaseExperiment.randomVariant", this.id);
      total = this.totalWeight();
      random = Math.random() * total;
      _ref = this.variants;
      for (id in _ref) {
        variant = _ref[id];
        total -= variant.weight;
        if (total <= random) {
          Myna.log("Myna.BaseExperiment.randomVariant", this.id, variant.id);
          return variant;
        }
      }
      Myna.log("Myna.BaseExperiment.randomVariant", this.id, null);
      return null;
    };

    BaseExperiment.prototype.callback = function(id) {
      var ans;

      ans = this.callbacks[id];
      Myna.log("Myna.BaseExperiment.callback", this.id, id, ans);
      return ans != null ? ans : (function() {});
    };

    BaseExperiment.prototype.loadLastSuggestion = function() {
      return this.loadVariant('lastSuggestion');
    };

    BaseExperiment.prototype.saveLastSuggestion = function(variant) {
      this.saveVariant('lastSuggestion', variant);
      return this.clearVariant('lastReward');
    };

    BaseExperiment.prototype.clearLastSuggestion = function() {
      return this.clearVariant('lastSuggestion');
    };

    BaseExperiment.prototype.loadLastReward = function() {
      return this.loadVariant('lastReward');
    };

    BaseExperiment.prototype.saveLastReward = function(variant) {
      return this.saveVariant('lastReward', variant);
    };

    BaseExperiment.prototype.clearLastReward = function() {
      return this.clearVariant('lastReward');
    };

    BaseExperiment.prototype.loadVariant = function(cacheKey) {
      var id, _ref;

      id = (_ref = this.load()) != null ? _ref[cacheKey] : void 0;
      Myna.log("Myna.BaseExperiment.loadVariant", this.id, cacheKey, id);
      if (id != null) {
        return this.variants[id];
      } else {
        return null;
      }
    };

    BaseExperiment.prototype.saveVariant = function(cacheKey, variant) {
      return this.loadAndSave(function(saved) {
        Myna.log("Myna.BaseExperiment.saveVariant", this.id, cacheKey, variant, saved);
        if (variant != null) {
          saved[cacheKey] = variant.id;
        } else {
          delete saved[cacheKey];
        }
        return saved;
      });
    };

    BaseExperiment.prototype.clearVariant = function(cacheKey) {
      return this.saveVariant(cacheKey, null);
    };

    BaseExperiment.prototype.loadQueuedEvents = function() {
      var ans, _ref;

      ans = (_ref = this.load().queuedEvents) != null ? _ref : [];
      Myna.log("Myna.BaseExperiment.loadQueuedEvents", this.id, ans);
      return ans;
    };

    BaseExperiment.prototype.clearQueuedEvents = function() {
      var ans;

      Myna.log("Myna.BaseExperiment.clearQueuedEvents", this.id);
      ans = [];
      this.loadAndSave(function(saved) {
        var _ref;

        ans = (_ref = saved.queuedEvents) != null ? _ref : [];
        delete saved.queuedEvents;
        return saved;
      });
      return ans;
    };

    BaseExperiment.prototype.enqueueEvent = function(event) {
      Myna.log("Myna.BaseExperiment.enqueueEvent", this.id, event);
      return this.loadAndSave(function(saved) {
        if (saved.queuedEvents != null) {
          saved.queuedEvents.push(event);
        } else {
          saved.queuedEvents = [event];
        }
        return saved;
      });
    };

    BaseExperiment.prototype.requeueEvents = function(events) {
      Myna.log("Myna.BaseExperiment.requeueEvents", this.id, events);
      return this.loadAndSave(function(saved) {
        if (saved.queuedEvents != null) {
          saved.queuedEvents = events.concat(saved.queuedEvents);
        } else {
          saved.queuedEvents = events;
        }
        return saved;
      });
    };

    BaseExperiment.prototype.enqueueView = function(variant) {
      Myna.log("Myna.BaseExperiment.enqueueView", this.id, variant);
      return this.enqueueEvent({
        typename: "view",
        variant: variant.id,
        timestamp: Myna.dateToString(new Date())
      });
    };

    BaseExperiment.prototype.enqueueReward = function(variant, amount) {
      Myna.log("Myna.BaseExperiment.enqueueReward", this.id, variant, amount);
      return this.enqueueEvent({
        typename: "reward",
        variant: variant.id,
        amount: amount,
        timestamp: Myna.dateToString(new Date())
      });
    };

    BaseExperiment.prototype.loadAndSave = function(func) {
      var _ref;

      return this.save(func((_ref = this.load()) != null ? _ref : {}));
    };

    BaseExperiment.prototype.load = function() {
      return Myna.cache.load(this.uuid);
    };

    BaseExperiment.prototype.save = function(state) {
      return Myna.cache.save(this.uuid, state);
    };

    return BaseExperiment;

  })();

}).call(this);

(function() {
  var _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Myna.Experiment = (function(_super) {
    __extends(Experiment, _super);

    function Experiment() {
      this.clearStickyReward = __bind(this.clearStickyReward, this);
      this.saveStickyReward = __bind(this.saveStickyReward, this);
      this.loadStickyReward = __bind(this.loadStickyReward, this);
      this.clearStickySuggestion = __bind(this.clearStickySuggestion, this);
      this.saveStickySuggestion = __bind(this.saveStickySuggestion, this);
      this.loadStickySuggestion = __bind(this.loadStickySuggestion, this);
      this.unstick = __bind(this.unstick, this);
      this.sticky = __bind(this.sticky, this);
      this.reward = __bind(this.reward, this);
      this.suggest = __bind(this.suggest, this);      _ref = Experiment.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Experiment.prototype.suggest = function(success, error) {
      var ans, exn, sticky, suggested, variant;

      if (success == null) {
        success = (function() {});
      }
      if (error == null) {
        error = (function() {});
      }
      try {
        Myna.log("Myna.Experiment.suggest", this.id);
        sticky = this.sticky();
        if (sticky) {
          suggested = this.loadStickySuggestion();
          variant = suggested != null ? suggested : this.randomVariant();
        } else {
          suggested = null;
          variant = this.randomVariant();
        }
        Myna.log(" - suggest", suggested, variant);
        if (this.callback('beforeSuggest').call(this, variant, !!suggested) === false) {
          return;
        }
        Myna.log(" - suggest", "continuing");
        if (suggested != null) {
          ans = success(suggested);
        } else if (variant != null) {
          if (sticky) {
            this.saveStickySuggestion(variant);
          }
          ans = this.view(variant.id, success, error);
        } else {
          error();
          return;
        }
        Myna.log(" - suggest", "continued");
        this.callback('afterSuggest').call(this, variant, !!suggested);
        return ans;
      } catch (_error) {
        exn = _error;
        return error(exn);
      }
    };

    Experiment.prototype.reward = function(amount, success, error) {
      var ans, exn, rewarded, sticky, variant;

      if (amount == null) {
        amount = 1.0;
      }
      if (success == null) {
        success = (function() {});
      }
      if (error == null) {
        error = (function() {});
      }
      try {
        Myna.log("Myna.Experiment.reward", this.id, amount);
        sticky = this.sticky();
        if (sticky) {
          rewarded = this.loadStickyReward();
          variant = rewarded != null ? rewarded : this.loadLastSuggestion();
        } else {
          rewarded = null;
          variant = this.loadLastSuggestion();
        }
        Myna.log(" - reward", rewarded, variant, this.callback('beforeReward'));
        if (this.callback('beforeReward').call(this, variant, !!rewarded) === false) {
          return;
        }
        Myna.log(" - reward", "continuing");
        if (rewarded != null) {
          ans = success();
        } else if (variant != null) {
          if (sticky) {
            this.saveStickyReward(variant);
          }
          ans = this.rewardVariant(variant, amount, success, error);
        } else {
          error();
          return;
        }
        Myna.log(" - reward", "continued");
        this.callback('afterReward').call(this, variant, !!rewarded);
        return ans;
      } catch (_error) {
        exn = _error;
        return error(exn);
      }
    };

    Experiment.prototype.sticky = function() {
      var ans;

      ans = !!this.settings.get("myna.sticky", true);
      Myna.log("Myna.Experiment.sticky", this.id, ans);
      return ans;
    };

    Experiment.prototype.unstick = function() {
      Myna.log("Myna.Experiment.unstick", this.id);
      this.clearLastSuggestion();
      this.clearLastReward();
      return this.clearStickySuggestion();
    };

    Experiment.prototype.loadStickySuggestion = function() {
      return this.loadVariant('stickySuggestion');
    };

    Experiment.prototype.saveStickySuggestion = function(variant) {
      this.saveVariant('stickySuggestion', variant);
      return this.clearVariant('stickyReward');
    };

    Experiment.prototype.clearStickySuggestion = function() {
      this.clearVariant('stickySuggestion');
      return this.clearVariant('stickyReward');
    };

    Experiment.prototype.loadStickyReward = function() {
      return this.loadVariant('stickyReward');
    };

    Experiment.prototype.saveStickyReward = function(variant) {
      return this.saveVariant('stickyReward', variant);
    };

    Experiment.prototype.clearStickyReward = function() {
      return this.clearVariant('stickyReward');
    };

    return Experiment;

  })(Myna.BaseExperiment);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Myna.Client = (function() {
    function Client(options) {
      var expt, json, _i, _len, _ref, _ref1, _ref2, _ref3;

      if (options == null) {
        options = {};
      }
      this.reward = __bind(this.reward, this);
      this.view = __bind(this.view, this);
      this.suggest = __bind(this.suggest, this);
      this.apiRoot = (_ref = options.apiRoot) != null ? _ref : '//api.mynaweb.com';
      this.apiKey = (_ref1 = options.apiKey) != null ? _ref1 : Myna.error("Myna.Client.constructor", "no apiKey in options", options);
      this.experiments = {};
      _ref3 = (_ref2 = options.experiments) != null ? _ref2 : [];
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        json = _ref3[_i];
        expt = new Myna.Experiment(json);
        this.experiments[expt.id] = expt;
      }
    }

    Client.prototype.suggest = function(exptId, success, error) {
      if (success == null) {
        success = (function() {});
      }
      if (error == null) {
        error = (function() {});
      }
      return this.experiments[exptId].suggest(success, error);
    };

    Client.prototype.view = function(exptId, variantId, success, error) {
      if (success == null) {
        success = (function() {});
      }
      if (error == null) {
        error = (function() {});
      }
      return this.experiments[exptId].view(variantId, success, error);
    };

    Client.prototype.reward = function(exptId, amount, success, error) {
      if (amount == null) {
        amount = 1.0;
      }
      if (success == null) {
        success = (function() {});
      }
      if (error == null) {
        error = (function() {});
      }
      return this.experiments[exptId].reward(amount, success, error);
    };

    return Client;

  })();

}).call(this);

(function() {


}).call(this);
