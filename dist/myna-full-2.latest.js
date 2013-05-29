(function() {
  var _ref, _ref1,
    __slice = [].slice;

  if ((_ref = window.Myna) == null) {
    window.Myna = {};
  }

  Myna.debug = true;

  Myna.trim = function(str) {
    if (String.prototype.trim) {
      return str.trim();
    } else {
      return str.replace(/^\s+|\s+$/g, '');
    }
  };

  Myna.extend = function() {
    var des, key, sources, src, value, _i, _len;

    des = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = sources.length; _i < _len; _i++) {
      src = sources[_i];
      for (key in src) {
        value = src[key];
        des[key] = value;
      }
    }
    return des;
  };

  Myna.deleteKeys = function() {
    var ans, key, keys, obj, _i, _len;

    obj = arguments[0], keys = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    ans = Myna.extend({}, obj);
    for (_i = 0, _len = keys.length; _i < _len; _i++) {
      key = keys[_i];
      delete ans[key];
    }
    return ans;
  };

  Myna.dateToString = function(date) {
    var day, exn, hour, milli, minute, month, pad, second, year;

    Myna.log("Myna.dateToString", date);
    try {
      if (Date.prototype.toISOString) {
        return date.toISOString();
      } else {
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
      }
    } catch (_error) {
      exn = _error;
      return null;
    }
  };

  Myna.stringToDate = function(str) {
    var day, exn, hour, millisecond, minute, month, safeParseInt, second, year, _, _ref1;

    Myna.log("Myna.stringToDate", str);
    try {
      if (str instanceof Date) {
        return str;
      } else {
        _ref1 = str.match(/([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2}).([0-9]{3})Z/), _ = _ref1[0], year = _ref1[1], month = _ref1[2], day = _ref1[3], hour = _ref1[4], minute = _ref1[5], second = _ref1[6], millisecond = _ref1[7];
        if (!(year && month && day && hour && minute && second && millisecond)) {
          return null;
        }
        safeParseInt = function(str) {
          if (str[0] === '0') {
            return safeParseInt(str.substring(1));
          } else {
            return parseInt(str);
          }
        };
        return new Date(Date.UTC(safeParseInt(year), safeParseInt(month) - 1, safeParseInt(day), safeParseInt(hour), safeParseInt(minute), safeParseInt(second), safeParseInt(millisecond)));
      }
    } catch (_error) {
      exn = _error;
      Myna.log(exn);
      return null;
    }
  };

  Myna.problem = function(msg) {
    return msg;
  };

  Myna.$ = (_ref1 = window.jQuery) != null ? _ref1 : null;

}).call(this);

(function() {
  var __slice = [].slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Myna.phantomJs = /PhantomJS/.test(navigator.userAgent);

  Myna.log = function() {
    var args, _ref, _ref1;

    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (Myna.debug) {
      if (Myna.phantomJs) {
        if ((_ref = window.console) != null) {
          _ref.log(JSON.stringify(args));
        }
      } else {
        if ((_ref1 = window.console) != null) {
          _ref1.log(args);
        }
      }
    }
  };

  Myna.error = function() {
    var args;

    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (Myna.phantomJs) {
      throw JSON.stringify(args);
    } else {
      throw args;
    }
  };

  Myna.Logging = (function() {
    function Logging() {
      this.error = __bind(this.error, this);
      this.log = __bind(this.log, this);
    }

    Logging.prototype.logEnabled = true;

    Logging.prototype.log = function() {
      var args, method;

      method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (this.logEnabled) {
        return Myna.log.apply(Myna, ["" + this.constructor.name + "." + method].concat(__slice.call(args)));
      }
    };

    Logging.prototype.error = function() {
      var args, method;

      method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return Myna.error.apply(Myna, ["" + this.constructor.name + "." + method].concat(__slice.call(args)));
    };

    return Logging;

  })();

}).call(this);

