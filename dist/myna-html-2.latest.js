(function() {
  var _ref,
    __slice = [].slice;

  if (window.Myna == null) {
    window.Myna = {};
  }

  if (Myna.debug == null) {
    Myna.debug = false;
  }

  Myna.log = function() {
    var args, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (Myna.debug) {
      if ((_ref = window.console) != null) {
        _ref.log(args);
      }
    }
  };

  Myna.error = function() {
    var args, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (Myna.debug) {
      if ((_ref = window.console) != null) {
        _ref.error(args);
      }
    }
    throw args;
  };

  Myna.trim = function(str) {
    if (str === null) {
      return "";
    } else {
      return str.replace(/^\s+|\s+$/g, '');
    }
  };

  Myna.isArray = Array.isArray || function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };

  Myna.isObject = function(obj) {
    return obj === Object(obj);
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
    var day, hour, milli, minute, month, pad, second, year;
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
  };

  Myna.problem = function(msg) {
    return msg;
  };

  Myna.$ = (_ref = window.jQuery) != null ? _ref : null;

}).call(this);

(function() {
  Myna.parseHashParams = function(hash) {
    var ans, lhs, part, rhs, _i, _len, _ref, _ref1;
    if (hash == null) {
      hash = window.location.hash;
    }
    hash = !hash ? "" : hash[0] === "#" ? hash.substring(1) : hash;
    ans = {};
    _ref = hash.split("&");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      part = _ref[_i];
      if (!(part !== "")) {
        continue;
      }
      _ref1 = part.split("="), lhs = _ref1[0], rhs = _ref1[1];
      ans[decodeURIComponent(lhs)] = decodeURIComponent(rhs != null ? rhs : lhs);
    }
    Myna.log("parseHashParams", ans);
    return ans;
  };

  Myna.hashParams = Myna.parseHashParams();

  if (Myna.hashParams["debug"]) {
    Myna.debug = true;
  }

  Myna.preview = function() {
    if (Myna.hashParams["preview"]) {
      Myna.cache.save("myna-preview", true);
      return true;
    } else {
      return !!Myna.cache.load("myna-preview");
    }
  };

  Myna.setPreview = function(preview) {
    Myna.cache.save("myna-preview", !!preview);
  };

}).call(this);

(function() {
  Myna.jsonp = {
    callbacks: {},
    counter: 0,
    createScriptElem: function(url, callbackName) {
      var scriptElem;
      scriptElem = document.createElement("script");
      scriptElem.setAttribute("type", "text/javascript");
      scriptElem.setAttribute("async", "true");
      scriptElem.setAttribute("src", url);
      scriptElem.setAttribute("class", "myna-jsonp");
      scriptElem.setAttribute("data-callback", callbackName);
      scriptElem.onload = scriptElem.onreadystatechange = function() {
        return Myna.jsonp.remove(callbackName, scriptElem);
      };
      return scriptElem;
    },
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
      scriptElem = Myna.jsonp.createScriptElem(url, callbackName);
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
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  Myna.Events = (function() {
    function Events() {
      this.off = __bind(this.off, this);
      this.on = __bind(this.on, this);
      this.triggerAsync = __bind(this.triggerAsync, this);
      this.trigger = __bind(this.trigger, this);
      this.eventHandlers = {};
    }

    Events.prototype.trigger = function() {
      var args, cancel, event, handler, _i, _len, _ref, _ref1;
      event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      Myna.log.apply(Myna, ["Myna.Events.trigger", event].concat(__slice.call(args)));
      cancel = false;
      _ref1 = (_ref = this.eventHandlers[event]) != null ? _ref : [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        handler = _ref1[_i];
        cancel = cancel || (handler.apply(this, args) === false);
      }
      if (cancel) {
        return false;
      } else {
        return void 0;
      }
    };

    Events.prototype.triggerAsync = function() {
      var args, error, event, success, triggerAll, _i, _ref,
        _this = this;
      event = arguments[0], args = 4 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 2) : (_i = 1, []), success = arguments[_i++], error = arguments[_i++];
      Myna.log.apply(Myna, ["Myna.Events.triggerAsync", event].concat(__slice.call(args)));
      triggerAll = function(handlers) {
        var head, rest;
        Myna.log("Myna.Events.triggerAsync.triggerAll", handlers);
        if (handlers.length === 0) {
          return success();
        } else {
          head = handlers[0], rest = 2 <= handlers.length ? __slice.call(handlers, 1) : [];
          return head.call.apply(head, [_this].concat(__slice.call(args), [(function() {
            return triggerAll(rest);
          })], [error]));
        }
      };
      return triggerAll((_ref = this.eventHandlers[event]) != null ? _ref : []);
    };

    Events.prototype.on = function(event, handler) {
      var _ref;
      this.eventHandlers[event] = ((_ref = this.eventHandlers[event]) != null ? _ref : []).concat([handler]);
      return Myna.log("Myna.Events.on", event, handler, this.eventHandlers[event]);
    };

    Events.prototype.off = function(event, handler) {
      var h;
      if (handler == null) {
        handler = null;
      }
      switch (arguments.length) {
        case 0:
          this.eventHandlers = {};
          break;
        case 1:
          delete this.eventHandlers[arguments[0]];
          break;
        default:
          event = arguments[0], handler = arguments[1];
          this.eventHandlers[event] = (function() {
            var _i, _len, _ref, _results;
            _ref = this.eventHandlers[event];
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              h = _ref[_i];
              if (h !== handler) {
                _results.push(h);
              }
            }
            return _results;
          }).call(this);
      }
      return Myna.log("Myna.Events.off", event, handler, this.eventHandlers[event]);
    };

    return Events;

  })();

}).call(this);

