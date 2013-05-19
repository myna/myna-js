/*! myna - v2.0.0 - 2013-05-19 - http://mynaweb.com/
* Copyright (c) 2013 Noel Welsh; Licensed BSD 2-Clause */(function() {
  var _ref,
    __slice = [].slice;

  if ((_ref = window.Myna) == null) {
    window.Myna = {};
  }

  Myna.log = function() {
    var args, item, _ref1;

    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
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
  };

  Myna.error = function() {
    var args;

    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    throw args;
  };

  Myna.extend = function(des, src) {
    var key, value;

    for (key in src) {
      value = src[key];
      if (!des[key]) {
        des[key] = value;
      }
    }
    return des;
  };

}).call(this);

(function() {


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
  var _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Myna.BaseExperiment = (function() {
    function BaseExperiment(options) {
      var data, id, variant, _ref, _ref1, _ref2, _ref3, _ref4;

      if (options == null) {
        options = {};
      }
      this.save = __bind(this.save, this);
      this.load = __bind(this.load, this);
      this.loadAndSave = __bind(this.loadAndSave, this);
      this.enqueueReward = __bind(this.enqueueReward, this);
      this.enqueueView = __bind(this.enqueueView, this);
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
      this.randomVariant = __bind(this.randomVariant, this);
      this.totalWeight = __bind(this.totalWeight, this);
      this.rewardVariant = __bind(this.rewardVariant, this);
      this.reward = __bind(this.reward, this);
      this.view = __bind(this.view, this);
      this.suggest = __bind(this.suggest, this);
      Myna.log("Myna.BaseExperiment.constructor", options);
      this.uuid = (_ref = options.uuid) != null ? _ref : Myna.error("Myna.Experiment.constructor", this.id, "no UUID in options", options);
      this.id = (_ref1 = options.id) != null ? _ref1 : Myna.error("Myna.Experiment.constructor", this.id, "no ID in options", options);
      this.settings = new Myna.Settings((_ref2 = options.settings) != null ? _ref2 : {});
      this.variants = {};
      _ref4 = (_ref3 = options.variants) != null ? _ref3 : {};
      for (id in _ref4) {
        data = _ref4[id];
        variant = new Myna.Variant(id, data);
        this.variants[id] = variant;
      }
    }

    BaseExperiment.prototype.suggest = function(success, error) {
      var exn, variant;

      if (success == null) {
        success = (function() {});
      }
      if (error == null) {
        error = (function() {});
      }
      try {
        Myna.log("Myna.BaseExperiment.suggest", this.id);
        variant = this.randomVariant();
        return this.view(variant.id, success, error);
      } catch (_error) {
        exn = _error;
        return this.error(exn);
      }
    };

    BaseExperiment.prototype.view = function(variantId, success, error) {
      var exn, variant;

      if (success == null) {
        success = (function() {});
      }
      if (error == null) {
        error = (function() {});
      }
      try {
        Myna.log("Myna.BaseExperiment.view", this.id, variantId);
        variant = this.variants[variantId];
        this.saveLastSuggestion(variant);
        this.clearLastReward();
        this.enqueueView(variant);
        return success(variant);
      } catch (_error) {
        exn = _error;
        return error(exn);
      }
    };

    BaseExperiment.prototype.reward = function(amount, success, error) {
      var exn, variant;

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
          return this.rewardVariant(variant, amount, success, error);
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
      Myna.log("Myna.BaseExperiment.clearQueuedEvents", this.id);
      return this.loadAndSave(function(saved) {
        delete saved.queuedEvents;
        return saved;
      });
    };

    BaseExperiment.prototype.enqueueEvent = function(evt) {
      Myna.log("Myna.BaseExperiment.enqueueEvent", this.id, JSON.stringify(evt));
      return this.loadAndSave(function(saved) {
        if (saved.queuedEvents != null) {
          saved.queuedEvents.push(evt);
        } else {
          saved.queuedEvents = [evt];
        }
        return saved;
      });
    };

    BaseExperiment.prototype.enqueueView = function(variant) {
      Myna.log("Myna.BaseExperiment.enqueueView", this.id, variant);
      return this.enqueueEvent({
        typename: "view",
        variant: variant.id,
        timestamp: new Date().getTime()
      });
    };

    BaseExperiment.prototype.enqueueReward = function(variant, amount) {
      Myna.log("Myna.BaseExperiment.enqueueReward", this.id, variant, amount);
      return this.enqueueEvent({
        typename: "reward",
        variant: variant.id,
        amount: amount,
        timestamp: new Date().getTime()
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
      var exn, suggested, variant;

      if (success == null) {
        success = (function() {});
      }
      if (error == null) {
        error = (function() {});
      }
      try {
        Myna.log("Myna.Experiment.suggest", this.id);
        if (this.sticky()) {
          suggested = this.loadStickySuggestion();
          variant = suggested != null ? suggested : this.randomVariant();
          if (suggested == null) {
            this.saveStickySuggestion(variant);
          }
        } else {
          suggested = null;
          variant = this.randomVariant();
        }
        if (suggested != null) {
          return success(suggested);
        } else if (variant != null) {
          return this.view(variant.id, success, error);
        } else {
          return error();
        }
      } catch (_error) {
        exn = _error;
        return error(exn);
      }
    };

    Experiment.prototype.reward = function(amount, success, error) {
      var exn, rewarded, variant;

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
        if (this.sticky()) {
          rewarded = this.loadStickyReward();
          variant = rewarded != null ? rewarded : this.loadLastSuggestion();
          if (rewarded == null) {
            this.saveStickyReward(variant);
          }
        } else {
          rewarded = null;
          variant = this.loadLastSuggestion();
        }
        if (rewarded != null) {
          return success();
        } else if (variant != null) {
          return this.rewardVariant(variant, amount, success, error);
        } else {
          return error();
        }
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