(function() {
  var _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Myna.Events = (function(_super) {
    __extends(Events, _super);

    function Events() {
      this.off = __bind(this.off, this);
      this.on = __bind(this.on, this);
      this.triggerAsync = __bind(this.triggerAsync, this);
      this.trigger = __bind(this.trigger, this);
      this.setCustom = __bind(this.setCustom, this);
      this.set = __bind(this.set, this);
      this.getCustom = __bind(this.getCustom, this);
      this.get = __bind(this.get, this);      _ref = Events.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Events.prototype.directAttributes = [];

    Events.prototype.get = function(name) {
      if (this.constructor.prototype.directAttributes.indexOf(name) >= 0) {
        return this[name];
      } else {
        return this.getCustom(name);
      }
    };

    Events.prototype.getCustom = function(name) {
      return this.error("get", "property not found: " + name);
    };

    Events.prototype.set = function(arg1, arg2) {
      var name, setDirect, setOne, value,
        _this = this;

      setDirect = function(name, value) {
        _this[name] = value;
        return _this.trigger("change:" + name, _this, value);
      };
      setOne = function(name, value) {
        if (_this.constructor.prototype.directAttributes.indexOf(name) >= 0) {
          _this[name] = value;
          return _this.trigger("change:" + name, _this, value);
        } else {
          return _this.setCustom(name, value);
        }
      };
      if (typeof arg1 === "object") {
        for (name in arg1) {
          value = arg1[name];
          setOne(name, value);
        }
      } else {
        setOne(arg1, arg2);
      }
      this.trigger("change", this);
      return this;
    };

    Events.prototype.setCustom = function(name, value) {
      return this.error("set", "property not found: " + name);
    };

    Events.prototype.trigger = function() {
      var args, cancel, event, handler, _i, _len, _ref1, _ref2, _ref3;

      event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      this.log.apply(this, ["trigger", event].concat(__slice.call(args)));
      if (!this.eventHandlers) {
        this.eventHandlers = {};
      }
      cancel = false;
      _ref3 = (_ref1 = (_ref2 = this.eventHandlers) != null ? _ref2[event] : void 0) != null ? _ref1 : [];
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        handler = _ref3[_i];
        cancel = cancel || (handler.apply(this, args) === false);
      }
      if (cancel) {
        return false;
      } else {
        return void 0;
      }
    };

    Events.prototype.triggerAsync = function() {
      var args, error, event, success, triggerAll, _i, _ref1,
        _this = this;

      event = arguments[0], args = 4 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 2) : (_i = 1, []), success = arguments[_i++], error = arguments[_i++];
      this.log.apply(this, ["triggerAsync", event].concat(__slice.call(args)));
      if (!this.eventHandlers) {
        this.eventHandlers = {};
      }
      triggerAll = function(handlers) {
        var head, rest;

        _this.log("triggerAsync.triggerAll", handlers);
        if (handlers.length === 0) {
          return success();
        } else {
          head = handlers[0], rest = 2 <= handlers.length ? __slice.call(handlers, 1) : [];
          return head.call.apply(head, [_this].concat(__slice.call(args), [(function() {
            return triggerAll(rest);
          })], [error]));
        }
      };
      return triggerAll((_ref1 = this.eventHandlers[event]) != null ? _ref1 : []);
    };

    Events.prototype.on = function(events, handler) {
      var event, handlers, _i, _len, _ref1, _ref2;

      if (!this.eventHandlers) {
        this.eventHandlers = {};
      }
      _ref1 = events.split(/[ ]+/);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        event = _ref1[_i];
        handlers = (_ref2 = this.eventHandlers[event]) != null ? _ref2 : [];
        this.eventHandlers[event] = handlers.concat([handler]);
        this.log("on", event, handler, this.eventHandlers[event]);
      }
    };

    Events.prototype.off = function(events, handler) {
      var event, h, handlers, _i, _len, _ref1;

      if (!this.eventHandlers) {
        this.eventHandlers = {};
      }
      if (events != null) {
        _ref1 = events.split(/[ ]+/);
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          event = _ref1[_i];
          switch (arguments.length) {
            case 1:
              delete this.eventHandlers[arguments[0]];
              break;
            default:
              event = arguments[0], handler = arguments[1];
              if ((handlers = this.eventHandlers[event])) {
                this.eventHandlers[event] = (function() {
                  var _j, _len1, _results;

                  _results = [];
                  for (_j = 0, _len1 = handlers.length; _j < _len1; _j++) {
                    h = handlers[_j];
                    if (h !== handler) {
                      _results.push(h);
                    }
                  }
                  return _results;
                })();
              }
          }
          this.log("off", event, handler, this.eventHandlers[event]);
        }
      } else {
        this.eventHandlers = {};
        this.log("off", "all");
      }
    };

    return Events;

  })(Myna.Logging);

}).call(this);