(function() {
  'use strict';
  var Path,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Path = (function() {
    Path.identifierRegex = /^[a-z_$][a-z0-9_$]*/i;

    Path.integerRegex = /^[0-9]+/;

    Path.completeIdentifierRegex = /^[a-z_$][a-z0-9_$]*$/i;

    Path.permissiveIdentifierRegex = /^[^[.]+/;

    function Path(input) {
      this.toString = __bind(this.toString, this);
      this.drop = __bind(this.drop, this);
      this.take = __bind(this.take, this);
      this.isPrefixOf = __bind(this.isPrefixOf, this);
      this.prefixes = __bind(this.prefixes, this);
      this.unset = __bind(this.unset, this);
      this.set = __bind(this.set, this);
      this.get = __bind(this.get, this);
      this.path = __bind(this.path, this);
      this.quote = __bind(this.quote, this);
      if (typeof input === "string") {
        this.nodes = Path.parse(input);
      } else {
        this.nodes = input;
      }
    }

    Path.isValid = function(path) {
      var exn;
      try {
        Path.parse(path);
        return true;
      } catch (_error) {
        exn = _error;
        return false;
      }
    };

    Path.normalize = function(path) {
      var exn;
      try {
        return new Path(path).toString();
      } catch (_error) {
        exn = _error;
        return path;
      }
    };

    Path.parse = function(originalPath) {
      var identifier, indexField, number, path, skip, string, take, takeString, topLevel;
      path = originalPath;
      skip = function(num) {
        if (path.length < num) {
          throw "bad settings path: " + originalPath;
        } else {
          path = path.substring(num);
        }
      };
      take = function(num) {
        var ans;
        if (path.length < num) {
          throw "bad settings path: " + originalPath;
        } else {
          ans = path.substring(0, num);
          path = path.substring(num);
          return ans;
        }
      };
      takeString = function(str) {
        path = path.substring(str.length);
        return str;
      };
      identifier = function() {
        var match;
        match = path.match(Path.permissiveIdentifierRegex);
        if (match) {
          return takeString(match[0]);
        } else {
          throw "bad settings path: " + originalPath;
        }
      };
      number = function() {
        var match;
        match = path.match(Path.integerRegex);
        if (match) {
          return parseInt(takeString(match[0]));
        } else {
          throw "bad settings path: " + originalPath;
        }
      };
      string = function(quote) {
        var ans, terminated;
        skip(1);
        ans = "";
        terminated = false;
        while (!terminated) {
          if (path[0] === quote) {
            terminated = true;
          } else if (path[0] === "\\") {
            skip(1);
            ans += take(1);
          } else {
            ans += take(1);
          }
        }
        skip(1);
        return ans;
      };
      indexField = function() {
        var ans;
        skip(1);
        if (path[0] === "'") {
          ans = string("'");
        } else if (path[0] === '"') {
          ans = string('"');
        } else {
          ans = number();
        }
        skip(1);
        return ans;
      };
      topLevel = function() {
        var ans;
        ans = [];
        while (path.length > 0) {
          if (path[0] === ".") {
            skip(1);
            ans.push(identifier());
          } else if (path[0] === "[") {
            ans.push(indexField());
          } else {
            ans.push(identifier());
          }
        }
        return ans;
      };
      path = Myna.trim(path);
      if (path === "") {
        return [];
      } else if (path[0] === "." || path[0] === "[") {
        return topLevel();
      } else {
        path = "." + path;
        return topLevel();
      }
    };

    Path.prototype.quote = function(str) {
      return str.replace(/['\"\\]/g, function(quote) {
        return "\\" + quote;
      });
    };

    Path.prototype.path = function(nodes) {
      var ans, node, _i, _len;
      if (nodes == null) {
        nodes = this.nodes;
      }
      ans = "";
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        node = nodes[_i];
        if (typeof node === "number") {
          ans += "[" + node + "]";
        } else if (Path.completeIdentifierRegex.test(node)) {
          ans += "." + node;
        } else {
          ans += "[\"" + (this.quote(node)) + "\"]";
        }
      }
      if (ans[0] === ".") {
        return ans.substring(1);
      } else {
        return ans;
      }
    };

    Path.prototype.get = function(data) {
      var node, _i, _len, _ref;
      _ref = this.nodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        data = data != null ? data[node] : void 0;
      }
      return data;
    };

    Path.prototype.set = function(data, value) {
      var first, last, node, obj, _i, _j, _len, _ref;
      if (value != null) {
        if (this.nodes.length === 0) {
          return value;
        } else {
          obj = data;
          _ref = this.nodes, first = 2 <= _ref.length ? __slice.call(_ref, 0, _i = _ref.length - 1) : (_i = 0, []), last = _ref[_i++];
          for (_j = 0, _len = first.length; _j < _len; _j++) {
            node = first[_j];
            if (typeof obj[node] !== "object") {
              obj[node] = {};
            }
            obj = obj[node];
          }
          obj[last] = value;
          return data;
        }
      } else {
        return this.unset(data);
      }
    };

    Path.prototype.unset = function(data) {
      var first, last, node, obj, _i, _j, _len, _ref;
      if (this.nodes.length === 0) {
        return void 0;
      } else {
        obj = data;
        _ref = this.nodes, first = 2 <= _ref.length ? __slice.call(_ref, 0, _i = _ref.length - 1) : (_i = 0, []), last = _ref[_i++];
        for (_j = 0, _len = first.length; _j < _len; _j++) {
          node = first[_j];
          if (obj[node] == null) {
            return data;
          }
          obj = obj[node];
        }
        delete obj[last];
        return data;
      }
    };

    Path.prototype.prefixes = function() {
      var ans, n, nodes, _i, _ref;
      nodes = this.nodes;
      ans = [];
      for (n = _i = 1, _ref = nodes.length; 1 <= _ref ? _i <= _ref : _i >= _ref; n = 1 <= _ref ? ++_i : --_i) {
        ans.push(this.path(nodes.slice(0, n)));
      }
      return ans;
    };

    Path.prototype.isPrefixOf = function(path) {
      var a, b, num, _i, _ref;
      a = this.nodes;
      b = path.nodes;
      if (a.length > b.length) {
        return false;
      }
      for (num = _i = 0, _ref = a.length; 0 <= _ref ? _i < _ref : _i > _ref; num = 0 <= _ref ? ++_i : --_i) {
        if (a[num] !== b[num]) {
          return false;
        }
      }
      return true;
    };

    Path.prototype.take = function(num) {
      return new Path(_.take(this.nodes, num));
    };

    Path.prototype.drop = function(num) {
      return new Path(_.drop(this.nodes, num));
    };

    Path.prototype.toString = function() {
      return this.path();
    };

    return Path;

  }).call(this);

  Myna.Settings = (function(_super) {
    __extends(Settings, _super);

    Settings.Path = Path;

    Settings.defaultSetOptions = {
      silent: false
    };

    function Settings(data) {
      if (data == null) {
        data = {};
      }
      this.toJSON = __bind(this.toJSON, this);
      this.triggerChange = __bind(this.triggerChange, this);
      this.paths = __bind(this.paths, this);
      this.pathValuePairs = __bind(this.pathValuePairs, this);
      this.unset = __bind(this.unset, this);
      this.set = __bind(this.set, this);
      this.get = __bind(this.get, this);
      Settings.__super__.constructor.call(this);
      this.data = {};
      this.set(data);
    }

    Settings.prototype.get = function(path, orElse) {
      var _ref;
      if (orElse == null) {
        orElse = void 0;
      }
      return (_ref = new Myna.Settings.Path(path).get(this.data)) != null ? _ref : orElse;
    };

    Settings.prototype.set = function() {
      var options, path, pathStr, paths, updates, value, _ref;
      if (arguments.length === 0) {
        throw ["Myna.Settings.set", "not enough arguments", arguments];
      }
      if (typeof arguments[0] === "object") {
        updates = arguments[0];
        options = Myna.extend({}, Myna.Settings.defaultSetOptions, (_ref = arguments[1]) != null ? _ref : {});
        paths = [];
        for (pathStr in updates) {
          value = updates[pathStr];
          path = new Myna.Settings.Path(pathStr);
          this.data = path.set(this.data, value);
          paths.push(path);
        }
        if (!options.silent) {
          this.triggerChange(paths);
        }
      } else {
        updates = {};
        updates[arguments[0]] = arguments[1];
        options = arguments[2];
        this.set(updates, options);
      }
      return this;
    };

    Settings.prototype.unset = function(path, options) {
      var updates;
      updates = {};
      updates[path] = void 0;
      return this.set(updates, options);
    };

    Settings.prototype.pathValuePairs = function() {
      var ans, normalize, visit;
      ans = [];
      normalize = function(path) {
        if (path[0] === ".") {
          return path.substring(1);
        } else {
          return path;
        }
      };
      visit = function(value, path) {
        var i, k, v, _i, _len, _results, _results1;
        if (path == null) {
          path = "";
        }
        if (Myna.isArray(value)) {
          _results = [];
          for (v = _i = 0, _len = value.length; _i < _len; v = ++_i) {
            i = value[v];
            _results.push(visit(v, path + "[" + i + "]"));
          }
          return _results;
        } else if (Myna.isObject(value)) {
          _results1 = [];
          for (k in value) {
            v = value[k];
            _results1.push(visit(v, path + "." + k));
          }
          return _results1;
        } else {
          return ans.push({
            path: normalize(path),
            value: value
          });
        }
      };
      visit(this.data);
      return ans;
    };

    Settings.prototype.paths = function() {
      return _.map(this.pathValuePairs(), function(pvp) {
        return pvp.path;
      });
    };

    Settings.prototype.triggerChange = function(paths) {
      var path, prefix, _i, _j, _len, _len1, _ref;
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        _ref = path.prefixes();
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          prefix = _ref[_j];
          this.trigger("change:" + prefix, this.get(prefix));
        }
      }
      return this.trigger("change");
    };

    Settings.prototype.toJSON = function(options) {
      if (options == null) {
        options = {};
      }
      return this.data;
    };

    return Settings;

  })(Myna.Events);

}).call(this);