(function() {
  Myna.jsonp = {
    callbacks: {},
    counter: 0,
    request: function(options) {
      var callbackName, error, key, onComplete, onTimeout, params, returned, scriptElem, success, timeout, timer, url, urlRoot, value, _ref, _ref1, _ref2, _ref3, _ref4;

      if (options == null) {
        options = {};
      }
      urlRoot = (_ref = options.url) != null ? _ref : Myna.error("Myna.jsonp.request", "no url in options", options);
      success = (_ref1 = options.success) != null ? _ref1 : (function() {});
      error = (_ref2 = options.error) != null ? _ref2 : (function() {});
      timeout = (_ref3 = options.timeout) != null ? _ref3 : 0;
      params = (_ref4 = options.params) != null ? _ref4 : {};
      callbackName = "callback" + (Myna.jsonp.counter++);
      returned = false;
      url = "" + urlRoot + "?";
      for (key in params) {
        value = params[key];
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
                callback: callbackName
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
  'use strict';
  var Field, Nil, Path, Root, Settings, nil,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

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
      this.prefixes = __bind(this.prefixes, this);
      this.unset = __bind(this.unset, this);
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
      if (value != null) {
        return this.next.set(data, value);
      } else {
        return this.next.unset(data);
      }
    };

    Root.prototype.unset = function(data) {
      return this.next.unset(data);
    };

    Root.prototype.prefixes = function() {
      return this.next.prefixes();
    };

    return Root;

  })(Path);

  Field = (function(_super) {
    __extends(Field, _super);

    function Field(next, name) {
      this.prefixes = __bind(this.prefixes, this);
      this.unset = __bind(this.unset, this);
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

    Field.prototype.unset = function(data) {
      var ans, k, modified, v;

      ans = {};
      for (k in data) {
        v = data[k];
        ans[k] = v;
      }
      modified = this.next.unset(ans[this.name]);
      if (this.next.unset(ans[this.name]) != null) {
        ans[this.name] = modified;
      } else {
        delete ans[this.name];
      }
      return ans;
    };

    Field.prototype.prefixes = function() {
      var prefix;

      return [this.name].concat(__slice.call((function() {
          var _i, _len, _ref, _results;

          _ref = this.next.prefixes();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            prefix = _ref[_i];
            _results.push("" + this.name + "." + prefix);
          }
          return _results;
        }).call(this)));
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

    Nil.prototype.unset = function(data) {
      return void 0;
    };

    Nil.prototype.prefixes = function() {
      return [];
    };

    return Nil;

  })(Path);

  nil = new Nil();

  Settings = (function() {
    function Settings(data) {
      if (data == null) {
        data = {};
      }
      this.toJson = __bind(this.toJson, this);
      this.unset = __bind(this.unset, this);
      this.set = __bind(this.set, this);
      this.get = __bind(this.get, this);
      this.data = {};
      this.set(data);
    }

    Settings.ast = {
      Root: Root,
      Field: Field,
      Nil: Nil,
      nil: nil
    };

    Settings.parse = function(path) {
      var memo, name, _i, _ref;

      path = Myna.trim(path);
      memo = nil;
      if (path !== "") {
        _ref = path.split(".");
        for (_i = _ref.length - 1; _i >= 0; _i += -1) {
          name = _ref[_i];
          memo = new Field(memo, name);
        }
      }
      return new Root(memo);
    };

    Settings.prototype.get = function(path, orElse) {
      var _ref;

      if (orElse == null) {
        orElse = null;
      }
      return (_ref = Settings.parse(path).get(this.data)) != null ? _ref : orElse;
    };

    Settings.prototype.set = function() {
      var key, value, _ref;

      switch (arguments.length) {
        case 0:
          throw ["Settings.set", "not enough arguments", arguments];
          break;
        case 1:
          _ref = arguments[0];
          for (key in _ref) {
            value = _ref[key];
            this.data = Settings.parse(key).set(this.data, value);
          }
          break;
        default:
          key = arguments[0];
          value = arguments[1];
          this.data = Settings.parse(key).set(this.data, value);
      }
      return this;
    };

    Settings.prototype.unset = function(path) {
      this.data = Settings.parse(path).unset(this.data);
      return this;
    };

    Settings.prototype.toJson = function() {
      return this.data;
    };

    return Settings;

  }).call(this);

  Myna.Settings = Settings;

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
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Myna.VariantSummary = (function(_super) {
    __extends(VariantSummary, _super);

    VariantSummary.prototype.directAttributes = ["id", "weight"];

    function VariantSummary(options) {
      var _ref, _ref1, _ref2;

      if (options == null) {
        options = {};
      }
      this.setCustom = __bind(this.setCustom, this);
      this.getCustom = __bind(this.getCustom, this);
      this.id = (_ref = options.id) != null ? _ref : this.error("constructor", "no id in options", options);
      this.weight = (_ref1 = options.weight) != null ? _ref1 : this.error("constructor", "no weight in options", options);
      this.settings = new Myna.Settings((_ref2 = options.settings) != null ? _ref2 : {});
    }

    VariantSummary.prototype.getCustom = function(name) {
      var path, _, _ref;

      if ((_ref = name.match(/^settings[.](.*)$/), _ = _ref[0], path = _ref[1], _ref)) {
        return this.settings.get(path);
      } else {
        return VariantSummary.__super__.getCustom.call(this, name);
      }
    };

    VariantSummary.prototype.setCustom = function(name, value) {
      var match, path, prefix, _i, _ref;

      match = name.match(/^settings[.](.*)$/);
      if (match) {
        path = match[1];
        this.settings.set(path, value);
        _ref = this.settings.constructor.parse(path).prefixes();
        for (_i = _ref.length - 1; _i >= 0; _i += -1) {
          prefix = _ref[_i];
          this.trigger("change:settings." + prefix, this, this.settings.get(prefix));
        }
        return this.trigger("change:settings", this, this.settings.data);
      } else {
        return VariantSummary.__super__.setCustom.call(this, name, value);
      }
    };

    return VariantSummary;

  })(Myna.Events);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Myna.ExperimentBase = (function(_super) {
    __extends(ExperimentBase, _super);

    ExperimentBase.prototype.directAttributes = ["uuid", "id"];

    function ExperimentBase(options) {
      var data, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4;

      if (options == null) {
        options = {};
      }
      this.save = __bind(this.save, this);
      this.load = __bind(this.load, this);
      this.loadAndSave = __bind(this.loadAndSave, this);
      this.clearVariant = __bind(this.clearVariant, this);
      this.saveVariant = __bind(this.saveVariant, this);
      this.loadVariant = __bind(this.loadVariant, this);
      this.clearLastReward = __bind(this.clearLastReward, this);
      this.saveLastReward = __bind(this.saveLastReward, this);
      this.loadLastReward = __bind(this.loadLastReward, this);
      this.clearLastView = __bind(this.clearLastView, this);
      this.saveLastView = __bind(this.saveLastView, this);
      this.loadLastView = __bind(this.loadLastView, this);
      this.setCustom = __bind(this.setCustom, this);
      this.getCustom = __bind(this.getCustom, this);
      this.createVariant = __bind(this.createVariant, this);
      this.randomVariant = __bind(this.randomVariant, this);
      this.totalWeight = __bind(this.totalWeight, this);
      this.saveVariantFromReward = __bind(this.saveVariantFromReward, this);
      this.rewardVariant = __bind(this.rewardVariant, this);
      this.loadVariantsForReward = __bind(this.loadVariantsForReward, this);
      this.reward = __bind(this.reward, this);
      this.saveVariantFromView = __bind(this.saveVariantFromView, this);
      this.viewVariant = __bind(this.viewVariant, this);
      this.loadVariantsForView = __bind(this.loadVariantsForView, this);
      this.view = __bind(this.view, this);
      this.loadVariantsForSuggest = __bind(this.loadVariantsForSuggest, this);
      this.suggest = __bind(this.suggest, this);
      ExperimentBase.__super__.constructor.call(this, options);
      this.log("constructor", options);
      this.id = (_ref = options.id) != null ? _ref : this.error("constructor", this.id, "no id in options", options);
      this.uuid = (_ref1 = options.uuid) != null ? _ref1 : void 0;
      this.settings = new Myna.Settings((_ref2 = options.settings) != null ? _ref2 : {});
      this.variants = {};
      _ref4 = (_ref3 = options.variants) != null ? _ref3 : [];
      for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
        data = _ref4[_i];
        this.variants[data.id] = this.createVariant(data);
      }
    }

    ExperimentBase.prototype.suggest = function(success, error) {
      var variants, _ref, _ref1;

      if (success == null) {
        success = (function() {});
      }
      if (error == null) {
        error = (function() {});
      }
      variants = this.loadVariantsForSuggest();
      this.log("suggest", this.id, (_ref = variants.variant) != null ? _ref.id : void 0, (_ref1 = variants.viewed) != null ? _ref1.id : void 0);
      this.viewVariant(Myna.extend({
        success: success,
        error: error
      }, variants));
    };

    ExperimentBase.prototype.loadVariantsForSuggest = function() {
      return {
        variant: this.randomVariant(),
        viewed: this.loadLastView()
      };
    };

    ExperimentBase.prototype.view = function(variantOrId, success, error) {
      var variants, _ref, _ref1;

      if (success == null) {
        success = (function() {});
      }
      if (error == null) {
        error = (function() {});
      }
      variants = this.loadVariantsForView(variantOrId);
      this.log("view", this.id, (_ref = variants.variant) != null ? _ref.id : void 0, (_ref1 = variants.viewed) != null ? _ref1.id : void 0);
      this.viewVariant(Myna.extend({
        success: success,
        error: error
      }, variants));
    };

    ExperimentBase.prototype.loadVariantsForView = function(variantOrId) {
      return {
        variant: variantOrId instanceof Myna.VariantSummary ? variantOrId : this.variants[variantOrId],
        viewed: null
      };
    };

    ExperimentBase.prototype.viewVariant = function(options) {
      var error, success, variant, viewed, _ref, _ref1;

      variant = options.variant;
      viewed = options.viewed;
      success = (_ref = options.success) != null ? _ref : (function() {});
      error = (_ref1 = options.error) != null ? _ref1 : (function() {});
      this.log("viewVariant", this.id, variant != null ? variant.id : void 0, viewed != null ? viewed.id : void 0);
      if (viewed != null) {
        if (this.trigger('beforeView', viewed, false) !== false) {
          success.call(this, viewed, false);
          this.trigger('view', viewed, false);
        }
      } else if (variant != null) {
        if (this.trigger('beforeView', variant, true) !== false) {
          this.saveVariantFromView(variant);
          success.call(this, variant, true);
          this.trigger('view', variant, true);
          this.trigger('recordView', variant);
        }
      } else {
        error(Myna.problem("no-variant"));
      }
    };

    ExperimentBase.prototype.saveVariantFromView = function(variant) {
      this.saveLastView(variant);
      return this.clearLastReward();
    };

    ExperimentBase.prototype.reward = function(amount, success, error) {
      var variants, _ref, _ref1;

      if (amount == null) {
        amount = 1.0;
      }
      if (success == null) {
        success = (function() {});
      }
      if (error == null) {
        error = (function() {});
      }
      variants = this.loadVariantsForReward();
      this.log("reward", this.id, (_ref = variants.variant) != null ? _ref.id : void 0, (_ref1 = variants.rewarded) != null ? _ref1.id : void 0, amount);
      this.rewardVariant(Myna.extend({
        amount: amount,
        success: success,
        error: error
      }, variants));
    };

    ExperimentBase.prototype.loadVariantsForReward = function() {
      return {
        variant: this.loadLastView(),
        rewarded: this.loadLastReward()
      };
    };

    ExperimentBase.prototype.rewardVariant = function(options) {
      var amount, error, rewarded, success, variant, _ref, _ref1, _ref2,
        _this = this;

      if (options == null) {
        options = {};
      }
      this.log("rewardVariant", this.id, options);
      variant = options.variant;
      rewarded = options.rewarded;
      amount = (_ref = options.amount) != null ? _ref : 1.0;
      success = (_ref1 = options.success) != null ? _ref1 : (function() {});
      error = (_ref2 = options.error) != null ? _ref2 : (function() {});
      if (rewarded != null) {
        if (this.trigger('beforeReward', rewarded, amount, false) !== false) {
          success.call(this, rewarded, amount, false);
          this.trigger('reward', rewarded, amount, false);
        }
      } else if (variant != null) {
        if (this.trigger('beforeReward', variant, amount, true) !== false) {
          this.triggerAsync('recordReward', variant, amount, function() {
            _this.saveVariantFromReward(variant);
            success.call(_this, variant, amount, true);
            return _this.trigger('reward', variant, amount, true);
          }, function() {
            var args;

            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return error.call.apply(error, [_this].concat(__slice.call(args)));
          });
        }
      } else {
        error(Myna.problem("no-variant"));
      }
    };

    ExperimentBase.prototype.saveVariantFromReward = function(variant) {
      this.clearLastView();
      return this.saveLastReward(variant);
    };

    ExperimentBase.prototype.totalWeight = function() {
      var ans, id, variant, _ref;

      ans = 0.0;
      _ref = this.variants;
      for (id in _ref) {
        variant = _ref[id];
        ans += variant.weight;
      }
      return ans;
    };

    ExperimentBase.prototype.randomVariant = function() {
      var id, random, total, variant, _ref;

      total = this.totalWeight();
      random = Math.random() * total;
      _ref = this.variants;
      for (id in _ref) {
        variant = _ref[id];
        total -= variant.weight;
        if (total <= random) {
          this.log("randomVariant", this.id, variant.id);
          return variant;
        }
      }
      this.log("randomVariant", this.id, null);
      return null;
    };

    ExperimentBase.prototype.createVariant = function(data) {
      return new Myna.VariantSummary(data);
    };

    ExperimentBase.prototype.getCustom = function(name) {
      var path, _, _ref;

      if ((_ref = name.match(/^settings[.](.*)$/), _ = _ref[0], path = _ref[1], _ref)) {
        return this.settings.get(path);
      } else {
        return ExperimentBase.__super__.getCustom.call(this, name);
      }
    };

    ExperimentBase.prototype.setCustom = function(name, value) {
      var match, path, prefix, _i, _ref;

      match = name.match(/^settings[.](.*)$/);
      if (match) {
        path = match[1];
        this.settings.set(path, value);
        _ref = this.settings.constructor.parse(path).prefixes();
        for (_i = _ref.length - 1; _i >= 0; _i += -1) {
          prefix = _ref[_i];
          this.trigger("change:settings." + prefix, this, this.settings.get(prefix));
        }
        return this.trigger("change:settings", this, this.settings.data);
      } else {
        return ExperimentBase.__super__.setCustom.call(this, name, value);
      }
    };

    ExperimentBase.prototype.loadLastView = function() {
      return this.loadVariant('lastView');
    };

    ExperimentBase.prototype.saveLastView = function(variant) {
      this.saveVariant('lastView', variant);
      return this.clearVariant('lastReward');
    };

    ExperimentBase.prototype.clearLastView = function() {
      return this.clearVariant('lastView');
    };

    ExperimentBase.prototype.loadLastReward = function() {
      return this.loadVariant('lastReward');
    };

    ExperimentBase.prototype.saveLastReward = function(variant) {
      return this.saveVariant('lastReward', variant);
    };

    ExperimentBase.prototype.clearLastReward = function() {
      return this.clearVariant('lastReward');
    };

    ExperimentBase.prototype.loadVariant = function(cacheKey) {
      var id, _ref;

      id = (_ref = this.load()) != null ? _ref[cacheKey] : void 0;
      this.log("loadVariant", this.id, cacheKey, id);
      if (id != null) {
        return this.variants[id];
      } else {
        return null;
      }
    };

    ExperimentBase.prototype.saveVariant = function(cacheKey, variant) {
      var _this = this;

      return this.loadAndSave(function(saved) {
        _this.log("saveVariant", _this.id, cacheKey, variant, saved);
        if (variant != null) {
          saved[cacheKey] = variant.id;
        } else {
          delete saved[cacheKey];
        }
        return saved;
      });
    };

    ExperimentBase.prototype.clearVariant = function(cacheKey) {
      return this.saveVariant(cacheKey, null);
    };

    ExperimentBase.prototype.loadAndSave = function(func) {
      var _ref;

      return this.save(func((_ref = this.load()) != null ? _ref : {}));
    };

    ExperimentBase.prototype.load = function() {
      return Myna.cache.load(this.uuid);
    };

    ExperimentBase.prototype.save = function(state) {
      return Myna.cache.save(this.uuid, state);
    };

    return ExperimentBase;

  })(Myna.Events);

}).call(this);

(function() {
  var _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Myna.ExperimentSummary = (function(_super) {
    __extends(ExperimentSummary, _super);

    function ExperimentSummary() {
      this.clearStickyReward = __bind(this.clearStickyReward, this);
      this.saveStickyReward = __bind(this.saveStickyReward, this);
      this.loadStickyReward = __bind(this.loadStickyReward, this);
      this.clearStickySuggestion = __bind(this.clearStickySuggestion, this);
      this.saveStickySuggestion = __bind(this.saveStickySuggestion, this);
      this.loadStickySuggestion = __bind(this.loadStickySuggestion, this);
      this.unstick = __bind(this.unstick, this);
      this.saveVariantFromReward = __bind(this.saveVariantFromReward, this);
      this.loadVariantsForReward = __bind(this.loadVariantsForReward, this);
      this.saveVariantFromView = __bind(this.saveVariantFromView, this);
      this.loadVariantsForView = __bind(this.loadVariantsForView, this);
      this.loadVariantsForSuggest = __bind(this.loadVariantsForSuggest, this);
      this.sticky = __bind(this.sticky, this);      _ref = ExperimentSummary.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ExperimentSummary.prototype.sticky = function() {
      return !!this.settings.get("myna.js.sticky", true);
    };

    ExperimentSummary.prototype.loadVariantsForSuggest = function() {
      var sticky;

      if (this.sticky()) {
        sticky = this.loadStickySuggestion();
        return {
          variant: sticky != null ? sticky : this.randomVariant(),
          viewed: sticky
        };
      } else {
        return ExperimentSummary.__super__.loadVariantsForSuggest.call(this);
      }
    };

    ExperimentSummary.prototype.loadVariantsForView = function(variant) {
      return ExperimentSummary.__super__.loadVariantsForView.call(this, variant);
    };

    ExperimentSummary.prototype.saveVariantFromView = function(variant) {
      if (this.sticky()) {
        this.saveStickySuggestion(variant);
      }
      return ExperimentSummary.__super__.saveVariantFromView.call(this, variant);
    };

    ExperimentSummary.prototype.loadVariantsForReward = function() {
      if (this.sticky()) {
        return {
          variant: this.loadLastView(),
          rewarded: this.loadStickyReward()
        };
      } else {
        return ExperimentSummary.__super__.loadVariantsForReward.call(this);
      }
    };

    ExperimentSummary.prototype.saveVariantFromReward = function(variant) {
      if (this.sticky()) {
        this.saveStickyReward(variant);
      }
      return ExperimentSummary.__super__.saveVariantFromReward.call(this, variant);
    };

    ExperimentSummary.prototype.unstick = function() {
      this.log("unstick", this.id);
      this.clearLastView();
      this.clearLastReward();
      this.clearStickySuggestion();
      return this.clearStickyReward();
    };

    ExperimentSummary.prototype.loadStickySuggestion = function() {
      return this.loadVariant('stickySuggestion');
    };

    ExperimentSummary.prototype.saveStickySuggestion = function(variant) {
      this.saveVariant('stickySuggestion', variant);
      return this.clearVariant('stickyReward');
    };

    ExperimentSummary.prototype.clearStickySuggestion = function() {
      this.clearVariant('stickySuggestion');
      return this.clearVariant('stickyReward');
    };

    ExperimentSummary.prototype.loadStickyReward = function() {
      return this.loadVariant('stickyReward');
    };

    ExperimentSummary.prototype.saveStickyReward = function(variant) {
      return this.saveVariant('stickyReward', variant);
    };

    ExperimentSummary.prototype.clearStickyReward = function() {
      return this.clearVariant('stickyReward');
    };

    return ExperimentSummary;

  })(Myna.ExperimentBase);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Myna.Recorder = (function(_super) {
    __extends(Recorder, _super);

    function Recorder(options) {
      var _ref, _ref1, _ref2, _ref3, _ref4;

      if (options == null) {
        options = {};
      }
      this.save = __bind(this.save, this);
      this.load = __bind(this.load, this);
      this.loadAndSave = __bind(this.loadAndSave, this);
      this.clearQueuedEvents = __bind(this.clearQueuedEvents, this);
      this.requeueEvents = __bind(this.requeueEvents, this);
      this.queueEvent = __bind(this.queueEvent, this);
      this.queuedEvents = __bind(this.queuedEvents, this);
      this.sync = __bind(this.sync, this);
      this.recordReward = __bind(this.recordReward, this);
      this.recordView = __bind(this.recordView, this);
      this.listenTo = __bind(this.listenTo, this);
      Recorder.__super__.constructor.call(this, options);
      this.log("constructor", options);
      this.apiKey = (_ref = options.apiKey) != null ? _ref : Myna.error("Myna.Recorder.constructor", "no apiKey in options", options);
      this.apiRoot = (_ref1 = options.apiRoot) != null ? _ref1 : "//api.mynaweb.com";
      this.storageKey = (_ref2 = options.storageKey) != null ? _ref2 : "myna";
      this.timeout = (_ref3 = options.timeout) != null ? _ref3 : 1000;
      this.autoSync = (_ref4 = options.autoSync) != null ? _ref4 : true;
      this.semaphore = 0;
      this.waiting = [];
    }

    Recorder.prototype.listenTo = function(expt) {
      var _this = this;

      this.log("listenTo", expt.id);
      expt.on('recordView', function(variant, success, error) {
        return _this.recordView(expt, variant, success, error);
      });
      return expt.on('recordReward', function(variant, amount, success, error) {
        return _this.recordReward(expt, variant, amount, success, error);
      });
    };

    Recorder.prototype.recordView = function(expt, variant, success, error) {
      if (success == null) {
        success = (function() {});
      }
      if (error == null) {
        error = (function() {});
      }
      this.log("recordView", expt.id, variant.id);
      if (expt.uuid != null) {
        this.queueEvent({
          typename: "view",
          experiment: expt.uuid,
          variant: variant.id,
          timestamp: Myna.dateToString(new Date())
        });
        this.log("recordReward", "aboutToSync", this.autoSync);
        if (this.autoSync) {
          return this.sync(success, error);
        } else {
          return success();
        }
      }
    };

    Recorder.prototype.recordReward = function(expt, variant, amount, success, error) {
      if (success == null) {
        success = (function() {});
      }
      if (error == null) {
        error = (function() {});
      }
      this.log("recordReward", expt.id, variant.id, amount);
      if (expt.uuid != null) {
        this.queueEvent({
          typename: "reward",
          experiment: expt.uuid,
          variant: variant.id,
          amount: amount,
          timestamp: Myna.dateToString(new Date())
        });
        this.log("recordReward", "aboutToSync", this.autoSync);
        if (this.autoSync) {
          return this.sync(success, error);
        } else {
          return success();
        }
      }
    };

    Recorder.prototype.sync = function(success, error) {
      var finish, start, syncAll, syncOne, waiting,
        _this = this;

      if (success == null) {
        success = (function() {});
      }
      if (error == null) {
        error = (function() {});
      }
      this.waiting.push({
        success: success,
        error: error
      });
      if (this.semaphore > 0) {
        return this.log("sync", "queued");
      } else {
        this.semaphore++;
        waiting = this.waiting;
        this.waiting = [];
        start = function() {
          var events;

          events = _this.clearQueuedEvents();
          _this.log("sync.start", events, waiting.length);
          if (_this.trigger('beforeSync', events) === false) {
            return _this.requeueEvents(events);
          } else {
            return syncAll(events, [], []);
          }
        };
        syncAll = function(events, successEvents, errorEvents) {
          var head, tail;

          _this.log("sync.syncAll", events, successEvents, errorEvents);
          if (events.length === 0) {
            return finish(successEvents, errorEvents);
          } else {
            head = events[0], tail = 2 <= events.length ? __slice.call(events, 1) : [];
            return syncOne(head, tail, successEvents, errorEvents);
          }
        };
        syncOne = function(event, otherEvents, successEvents, errorEvents) {
          var params;

          _this.log("sync.syncOne", event, otherEvents, successEvents, errorEvents);
          params = Myna.deleteKeys(event, 'experiment');
          return Myna.jsonp.request({
            url: "" + _this.apiRoot + "/v2/experiment/" + event.experiment + "/record",
            success: function() {
              return syncAll(otherEvents, successEvents.concat([event]), errorEvents);
            },
            error: function() {
              return syncAll(otherEvents, successEvents, errorEvents.concat([event]));
            },
            timeout: _this.timeout,
            params: Myna.extend({}, params, {
              apikey: _this.apiKey
            })
          });
        };
        finish = function(successEvents, errorEvents) {
          var item, _i, _j, _len, _len1;

          _this.log("sync.finish", successEvents, errorEvents);
          if (errorEvents.length > 0) {
            _this.requeueEvents(errorEvents);
            for (_i = 0, _len = waiting.length; _i < _len; _i++) {
              item = waiting[_i];
              item.error(successEvents, errorEvents);
            }
          } else {
            for (_j = 0, _len1 = waiting.length; _j < _len1; _j++) {
              item = waiting[_j];
              item.success(successEvents, errorEvents);
            }
          }
          _this.trigger('afterSync', successEvents, errorEvents);
          _this.semaphore--;
          if (_this.waiting.length > 0) {
            return _this.sync();
          }
        };
        return start();
      }
    };

    Recorder.prototype.queuedEvents = function() {
      var ans, _ref;

      ans = (_ref = this.load().queuedEvents) != null ? _ref : [];
      this.log("queuedEvents", ans);
      return ans;
    };

    Recorder.prototype.queueEvent = function(event) {
      this.log("queueEvent", event);
      return this.loadAndSave(function(saved) {
        var _ref;

        saved.queuedEvents = ((_ref = saved.queuedEvents) != null ? _ref : []).concat([event]);
        return saved;
      });
    };

    Recorder.prototype.requeueEvents = function(events) {
      this.log("requeueEvents", events);
      return this.loadAndSave(function(saved) {
        var _ref;

        saved.queuedEvents = events.concat((_ref = saved.queuedEvents) != null ? _ref : []);
        return saved;
      });
    };

    Recorder.prototype.clearQueuedEvents = function() {
      var ans;

      this.log("clearQueuedEvents");
      ans = [];
      this.loadAndSave(function(saved) {
        var _ref;

        ans = (_ref = saved.queuedEvents) != null ? _ref : [];
        delete saved.queuedEvents;
        return saved;
      });
      return ans;
    };

    Recorder.prototype.loadAndSave = function(func) {
      var _ref;

      return this.save(func((_ref = this.load()) != null ? _ref : {}));
    };

    Recorder.prototype.load = function() {
      return Myna.cache.load(this.storageKey);
    };

    Recorder.prototype.save = function(state) {
      return Myna.cache.save(this.storageKey, state);
    };

    return Recorder;

  })(Myna.Events);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Myna.Client = (function(_super) {
    __extends(Client, _super);

    function Client(options) {
      var data, expt, _i, _len, _ref, _ref1;

      if (options == null) {
        options = {};
      }
      this.reward = __bind(this.reward, this);
      this.view = __bind(this.view, this);
      this.suggest = __bind(this.suggest, this);
      this.log("constructor", options);
      this.experiments = {};
      _ref1 = (_ref = options.experiments) != null ? _ref : [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        data = _ref1[_i];
        expt = data instanceof Myna.ExperimentBase ? data : new Myna.ExperimentSummary(data);
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

  })(Myna.Logging);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Myna.Variant = (function(_super) {
    __extends(Variant, _super);

    Variant.prototype.directAttributes = ["id", "name", "views", "totalReward", "weight"];

    function Variant(options) {
      var _ref, _ref1, _ref2;

      if (options == null) {
        options = {};
      }
      this.toJSON = __bind(this.toJSON, this);
      this.averageReward = __bind(this.averageReward, this);
      Variant.__super__.constructor.call(this, options);
      this.name = (_ref = options.name) != null ? _ref : void 0;
      this.views = (_ref1 = options.views) != null ? _ref1 : void 0;
      this.totalReward = (_ref2 = options.totalReward) != null ? _ref2 : void 0;
    }

    Variant.prototype.averageReward = function() {
      if ((this.views != null) && (this.totalReward != null)) {
        if (this.views === 0) {
          return 1.0;
        } else {
          return this.totalReward / this.views;
        }
      } else {
        return void 0;
      }
    };

    Variant.prototype.toJSON = function() {
      var settingsJSON;

      settingsJSON = Myna.extend({
        "": null
      }, this.settings.data);
      return {
        typename: "variant",
        id: this.id,
        name: this.name,
        views: this.views,
        totalReward: this.totalReward,
        weight: this.weight,
        settings: settingsJSON
      };
    };

    return Variant;

  })(Myna.VariantSummary);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Myna.Experiment = (function(_super) {
    __extends(Experiment, _super);

    Experiment.prototype.directAttributes = ["uuid", "id", "accountId", "name", "visibility", "created"];

    function Experiment(options) {
      var _ref, _ref1, _ref2;

      if (options == null) {
        options = {};
      }
      this.toJSON = __bind(this.toJSON, this);
      Experiment.__super__.constructor.call(this, options);
      this.accountId = (_ref = options.accountId) != null ? _ref : void 0;
      this.name = (_ref1 = options.name) != null ? _ref1 : void 0;
      this.visibility = (_ref2 = options.visibility) != null ? _ref2 : "draft";
      this.created = options.created != null ? Myna.stringToDate(options.created) : new Date();
    }

    Experiment.prototype.createVariant = function(data) {
      return new Myna.Variant(data);
    };

    Experiment.prototype.toJSON = function() {
      var id, settingsJSON, variant, variantJSON, _ref;

      settingsJSON = Myna.extend({
        "": null
      }, this.settings.data);
      variantJSON = {};
      _ref = this.variants;
      for (id in _ref) {
        variant = _ref[id];
        variantJSON[id] = variant.toJSON();
      }
      return {
        typename: "experiment",
        uuid: this.uuid,
        id: this.id,
        accountId: this.accountId,
        name: this.name,
        visibility: this.visibility,
        created: this.created ? Myna.dateToString(this.created) : null,
        settings: settingsJSON,
        variants: variantJSON
      };
    };

    return Experiment;

  })(Myna.ExperimentSummary);

}).call(this);