(function() {
  var decodeCookieValue, encodeCookieValue, exn, readCookie, readLocalStorage, removeCookie, removeLocalStorage, writeCookie, writeLocalStorage,
    _this = this;

  if (Myna.cache == null) {
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
    function Variant(options) {
      var _ref, _ref1, _ref2;
      if (options == null) {
        options = {};
      }
      this.id = (_ref = options.id) != null ? _ref : Myna.error("Myna.Variant.constructor", "no id in options", options);
      this.weight = (_ref1 = options.weight) != null ? _ref1 : Myna.error("Myna.Variant.constructor", "no weight in options", options);
      this.settings = new Myna.Settings((_ref2 = options.settings) != null ? _ref2 : {});
    }

    return Variant;

  })();

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Myna.BaseExperiment = (function(_super) {
    __extends(BaseExperiment, _super);

    function BaseExperiment(options) {
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
      BaseExperiment.__super__.constructor.call(this, options);
      Myna.log("Myna.BaseExperiment.constructor", options);
      this.uuid = (_ref = options.uuid) != null ? _ref : Myna.error("Myna.BaseExperiment.constructor", this.id, "no uuid in options", options);
      this.id = (_ref1 = options.id) != null ? _ref1 : Myna.error("Myna.BaseExperiment.constructor", this.id, "no id in options", options);
      this.settings = new Myna.Settings((_ref2 = options.settings) != null ? _ref2 : {});
      this.variants = {};
      _ref4 = (_ref3 = options.variants) != null ? _ref3 : [];
      for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
        data = _ref4[_i];
        this.variants[data.id] = new Myna.Variant(data);
      }
    }

    BaseExperiment.prototype.suggest = function(success, error) {
      var variants, _ref, _ref1;
      if (success == null) {
        success = (function() {});
      }
      if (error == null) {
        error = (function() {});
      }
      variants = this.loadVariantsForSuggest();
      Myna.log("Myna.BaseExperiment.suggest", this.id, (_ref = variants.variant) != null ? _ref.id : void 0, (_ref1 = variants.viewed) != null ? _ref1.id : void 0);
      this.viewVariant(Myna.extend({
        success: success,
        error: error
      }, variants));
    };

    BaseExperiment.prototype.loadVariantsForSuggest = function() {
      return {
        variant: this.randomVariant(),
        viewed: this.loadLastView()
      };
    };

    BaseExperiment.prototype.view = function(variantOrId, success, error) {
      var variants, _ref, _ref1;
      if (success == null) {
        success = (function() {});
      }
      if (error == null) {
        error = (function() {});
      }
      variants = this.loadVariantsForView(variantOrId);
      Myna.log("Myna.BaseExperiment.view", this.id, (_ref = variants.variant) != null ? _ref.id : void 0, (_ref1 = variants.viewed) != null ? _ref1.id : void 0);
      this.viewVariant(Myna.extend({
        success: success,
        error: error
      }, variants));
    };

    BaseExperiment.prototype.loadVariantsForView = function(variantOrId) {
      return {
        variant: variantOrId instanceof Myna.Variant ? variantOrId : this.variants[variantOrId],
        viewed: null
      };
    };

    BaseExperiment.prototype.viewVariant = function(options) {
      var error, success, variant, viewed, _ref, _ref1;
      variant = options.variant;
      viewed = options.viewed;
      success = (_ref = options.success) != null ? _ref : (function() {});
      error = (_ref1 = options.error) != null ? _ref1 : (function() {});
      Myna.log("Myna.BaseExperiment.viewVariant", this.id, variant != null ? variant.id : void 0, viewed != null ? viewed.id : void 0);
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

    BaseExperiment.prototype.saveVariantFromView = function(variant) {
      this.saveLastView(variant);
      return this.clearLastReward();
    };

    BaseExperiment.prototype.reward = function(amount, success, error) {
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
      Myna.log("Myna.BaseExperiment.reward", this.id, (_ref = variants.variant) != null ? _ref.id : void 0, (_ref1 = variants.rewarded) != null ? _ref1.id : void 0, amount);
      this.rewardVariant(Myna.extend({
        amount: amount,
        success: success,
        error: error
      }, variants));
    };

    BaseExperiment.prototype.loadVariantsForReward = function() {
      return {
        variant: this.loadLastView(),
        rewarded: this.loadLastReward()
      };
    };

    BaseExperiment.prototype.rewardVariant = function(options) {
      var amount, error, rewarded, success, variant, _ref, _ref1, _ref2,
        _this = this;
      if (options == null) {
        options = {};
      }
      Myna.log("Myna.BaseExperiment.rewardVariant", this.id, options);
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
            _this.saveVariantFromReward(variant);
            error.call(_this);
          });
        }
      } else {
        error(Myna.problem("no-variant"));
      }
    };

    BaseExperiment.prototype.saveVariantFromReward = function(variant) {
      this.clearLastView();
      return this.saveLastReward(variant);
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

    BaseExperiment.prototype.loadLastView = function() {
      return this.loadVariant('lastView');
    };

    BaseExperiment.prototype.saveLastView = function(variant) {
      this.saveVariant('lastView', variant);
      return this.clearVariant('lastReward');
    };

    BaseExperiment.prototype.clearLastView = function() {
      return this.clearVariant('lastView');
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
      var _this = this;
      return this.loadAndSave(function(saved) {
        Myna.log("Myna.BaseExperiment.saveVariant", _this.id, cacheKey, variant, saved);
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

  })(Myna.Events);

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
      this.saveVariantFromReward = __bind(this.saveVariantFromReward, this);
      this.loadVariantsForReward = __bind(this.loadVariantsForReward, this);
      this.saveVariantFromView = __bind(this.saveVariantFromView, this);
      this.loadVariantsForView = __bind(this.loadVariantsForView, this);
      this.loadVariantsForSuggest = __bind(this.loadVariantsForSuggest, this);
      this.sticky = __bind(this.sticky, this);
      _ref = Experiment.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Experiment.prototype.sticky = function() {
      return !!this.settings.get("myna.web.sticky", true);
    };

    Experiment.prototype.loadVariantsForSuggest = function() {
      var sticky;
      sticky = this.loadStickySuggestion();
      return {
        variant: sticky != null ? sticky : this.randomVariant(),
        viewed: sticky != null ? sticky : null
      };
    };

    Experiment.prototype.loadVariantsForView = function(variant) {
      return Experiment.__super__.loadVariantsForView.call(this, variant);
    };

    Experiment.prototype.saveVariantFromView = function(variant) {
      if (this.sticky()) {
        this.saveStickySuggestion(variant);
      }
      return Experiment.__super__.saveVariantFromView.call(this, variant);
    };

    Experiment.prototype.loadVariantsForReward = function() {
      if (this.sticky()) {
        return {
          variant: this.loadLastView(),
          rewarded: this.loadStickyReward()
        };
      } else {
        return Experiment.__super__.loadVariantsForReward.call(this);
      }
    };

    Experiment.prototype.saveVariantFromReward = function(variant) {
      if (this.sticky()) {
        this.saveStickyReward(variant);
      }
      return Experiment.__super__.saveVariantFromReward.call(this, variant);
    };

    Experiment.prototype.unstick = function() {
      Myna.log("Myna.Experiment.unstick", this.id);
      this.clearLastView();
      this.clearLastReward();
      this.clearStickySuggestion();
      return this.clearStickyReward();
    };

    Experiment.prototype.loadStickySuggestion = function() {
      if (this.sticky()) {
        return this.loadVariant('stickySuggestion');
      } else {
        return null;
      }
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
      if (this.sticky()) {
        return this.loadVariant('stickyReward');
      } else {
        return null;
      }
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
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Myna.Recorder = (function(_super) {
    __extends(Recorder, _super);

    function Recorder(client) {
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
      this.init = __bind(this.init, this);
      var _ref, _ref1;
      Recorder.__super__.constructor.call(this);
      Myna.log("Myna.Recorder.constructor", client);
      this.client = client;
      this.apiKey = (_ref = client.apiKey) != null ? _ref : Myna.error("Myna.Recorder.constructor", "no apiKey in options", options);
      this.apiRoot = (_ref1 = client.apiRoot) != null ? _ref1 : "//api.mynaweb.com";
      this.storageKey = client.settings.get("myna.web.storageKey", "myna");
      this.timeout = client.settings.get("myna.web.timeout", 1000);
      this.autoSync = client.settings.get("myna.web.autoSync", true);
      this.semaphore = 0;
      this.waiting = [];
    }

    Recorder.prototype.init = function() {
      var expt, id, _ref, _results;
      _ref = this.client.experiments;
      _results = [];
      for (id in _ref) {
        expt = _ref[id];
        _results.push(this.listenTo(expt));
      }
      return _results;
    };

    Recorder.prototype.listenTo = function(expt) {
      var _this = this;
      Myna.log("Myna.Recorder.listenTo", expt.id);
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
      Myna.log("Myna.Recorder.recordView", expt.id, variant.id);
      this.queueEvent({
        typename: "view",
        experiment: expt.uuid,
        variant: variant.id,
        timestamp: Myna.dateToString(new Date())
      });
      Myna.log("Myna.Recorder.recordReward", "aboutToSync", this.autoSync);
      if (this.autoSync) {
        return this.sync(success, error);
      } else {
        return success();
      }
    };

    Recorder.prototype.recordReward = function(expt, variant, amount, success, error) {
      if (success == null) {
        success = (function() {});
      }
      if (error == null) {
        error = (function() {});
      }
      Myna.log("Myna.Recorder.recordReward", expt.id, variant.id, amount);
      this.queueEvent({
        typename: "reward",
        experiment: expt.uuid,
        variant: variant.id,
        amount: amount,
        timestamp: Myna.dateToString(new Date())
      });
      Myna.log("Myna.Recorder.recordReward", "aboutToSync", this.autoSync);
      if (this.autoSync) {
        return this.sync(success, error);
      } else {
        return success();
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
        return Myna.log("Myna.Recorder.sync", "queued", this.waiting.length);
      } else {
        this.semaphore++;
        waiting = this.waiting;
        this.waiting = [];
        start = function() {
          var events;
          events = _this.clearQueuedEvents();
          Myna.log("Myna.Recorder.sync.start", events, waiting.length);
          if (_this.trigger('beforeSync', events) === false) {
            return finish([], events, true);
          } else {
            return syncAll(events, [], []);
          }
        };
        syncAll = function(events, successEvents, errorEvents) {
          var head, tail;
          Myna.log("Myna.Recorder.sync.syncAll", events, successEvents, errorEvents);
          if (events.length === 0) {
            return finish(successEvents, errorEvents);
          } else {
            head = events[0], tail = 2 <= events.length ? __slice.call(events, 1) : [];
            return syncOne(head, tail, successEvents, errorEvents);
          }
        };
        syncOne = function(event, otherEvents, successEvents, errorEvents) {
          var params;
          Myna.log("Myna.Recorder.sync.syncOne", event, otherEvents, successEvents, errorEvents);
          params = Myna.extend({}, event, {
            uuid: event.experiment.uuid,
            apikey: _this.apiKey
          });
          params = Myna.deleteKeys(params, 'experiment');
          return Myna.jsonp.request({
            url: "" + _this.apiRoot + "/v2/experiment/" + event.experiment + "/record",
            success: function() {
              return syncAll(otherEvents, successEvents.concat([event]), errorEvents);
            },
            error: function() {
              return syncAll(otherEvents, successEvents, errorEvents.concat([event]));
            },
            timeout: _this.timeout,
            params: params
          });
        };
        finish = function(successEvents, errorEvents, cancelled) {
          var item, _i, _j, _len, _len1;
          if (cancelled == null) {
            cancelled = false;
          }
          Myna.log("Myna.Recorder.sync.finish", successEvents, errorEvents, _this.waiting.length);
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
          if (!cancelled) {
            _this.trigger('sync', successEvents, errorEvents);
          }
          _this.semaphore--;
          if (!cancelled && _this.waiting.length > 0) {
            return _this.sync();
          }
        };
        return start();
      }
    };

    Recorder.prototype.queuedEvents = function() {
      var ans, _ref;
      ans = (_ref = this.load().queuedEvents) != null ? _ref : [];
      Myna.log("Myna.Recorder.queuedEvents", ans);
      return ans;
    };

    Recorder.prototype.queueEvent = function(event) {
      Myna.log("Myna.Recorder.queueEvent", event);
      return this.loadAndSave(function(saved) {
        var _ref;
        saved.queuedEvents = ((_ref = saved.queuedEvents) != null ? _ref : []).concat([event]);
        return saved;
      });
    };

    Recorder.prototype.requeueEvents = function(events) {
      Myna.log("Myna.Recorder.requeueEvents", events);
      return this.loadAndSave(function(saved) {
        var _ref;
        saved.queuedEvents = events.concat((_ref = saved.queuedEvents) != null ? _ref : []);
        return saved;
      });
    };

    Recorder.prototype.clearQueuedEvents = function() {
      var ans;
      Myna.log("Myna.Recorder.clearQueuedEvents");
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

  Myna.GoogleAnalytics = (function(_super) {
    __extends(GoogleAnalytics, _super);

    function GoogleAnalytics(client) {
      this.rewardMultiplier = __bind(this.rewardMultiplier, this);
      this.eventName = __bind(this.eventName, this);
      this.enabled = __bind(this.enabled, this);
      this.rewardEvent = __bind(this.rewardEvent, this);
      this.viewEvent = __bind(this.viewEvent, this);
      this.recordReward = __bind(this.recordReward, this);
      this.recordView = __bind(this.recordView, this);
      this.listenTo = __bind(this.listenTo, this);
      this.init = __bind(this.init, this);
      Myna.log("Myna.GoogleAnalytics.constructor", client);
      this.client = client;
    }

    GoogleAnalytics.prototype.init = function() {
      var expt, id, _ref, _results;
      _ref = this.client.experiments;
      _results = [];
      for (id in _ref) {
        expt = _ref[id];
        _results.push(this.listenTo(expt));
      }
      return _results;
    };

    GoogleAnalytics.prototype.listenTo = function(expt) {
      var _this = this;
      Myna.log("Myna.GoogleAnalytics.listenTo", expt.id);
      expt.on('recordView', function(variant, success, error) {
        return _this.recordView(expt, variant, success, error);
      });
      return expt.on('recordReward', function(variant, amount, success, error) {
        return _this.recordReward(expt, variant, amount, success, error);
      });
    };

    GoogleAnalytics.prototype.recordView = function(expt, variant, success, error) {
      if (success == null) {
        success = (function() {});
      }
      if (error == null) {
        error = (function() {});
      }
      Myna.log("Myna.GoogleAnalytics.recordView", expt, variant, success, error);
      if (this.enabled(expt)) {
        if (typeof _gaq !== "undefined" && _gaq !== null) {
          _gaq.push(this.viewEvent(expt, variant));
        }
      }
      return success();
    };

    GoogleAnalytics.prototype.recordReward = function(expt, variant, amount, success, error) {
      if (success == null) {
        success = (function() {});
      }
      if (error == null) {
        error = (function() {});
      }
      Myna.log("Myna.GoogleAnalytics.recordReward", expt, variant, success, error);
      if (this.enabled(expt)) {
        if (typeof _gaq !== "undefined" && _gaq !== null) {
          _gaq.push(this.rewardEvent(expt, variant, amount));
        }
      }
      return success();
    };

    GoogleAnalytics.prototype.viewEvent = function(expt, variant) {
      return ["_trackEvent", "myna", this.eventName(expt, "view"), variant.id, null, false];
    };

    GoogleAnalytics.prototype.rewardEvent = function(expt, variant, amount) {
      var m;
      m = this.rewardMultiplier(expt);
      return ["_trackEvent", "myna", this.eventName(expt, "reward"), variant.id, Math.round(m * amount), true];
    };

    GoogleAnalytics.prototype.enabled = function(expt) {
      return expt.settings.get("myna.web.googleAnalytics.enabled", true);
    };

    GoogleAnalytics.prototype.eventName = function(expt, event) {
      var _ref;
      return (_ref = expt.settings.get("myna.web.googleAnalytics." + event + "Event")) != null ? _ref : "" + expt.id + "-" + event;
    };

    GoogleAnalytics.prototype.rewardMultiplier = function(expt) {
      return expt.settings.get("myna.web.googleAnalytics.rewardMultiplier", 100);
    };

    return GoogleAnalytics;

  })(Myna.Events);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Myna.Client = (function() {
    function Client(options) {
      var expt, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
      if (options == null) {
        options = {};
      }
      this.reward = __bind(this.reward, this);
      this.view = __bind(this.view, this);
      this.suggest = __bind(this.suggest, this);
      Myna.log("Myna.Client.constructor", options);
      this.uuid = (_ref = options.uuid) != null ? _ref : null;
      this.apiKey = (_ref1 = options.apiKey) != null ? _ref1 : Myna.error("Myna.Deployment.constructor", "no apiKey in options", options);
      this.apiRoot = (_ref2 = options.apiRoot) != null ? _ref2 : "//api.mynaweb.com";
      this.settings = new Myna.Settings((_ref3 = options.settings) != null ? _ref3 : {});
      this.experiments = {};
      _ref5 = (_ref4 = options.experiments) != null ? _ref4 : [];
      for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
        expt = _ref5[_i];
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
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  Myna.Binder = (function() {
    function Binder(client) {
      this.createClickHandler = __bind(this.createClickHandler, this);
      this.bindGoal = __bind(this.bindGoal, this);
      this.bindBind = __bind(this.bindBind, this);
      this.bindShow = __bind(this.bindShow, this);
      this.unbind = __bind(this.unbind, this);
      this.bind = __bind(this.bind, this);
      this.detect = __bind(this.detect, this);
      this.listenTo = __bind(this.listenTo, this);
      this.init = __bind(this.init, this);
      Myna.log("Myna.Binder.constructor", client);
      this.client = client;
      this.boundHandlers = [];
    }

    Binder.prototype.init = function(options) {
      var expt, id, variantId, _ref;
      if (options == null) {
        options = {};
      }
      _ref = this.client.experiments;
      for (id in _ref) {
        expt = _ref[id];
        if (options.all || this.detect(expt)) {
          this.listenTo(expt);
          variantId = Myna.hashParams[expt.id];
          if (variantId && expt.variants[variantId]) {
            expt.view(variantId);
          } else {
            expt.suggest();
          }
        }
      }
    };

    Binder.prototype.listenTo = function(expt) {
      var _this = this;
      Myna.log("Myna.Binder.listenTo", expt);
      return expt.on('view', function(variant) {
        return _this.bind(expt, variant);
      });
    };

    Binder.prototype.detect = function(expt) {
      var cssClass, _ref;
      cssClass = (_ref = expt.settings.get("myna.html.cssClass")) != null ? _ref : "myna-" + expt.id;
      return Myna.$("." + cssClass).length > 0;
    };

    Binder.prototype.bind = function(expt, variant) {
      var allElems, bindElems, cssClass, dataBind, dataGoal, dataPrefix, dataShow, goalElems, showElems, _ref, _ref1,
        _this = this;
      Myna.log("Myna.Binder.bind", expt);
      this.unbind();
      cssClass = (_ref = expt.settings.get("myna.html.cssClass")) != null ? _ref : "myna-" + expt.id;
      dataPrefix = (_ref1 = expt.settings.get("myna.html.dataPrefix")) != null ? _ref1 : null;
      dataShow = dataPrefix ? "" + this.dataPrefix + "-show" : "show";
      dataBind = dataPrefix ? "" + this.dataPrefix + "-bind" : "bind";
      dataGoal = dataPrefix ? "" + this.dataPrefix + "-goal" : "goal";
      Myna.log("Myna.Binder.bind", "searchParams", cssClass, dataShow, dataBind, dataGoal);
      allElems = cssClass ? Myna.$("." + cssClass) : null;
      showElems = cssClass ? allElems.filter("[data-" + dataShow + "]") : Myna.$("[data-" + dataShow + "]");
      bindElems = cssClass ? allElems.filter("[data-" + dataBind + "]") : Myna.$("[data-" + dataBind + "]");
      goalElems = cssClass ? allElems.filter("[data-" + dataGoal + "]") : Myna.$("[data-" + dataGoal + "]");
      Myna.log("Myna.Binder.bind", "elements", allElems, showElems, bindElems, goalElems);
      showElems.each(function(index, elem) {
        return _this.bindShow(expt, variant, dataShow, elem);
      });
      bindElems.each(function(index, elem) {
        return _this.bindBind(expt, variant, dataBind, elem);
      });
      return goalElems.each(function(index, elem) {
        return _this.bindGoal(expt, variant, dataGoal, elem);
      });
    };

    Binder.prototype.unbind = function() {
      var elem, event, handler, _i, _len, _ref, _ref1, _results;
      Myna.log("Myna.Binder.unbind", this.boundHandlers);
      _ref = this.boundHandlers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref1 = _ref[_i], elem = _ref1[0], event = _ref1[1], handler = _ref1[2];
        Myna.log("Myna.Binder.unbind", elem, event, handler);
        _results.push(Myna.$(elem).off(event, handler));
      }
      return _results;
    };

    Binder.prototype.bindShow = function(expt, variant, dataAttr, elem) {
      var path, self;
      Myna.log("Myna.Binder.bindShow", expt, dataAttr, elem);
      self = Myna.$(elem);
      path = self.data(dataAttr);
      if (variant.id === path || variant.settings.get(path)) {
        return self.show();
      } else {
        return self.hide();
      }
    };

    Binder.prototype.bindBind = function(expt, variant, dataAttr, elem) {
      var attrString, lhs, rhs, rhsValue, self, _ref;
      Myna.log("Myna.Binder.bindBind", expt, dataAttr, elem);
      self = Myna.$(elem);
      attrString = self.data(dataAttr);
      _ref = attrString.split("="), lhs = _ref[0], rhs = _ref[1];
      rhsValue = rhs ? variant.settings.get(rhs, "") : variant.id;
      if (!lhs) {
        return;
      }
      switch (lhs) {
        case "text":
          return self.text(rhsValue);
        case "html":
          return self.html(rhsValue);
        case "class":
          return self.addClass(rhsValue);
        default:
          if (lhs[0] === "@") {
            return self.attr(lhs.substring(1), rhsValue);
          }
      }
    };

    Binder.prototype.bindGoal = function(expt, variant, dataAttr, elem) {
      var event, handler, self,
        _this = this;
      Myna.log("Myna.Binder.bindGoal", expt, dataAttr, elem);
      self = Myna.$(elem);
      event = self.data(dataAttr);
      if (!event) {
        return;
      }
      switch (event) {
        case "load":
          return Myna.$(function() {
            return expt.reward();
          });
        case "click":
          handler = this.createClickHandler(expt);
          this.boundHandlers.push([elem, "click", handler]);
          Myna.log("Myna.Binder.bindGoal", "attach", elem, "click", handler, this.boundHandlers);
          return self.on("click", handler);
      }
    };

    Binder.prototype.createClickHandler = function(expt, innerHandler) {
      var handler;
      if (innerHandler == null) {
        innerHandler = (function() {});
      }
      Myna.log("Myna.Binder.createClickHandler", expt, innerHandler);
      return handler = function() {
        var args, complete, elem, evt, rewarded, self;
        evt = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        Myna.log.apply(Myna, ["Myna.Binder.clickHandler", evt].concat(__slice.call(args)));
        elem = this;
        self = Myna.$(elem);
        rewarded = expt.loadStickyReward() || expt.loadLastReward();
        if (rewarded != null) {
          Myna.log("Myna.Binder.clickHandler", "pass-through");
          innerHandler.call.apply(innerHandler, [this, evt].concat(__slice.call(args)));
        } else {
          Myna.log("Myna.Binder.clickHandler", "pass-through");
          evt.stopPropagation();
          evt.preventDefault();
          complete = function() {
            if (elem[evt.type]) {
              window.setTimeout((function() {
                return elem[evt.type]();
              }), 0);
            } else {
              self.trigger(evt.type);
            }
          };
          expt.reward(1.0, complete, complete);
        }
      };
    };

    return Binder;

  })();

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Myna.Inspector = (function() {
    function Inspector(client, binder) {
      if (binder == null) {
        binder = null;
      }
      this.addExperiment = __bind(this.addExperiment, this);
      this.initInspector = __bind(this.initInspector, this);
      this.initNavbar = __bind(this.initNavbar, this);
      this.initStylesheet = __bind(this.initStylesheet, this);
      this.remove = __bind(this.remove, this);
      this.init = __bind(this.init, this);
      Myna.log("Myna.Inspector.constructor");
      this.client = client;
      this.binder = binder;
    }

    Inspector.prototype.init = function() {
      var expt, id, _ref;
      Myna.log("Myna.Inspector.init");
      this.initStylesheet();
      this.initInspector();
      this.initNavbar();
      Myna.cache.save("myna-inspector", {
        visible: true
      });
      _ref = this.client.experiments;
      for (id in _ref) {
        expt = _ref[id];
        if (this.binder === null || this.binder.detect(expt)) {
          this.addExperiment(expt);
        }
      }
    };

    Inspector.prototype.remove = function() {
      window.location.hash = "";
      Myna.cache.remove("myna-inspector");
      return window.location.reload();
    };

    Inspector.prototype.initStylesheet = function() {
      Myna.log("Myna.Inspector.initStylesheet");
      if (!this.stylesheet) {
        this.stylesheet = Myna.$("<style id=\"myna-stylesheet\">\n  html {\n    margin-top: 40px;\n  }\n\n  /* Clearfix */\n\n  .myna-overlay-inner {\n    *zoom: 1;\n  }\n\n  .myna-overlay-inner:before,\n  .myna-overlay-inner:after {\n    display: table;\n    content: \"\";\n    line-height: 0;\n  }\n\n  .myna-overlay-inner:after {\n    clear: both;\n  }\n\n  /* Structure */\n\n  .myna-overlay-inner {\n    font-size: 16px;\n    line-height: 20px;\n  }\n\n  .myna-overlay-inner .pull-left {\n    float: left;\n  }\n\n  .myna-overlay-inner .pull-right {\n    float: right;\n  }\n\n  .myna-overlay-title {\n    padding: 5px 10px;\n    cursor: pointer;\n    font-weight: bold;\n    line-height: 150%;\n  }\n\n  .myna-overlay-field {\n    padding: 0 10px 5px;\n    white-space: nowrap;\n  }\n\n  .myna-overlay-inner label,\n  .myna-overlay-inner select,\n  .myna-overlay-inner button {\n    display: inline-block;\n    box-sizing: border-box;\n    height: 30px;\n    margin: 0 5px;\n    padding: 0 8px;\n    font-size: 16px;\n    line-height: 30px;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n    -webkit-border-radius: 5px;\n    -moz-border-radius: 5px;\n    border-radius: 5px;\n  }\n\n  .myna-overlay-inner label {\n    width: 160px;\n    padding: 0;\n  }\n\n  .myna-overlay-inner select {\n    width: 200px;\n  }\n\n  /* Navbar specifics */\n\n  #myna-navbar {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n  }\n\n  #myna-navbar .myna-overlay-inner {\n    padding: 5px 10px;\n  }\n\n  /* Inspector specifics */\n\n  #myna-inspector {\n    position: fixed;\n    bottom: 20px;\n    right: 20px;\n    -webkit-border-radius: 10px;\n    -moz-border-radius: 10px;\n    border-radius: 10px;\n  }\n\n  #myna-inspector .myna-overlay-inner {\n    padding: 0 0 5px;\n  }\n\n  /* Highlight */\n\n  .myna-inspector-highlight-hover,\n  .myna-inspector-highlight-toggle {\n    outline: 5px solid #55f;\n  }\n\n  /* Themes */\n\n  .myna-overlay-outer {\n    -webkit-box-shadow: 0px 0px 10px rgba(50, 50, 50, 0.5);\n    -moz-box-shadow:    0px 0px 10px rgba(50, 50, 50, 0.5);\n    box-shadow:         0px 0px 10px rgba(50, 50, 50, 0.5);\n  }\n\n  .myna-overlay-outer {\n    background: #000;\n    background: rgba(0, 0, 0, 0.75);\n    color: #fff;\n  }\n\n  .myna-overlay-inner select,\n  .myna-overlay-inner button {\n    background: #333;\n    background: -moz-linear-gradient(top, #444 0%, #222 100%);\n    background: -webkit-linear-gradient(top, #444 0%, #222 100%);\n    background: -o-linear-gradient(top, #444 0%, #222 100%);\n    background: -ms-linear-gradient(top, #444 0%, #222 100%);\n    background: linear-gradient(to bottom, #444 0%, #222 100%);\n    border: 1px solid #555;\n    color: #fff;\n  }\n\n  .myna-overlay-inner select.active,\n  .myna-overlay-inner button.active,\n  .myna-overlay-inner select:active,\n  .myna-overlay-inner button:active {\n    background: -moz-linear-gradient(top, #222 0%, #444 100%);\n    background: -webkit-linear-gradient(top, #222 0%, #444 100%);\n    background: -o-linear-gradient(top, #222 0%, #444 100%);\n    background: -ms-linear-gradient(top, #222 0%, #444 100%);\n    background: linear-gradient(to bottom, #222 0%, #444 100%);\n  }\n\n  .myna-overlay-outer a {\n    color: #fff;\n    text-decoration: none;\n  }\n\n  .myna-overlay-outer.myna-overlay-light {\n    background: #fff;\n    background: rgba(255, 255, 255, 0.75);\n    color: #000;\n  }\n\n  .myna-overlay-outer.myna-overlay-light a {\n    color: #000;\n    text-decoration: none;\n  }\n</style>").appendTo("head");
      }
    };

    Inspector.prototype.initNavbar = function() {
      var brand, closeButton, inner, inspectorButton, left, right,
        _this = this;
      Myna.log("Myna.Inspector.initNavbar");
      if (!this.Inspector) {
        this.navbar = Myna.$("<div id='myna-navbar' class='myna-overlay-outer'>").appendTo("body");
        inner = Myna.$("<div class='myna-overlay-inner'>").appendTo(this.navbar);
        left = Myna.$("<div class='pull-left'>").appendTo(inner);
        brand = Myna.$("<label><a href='http://mynaweb.com'>Myna</a></label>").appendTo(left);
        right = Myna.$("<div class='pull-right'>").appendTo(inner);
        inspectorButton = Myna.$("<button class='inspector'>").text(this.inspector.is(":visible") ? 'Hide inspector' : 'Show inspector').appendTo(right);
        closeButton = Myna.$("<button class='close'>Close</button>").appendTo(right);
        inspectorButton.on('click', function() {
          if (_this.inspector.is(":visible")) {
            _this.inspector.hide();
            return inspectorButton.text('Show inspector');
          } else {
            _this.inspector.show();
            return inspectorButton.text('Hide inspector');
          }
        });
        closeButton.on('click', function() {
          Myna.setPreview(false);
          return _this.remove();
        });
      }
    };

    Inspector.prototype.initInspector = function() {
      var inspectorSize, lastMousePos, mouseMove,
        _this = this;
      Myna.log("Myna.Inspector.initInspector");
      if (!this.inspector) {
        this.inspector = Myna.$("<div id='myna-inspector' class='myna-overlay-outer'>").appendTo("body");
        this.inspectorInner = Myna.$("<div class='myna-overlay-inner'>").appendTo(this.inspector);
        this.inspectorTitle = Myna.$("<div class='myna-overlay-title'>Experiments</div>").appendTo(this.inspectorInner);
        lastMousePos = null;
        inspectorSize = null;
        mouseMove = function(evt) {
          var currMousePos, inspectorPos;
          evt.stopPropagation();
          evt.preventDefault();
          Myna.log("Myna.Inspector.initInspector.mouseMove", evt, lastMousePos);
          currMousePos = {
            x: evt.clientX,
            y: evt.clientY
          };
          inspectorPos = _this.inspector.position();
          _this.inspector.css({
            top: inspectorPos.top + currMousePos.y - lastMousePos.y,
            left: inspectorPos.left + currMousePos.x - lastMousePos.x,
            bottom: "auto",
            right: "auto",
            width: inspectorSize.width,
            height: inspectorSize.height
          });
          return lastMousePos = currMousePos;
        };
        this.inspectorTitle.on('mousedown', function(evt) {
          evt.stopPropagation();
          evt.preventDefault();
          Myna.log("Myna.Inspector.initInspector.mouseDown", evt, lastMousePos);
          lastMousePos = {
            x: evt.clientX,
            y: evt.clientY
          };
          if (inspectorSize == null) {
            inspectorSize = _this.inspector.size();
          }
          return Myna.$('html').on('mousemove', mouseMove);
        });
        this.inspectorTitle.on('mouseup', function(evt) {
          evt.stopPropagation();
          evt.preventDefault();
          Myna.log("Myna.Inspector.initInspector.mouseUp", evt, lastMousePos);
          return Myna.$('html').off('mousemove', mouseMove);
        });
      }
    };

    Inspector.prototype.addExperiment = function(expt) {
      var cssClass, label, rewardButton, showButton, suggestButton, unstickButton, variant, variantId, variantSelect, wrapper, _ref, _ref1,
        _this = this;
      Myna.log("Myna.Inspector.addExperiment", expt);
      wrapper = Myna.$("<div class='myna-overlay-field'>").appendTo(this.inspectorInner);
      label = Myna.$("<label>").text(expt.id).appendTo(wrapper);
      variantSelect = Myna.$("<select>").appendTo(wrapper);
      showButton = Myna.$("<button>").text("Show").appendTo(wrapper);
      suggestButton = Myna.$("<button>").text("Suggest").appendTo(wrapper);
      rewardButton = Myna.$("<button>").text("Reward").attr("disabled", (typeof expt.sticky === "function" ? expt.sticky() : void 0) == null).appendTo(wrapper);
      unstickButton = Myna.$("<button>").text("Unstick").attr("disabled", (typeof expt.sticky === "function" ? expt.sticky() : void 0) == null).appendTo(wrapper);
      _ref = expt.variants;
      for (variantId in _ref) {
        variant = _ref[variantId];
        Myna.$("<option>").attr("value", variantId).text("View " + variantId).appendTo(variantSelect);
      }
      variantSelect.on("change", function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        expt.view(variantSelect.find("option:selected").attr("value"));
      });
      cssClass = (_ref1 = expt.settings.get("myna.html.cssClass")) != null ? _ref1 : "myna-" + expt.id;
      showButton.on('click', function(evt) {
        var self;
        self = Myna.$(this);
        if (self.is(".active")) {
          self.removeClass("active");
          return Myna.$("." + cssClass).removeClass("myna-inspector-highlight-toggle");
        } else {
          Myna.$("." + cssClass).addClass("myna-inspector-highlight-toggle");
          return self.addClass("active");
        }
      });
      wrapper.hover(function() {
        return Myna.$("." + cssClass).addClass("myna-inspector-highlight-hover");
      }, function() {
        return Myna.$("." + cssClass).removeClass("myna-inspector-highlight-hover");
      });
      suggestButton.on("click", function(evt) {
        expt.suggest();
      });
      rewardButton.on("click", function(evt) {
        expt.reward();
      });
      unstickButton.on("click", function(evt) {
        expt.unstick();
      });
      expt.on('view', function(variant) {
        Myna.log(" - inspector view", variant);
        variantSelect.find("[value=" + variant.id + "]").prop("selected", true);
      });
    };

    return Inspector;

  })();

}).call(this);

(function() {
  Myna.init = function(options) {
    Myna.log("Myna.init", options);
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
    Myna.log("Myna.init", options);
    apiKey = (_ref = options.apiKey) != null ? _ref : Myna.error("Myna.init", "no apiKey in options", options);
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
    Myna.binder = new Myna.Binder(Myna.client);
    if (Myna.preview()) {
      Myna.inspector = new Myna.Inspector(Myna.client, Myna.binder);
      Myna.$(function() {
        Myna.inspector.init();
        return Myna.binder.init();
      });
    } else {
      Myna.recorder = new Myna.Recorder(Myna.client);
      Myna.recorder.init();
      Myna.googleAnalytics = new Myna.GoogleAnalytics(Myna.client);
      Myna.googleAnalytics.init();
      Myna.$(function() {
        return Myna.binder.init();
      });
    }
    return Myna.client;
  };

  Myna.initRemote = function(options) {
    var error, success, url, _ref, _ref1, _ref2;
    Myna.log("Myna.initRemote", options);
    url = (_ref = options.url) != null ? _ref : Myna.error("Myna.Client.initRemote", "no url specified in options", options);
    success = (_ref1 = options.success) != null ? _ref1 : (function() {});
    error = (_ref2 = options.error) != null ? _ref2 : (function() {});
    Myna.jsonp.request({
      url: url,
      success: function(json) {
        Myna.log("Myna.initRemote", "response", json);
        return success(Myna.initLocal(json));
      },
      error: error
    });
  };

}).call(this);
