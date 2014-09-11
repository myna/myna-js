/*! Myna v3.0.0 - 2014-09-11
 * http://mynaweb.com
 * Copyright (c) 2014 Myna Limited; Licensed BSD 2-Clause
 */
!function(a) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = a(); else if ("function" == typeof define && define.amd) define([], a); else {
        var b;
        "undefined" != typeof window ? b = window : "undefined" != typeof global ? b = global : "undefined" != typeof self && (b = self), 
        b.Myna = a();
    }
}(function() {
    return function a(b, c, d) {
        function e(g, h) {
            if (!c[g]) {
                if (!b[g]) {
                    var i = "function" == typeof require && require;
                    if (!h && i) return i(g, !0);
                    if (f) return f(g, !0);
                    var j = new Error("Cannot find module '" + g + "'");
                    throw j.code = "MODULE_NOT_FOUND", j;
                }
                var k = c[g] = {
                    exports: {}
                };
                b[g][0].call(k.exports, function(a) {
                    var c = b[g][1][a];
                    return e(c ? c : a);
                }, k, k.exports, a, b, c, d);
            }
            return c[g].exports;
        }
        for (var f = "function" == typeof require && require, g = 0; g < d.length; g++) e(d[g]);
        return e;
    }({
        "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/main.js": [ function(a, b, c) {
            "use strict";
            var d = a("./promise/promise").Promise, e = a("./promise/polyfill").polyfill;
            c.Promise = d, c.polyfill = e;
        }, {
            "./promise/polyfill": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/polyfill.js",
            "./promise/promise": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/promise.js"
        } ],
        "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/all.js": [ function(a, b, c) {
            "use strict";
            function d(a) {
                var b = this;
                if (!e(a)) throw new TypeError("You must pass an array to all.");
                return new b(function(b, c) {
                    function d(a) {
                        return function(b) {
                            e(a, b);
                        };
                    }
                    function e(a, c) {
                        h[a] = c, 0 === --i && b(h);
                    }
                    var g, h = [], i = a.length;
                    0 === i && b([]);
                    for (var j = 0; j < a.length; j++) g = a[j], g && f(g.then) ? g.then(d(j), c) : e(j, g);
                });
            }
            var e = a("./utils").isArray, f = a("./utils").isFunction;
            c.all = d;
        }, {
            "./utils": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/utils.js"
        } ],
        "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/asap.js": [ function(a, b, c) {
            (function(a, b) {
                "use strict";
                function d() {
                    return function() {
                        a.nextTick(g);
                    };
                }
                function e() {
                    var a = 0, b = new k(g), c = document.createTextNode("");
                    return b.observe(c, {
                        characterData: !0
                    }), function() {
                        c.data = a = ++a % 2;
                    };
                }
                function f() {
                    return function() {
                        l.setTimeout(g, 1);
                    };
                }
                function g() {
                    for (var a = 0; a < m.length; a++) {
                        var b = m[a], c = b[0], d = b[1];
                        c(d);
                    }
                    m = [];
                }
                function h(a, b) {
                    var c = m.push([ a, b ]);
                    1 === c && i();
                }
                var i, j = "undefined" != typeof window ? window : {}, k = j.MutationObserver || j.WebKitMutationObserver, l = "undefined" != typeof b ? b : void 0 === this ? window : this, m = [];
                i = "undefined" != typeof a && "[object process]" === {}.toString.call(a) ? d() : k ? e() : f(), 
                c.asap = h;
            }).call(this, a("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
        }, {
            _process: "/Users/dave/dev/projects/myna-js/node_modules/grunt-browserify/node_modules/browserify/node_modules/process/browser.js"
        } ],
        "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/config.js": [ function(a, b, c) {
            "use strict";
            function d(a, b) {
                return 2 !== arguments.length ? e[a] : void (e[a] = b);
            }
            var e = {
                instrument: !1
            };
            c.config = e, c.configure = d;
        }, {} ],
        "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/polyfill.js": [ function(a, b, c) {
            (function(b) {
                "use strict";
                function d() {
                    var a;
                    a = "undefined" != typeof b ? b : "undefined" != typeof window && window.document ? window : self;
                    var c = "Promise" in a && "resolve" in a.Promise && "reject" in a.Promise && "all" in a.Promise && "race" in a.Promise && function() {
                        var b;
                        return new a.Promise(function(a) {
                            b = a;
                        }), f(b);
                    }();
                    c || (a.Promise = e);
                }
                var e = a("./promise").Promise, f = a("./utils").isFunction;
                c.polyfill = d;
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
        }, {
            "./promise": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/promise.js",
            "./utils": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/utils.js"
        } ],
        "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/promise.js": [ function(a, b, c) {
            "use strict";
            function d(a) {
                if (!q(a)) throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");
                if (!(this instanceof d)) throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
                this._subscribers = [], e(a, this);
            }
            function e(a, b) {
                function c(a) {
                    j(b, a);
                }
                function d(a) {
                    l(b, a);
                }
                try {
                    a(c, d);
                } catch (e) {
                    d(e);
                }
            }
            function f(a, b, c, d) {
                var e, f, g, h, k = q(c);
                if (k) try {
                    e = c(d), g = !0;
                } catch (m) {
                    h = !0, f = m;
                } else e = d, g = !0;
                i(b, e) || (k && g ? j(b, e) : h ? l(b, f) : a === y ? j(b, e) : a === z && l(b, e));
            }
            function g(a, b, c, d) {
                var e = a._subscribers, f = e.length;
                e[f] = b, e[f + y] = c, e[f + z] = d;
            }
            function h(a, b) {
                for (var c, d, e = a._subscribers, g = a._detail, h = 0; h < e.length; h += 3) c = e[h], 
                d = e[h + b], f(b, c, d, g);
                a._subscribers = null;
            }
            function i(a, b) {
                var c, d = null;
                try {
                    if (a === b) throw new TypeError("A promises callback cannot return that same promise.");
                    if (p(b) && (d = b.then, q(d))) return d.call(b, function(d) {
                        return c ? !0 : (c = !0, void (b !== d ? j(a, d) : k(a, d)));
                    }, function(b) {
                        return c ? !0 : (c = !0, void l(a, b));
                    }), !0;
                } catch (e) {
                    return c ? !0 : (l(a, e), !0);
                }
                return !1;
            }
            function j(a, b) {
                a === b ? k(a, b) : i(a, b) || k(a, b);
            }
            function k(a, b) {
                a._state === w && (a._state = x, a._detail = b, o.async(m, a));
            }
            function l(a, b) {
                a._state === w && (a._state = x, a._detail = b, o.async(n, a));
            }
            function m(a) {
                h(a, a._state = y);
            }
            function n(a) {
                h(a, a._state = z);
            }
            var o = a("./config").config, p = (a("./config").configure, a("./utils").objectOrFunction), q = a("./utils").isFunction, r = (a("./utils").now, 
            a("./all").all), s = a("./race").race, t = a("./resolve").resolve, u = a("./reject").reject, v = a("./asap").asap;
            o.async = v;
            var w = void 0, x = 0, y = 1, z = 2;
            d.prototype = {
                constructor: d,
                _state: void 0,
                _detail: void 0,
                _subscribers: void 0,
                then: function(a, b) {
                    var c = this, d = new this.constructor(function() {});
                    if (this._state) {
                        var e = arguments;
                        o.async(function() {
                            f(c._state, d, e[c._state - 1], c._detail);
                        });
                    } else g(this, d, a, b);
                    return d;
                },
                "catch": function(a) {
                    return this.then(null, a);
                }
            }, d.all = r, d.race = s, d.resolve = t, d.reject = u, c.Promise = d;
        }, {
            "./all": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/all.js",
            "./asap": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/asap.js",
            "./config": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/config.js",
            "./race": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/race.js",
            "./reject": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/reject.js",
            "./resolve": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/resolve.js",
            "./utils": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/utils.js"
        } ],
        "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/race.js": [ function(a, b, c) {
            "use strict";
            function d(a) {
                var b = this;
                if (!e(a)) throw new TypeError("You must pass an array to race.");
                return new b(function(b, c) {
                    for (var d, e = 0; e < a.length; e++) d = a[e], d && "function" == typeof d.then ? d.then(b, c) : b(d);
                });
            }
            var e = a("./utils").isArray;
            c.race = d;
        }, {
            "./utils": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/utils.js"
        } ],
        "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/reject.js": [ function(a, b, c) {
            "use strict";
            function d(a) {
                var b = this;
                return new b(function(b, c) {
                    c(a);
                });
            }
            c.reject = d;
        }, {} ],
        "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/resolve.js": [ function(a, b, c) {
            "use strict";
            function d(a) {
                if (a && "object" == typeof a && a.constructor === this) return a;
                var b = this;
                return new b(function(b) {
                    b(a);
                });
            }
            c.resolve = d;
        }, {} ],
        "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/utils.js": [ function(a, b, c) {
            "use strict";
            function d(a) {
                return e(a) || "object" == typeof a && null !== a;
            }
            function e(a) {
                return "function" == typeof a;
            }
            function f(a) {
                return "[object Array]" === Object.prototype.toString.call(a);
            }
            var g = Date.now || function() {
                return new Date().getTime();
            };
            c.objectOrFunction = d, c.isFunction = e, c.isArray = f, c.now = g;
        }, {} ],
        "/Users/dave/dev/projects/myna-js/node_modules/grunt-browserify/node_modules/browserify/node_modules/process/browser.js": [ function(a, b) {
            function c() {}
            var d = b.exports = {};
            d.nextTick = function() {
                var a = "undefined" != typeof window && window.setImmediate, b = "undefined" != typeof window && window.postMessage && window.addEventListener;
                if (a) return function(a) {
                    return window.setImmediate(a);
                };
                if (b) {
                    var c = [];
                    return window.addEventListener("message", function(a) {
                        var b = a.source;
                        if ((b === window || null === b) && "process-tick" === a.data && (a.stopPropagation(), 
                        c.length > 0)) {
                            var d = c.shift();
                            d();
                        }
                    }, !0), function(a) {
                        c.push(a), window.postMessage("process-tick", "*");
                    };
                }
                return function(a) {
                    setTimeout(a, 0);
                };
            }(), d.title = "browser", d.browser = !0, d.env = {}, d.argv = [], d.on = c, d.addListener = c, 
            d.once = c, d.off = c, d.removeListener = c, d.removeAllListeners = c, d.emit = c, 
            d.binding = function() {
                throw new Error("process.binding is not supported");
            }, d.cwd = function() {
                return "/";
            }, d.chdir = function() {
                throw new Error("process.chdir is not supported");
            };
        }, {} ],
        "/Users/dave/dev/projects/myna-js/src/main/bootstrap.coffee": [ function(a, b) {
            var c, d, e, f, g, h;
            h = a("./common/log"), f = a("./common/hash"), g = a("./common/jsonp"), c = function(a) {
                var b, c;
                return b = d(a), c = e(b), {
                    initLocal: b,
                    initRemote: c
                };
            }, d = function(a) {
                return function(b) {
                    var c, d, e, g, i, j, k;
                    return null != f.params.debug && (h.enabled = !0), h.debug("myna.initLocal", b), 
                    "deployment" !== b.typename && h.error("myna.initLocal", 'Myna needs a deployment to initialise. The given JSON is not a deployment.\nIt has a typename of "' + typename + '". Check you are initialising Myna with the\ncorrect UUID if you are calling initRemote', b), 
                    g = b.experiments, c = null != (j = b.apiKey) ? j : h.error("myna.init", "no apiKey in deployment", b), 
                    d = null != (k = b.apiRoot) ? k : "//api.mynaweb.com", i = util["extends"](b.settings, {
                        apiKey: c,
                        apiRoot: d
                    }), e = a(g, i), e.sync().then(function() {
                        return e;
                    });
                };
            }, e = function(a) {
                return function(b, c) {
                    return null == c && (c = 0), h.debug("myna.initRemote", b, c), g.request(b, {}, c).then(a);
                };
            }, b.exports = {
                create: c,
                createLocalInit: d,
                createRemoteInit: e
            };
        }, {
            "./common/hash": "/Users/dave/dev/projects/myna-js/src/main/common/hash.coffee",
            "./common/jsonp": "/Users/dave/dev/projects/myna-js/src/main/common/jsonp.coffee",
            "./common/log": "/Users/dave/dev/projects/myna-js/src/main/common/log.coffee"
        } ],
        "/Users/dave/dev/projects/myna-js/src/main/client/api.coffee": [ function(a, b) {
            var c, d, e, f, g, h, i, j, k = function(a, b) {
                return function() {
                    return a.apply(b, arguments);
                };
            }, l = [].slice;
            d = a("es6-promise").Promise, f = a("../common/jsonp"), g = a("../common/log"), 
            h = a("../common/settings"), i = a("../common/storage"), j = a("../common/util"), 
            e = function() {
                function a(a, b, c) {
                    this.completed = null != a ? a : [], this.discarded = null != b ? b : [], this.requeued = null != c ? c : [], 
                    this.successful = k(this.successful, this), this.requeue = k(this.requeue, this), 
                    this.discard = k(this.discard, this), this.complete = k(this.complete, this);
                }
                return a.prototype.complete = function(b) {
                    return new a(this.completed.concat([ b ]), this.discarded, this.requeued);
                }, a.prototype.discard = function(b) {
                    return new a(this.completed, this.discarded.concat([ b ]), this.requeued);
                }, a.prototype.requeue = function(b) {
                    return new a(this.completed, this.discarded, this.requeued.concat([ b ]));
                }, a.prototype.successful = function() {
                    return 0 === this.discarded.length && 0 === this.requeued.length;
                }, a;
            }(), b.exports = c = function() {
                function a(a, b, c) {
                    this.apiKey = a, this.apiRoot = b, null == c && (c = {}), this._dequeue = k(this._dequeue, this), 
                    this._enqueue = k(this._enqueue, this), this._queue = k(this._queue, this), this.clear = k(this.clear, this), 
                    this.sync = k(this.sync, this), this.reward = k(this.reward, this), this.view = k(this.view, this), 
                    this.apiKey || g.error("ApiRecorder.constructor", "missing apiKey"), this.apiRoot || g.error("ApiRecorder.constructor", "missing apiRoot"), 
                    this.storageKey = h.get(c, "myna.web.storageKey", "myna"), this.timeout = h.get(c, "myna.web.timeout", 1e3), 
                    this.inProgress = null;
                }
                return a.prototype.view = function(a, b) {
                    var c;
                    return c = {
                        typename: "view",
                        experiment: a.uuid,
                        variant: b.id,
                        timestamp: j.dateToString(new Date())
                    }, g.debug("ApiRecorder.view", c), this._enqueue(c);
                }, a.prototype.reward = function(a, b, c) {
                    var d;
                    return d = {
                        typename: "reward",
                        experiment: a.uuid,
                        variant: b.id,
                        amount: c,
                        timestamp: j.dateToString(new Date())
                    }, g.debug("ApiRecorder.reward", d), this._enqueue(d);
                }, a.prototype.sync = function() {
                    var a, b, c, h;
                    return g.debug("ApiRecorder.sync", this._queue().length), h = function(a) {
                        return function(b, d) {
                            var h;
                            return null == d && (d = new e()), g.debug("ApiRecorder.sync.syncOne", b, d), h = j.extend({}, b, {
                                apikey: a.apiKey
                            }), h = j.deleteKeys(h, "experiment"), f.request("" + a.apiRoot + "/v2/experiment/" + b.experiment + "/record", h, a.timeout).then(function(a) {
                                return g.debug("ApiRecorder.sync.syncOne.then", a), c(d.complete(b));
                            })["catch"](function(a) {
                                return g.debug("ApiRecorder.sync.syncOne.catch", a), a.status && a.status >= 500 ? d.requeue(b) : d.discard(b);
                            });
                        };
                    }(this), c = function(a) {
                        return function(b) {
                            var f;
                            return null == b && (b = new e()), g.debug("ApiRecorder.sync.syncAll", b), f = a._dequeue(), 
                            f ? h(f, b).then(c) : (a._enqueue.apply(a, b.requeued), d.resolve(b));
                        };
                    }(this), a = function(a) {
                        return function(b) {
                            return g.debug("ApiRecorder.sync.onComplete", b), a.inProgress = null, b;
                        };
                    }(this), b = function(a) {
                        return function(b) {
                            return g.debug("ApiRecorder.sync.onError", b), a.inProgress = null, d.reject(b);
                        };
                    }(this), null == this.inProgress && (this.inProgress = c().then(a, b)), this.inProgress;
                }, a.prototype.clear = function() {
                    g.debug("ApiRecorder.clear"), i.remove(this.storageKey);
                }, a.prototype._queue = function() {
                    var a, b;
                    return a = null != (b = i.get(this.storageKey)) ? b : [];
                }, a.prototype._enqueue = function() {
                    var a, b, c;
                    return a = 1 <= arguments.length ? l.call(arguments, 0) : [], b = (c = this._queue()).concat.apply(c, a), 
                    i.set(this.storageKey, b), b.length;
                }, a.prototype._dequeue = function() {
                    var a, b;
                    return b = this._queue(), b.length > 0 ? (a = b.shift(), i.set(this.storageKey, b), 
                    a) : null;
                }, a;
            }();
        }, {
            "../common/jsonp": "/Users/dave/dev/projects/myna-js/src/main/common/jsonp.coffee",
            "../common/log": "/Users/dave/dev/projects/myna-js/src/main/common/log.coffee",
            "../common/settings": "/Users/dave/dev/projects/myna-js/src/main/common/settings/index.coffee",
            "../common/storage": "/Users/dave/dev/projects/myna-js/src/main/common/storage/index.coffee",
            "../common/util": "/Users/dave/dev/projects/myna-js/src/main/common/util.coffee",
            "es6-promise": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/main.js"
        } ],
        "/Users/dave/dev/projects/myna-js/src/main/client/basic.coffee": [ function(a, b) {
            var c, d, e, f, g = function(a, b) {
                return function() {
                    return a.apply(b, arguments);
                };
            };
            d = a("es6-promise").Promise, e = a("../common/log"), f = a("./variant"), b.exports = c = function() {
                function a() {
                    this._lookup = g(this._lookup, this), this._random = g(this._random, this), this.reward = g(this.reward, this), 
                    this.view = g(this.view, this), this.suggest = g(this.suggest, this);
                }
                return a.prototype.suggest = function(a) {
                    return this._random(a).then(function() {
                        return function(b) {
                            return e.debug("BasicClient.suggest", null != a ? a.id : void 0, null != b ? b.id : void 0), 
                            b;
                        };
                    }(this));
                }, a.prototype.view = function(a, b) {
                    return this._lookup(a, b).then(function() {
                        return function(b) {
                            return e.debug("BasicClient.suggest", null != a ? a.id : void 0, null != b ? b.id : void 0), 
                            b;
                        };
                    }(this));
                }, a.prototype.reward = function(a, b, c) {
                    return null == c && (c = 1), e.debug("BasicClient.reward", null != a ? a.id : void 0, b, c), 
                    this._lookup(a, b);
                }, a.prototype._random = function(a) {
                    var b;
                    return b = f.random(a), b ? d.resolve(b) : d.reject(new Error("Could not choose random variant"));
                }, a.prototype._lookup = function(a, b) {
                    var c;
                    return c = f.lookup(a, b), c ? d.resolve(c) : d.reject(new Error("Could not choose random variant"));
                }, a;
            }();
        }, {
            "../common/log": "/Users/dave/dev/projects/myna-js/src/main/common/log.coffee",
            "./variant": "/Users/dave/dev/projects/myna-js/src/main/client/variant.coffee",
            "es6-promise": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/main.js"
        } ],
        "/Users/dave/dev/projects/myna-js/src/main/client/cached.coffee": [ function(a, b) {
            var c, d, e, f, g, h = function(a, b) {
                return function() {
                    return a.apply(b, arguments);
                };
            }, i = {}.hasOwnProperty, j = function(a, b) {
                function c() {
                    this.constructor = a;
                }
                for (var d in b) i.call(b, d) && (a[d] = b[d]);
                return c.prototype = b.prototype, a.prototype = new c(), a.__super__ = b.prototype, 
                a;
            };
            e = a("es6-promise").Promise, f = a("../common/log"), c = a("./basic"), g = a("./variant"), 
            b.exports = d = function(a) {
                function b() {
                    return this.clear = h(this.clear, this), this.reward = h(this.reward, this), this.view = h(this.view, this), 
                    this.suggest = h(this.suggest, this), b.__super__.constructor.apply(this, arguments);
                }
                return j(b, a), b.prototype.suggest = function(a) {
                    return f.debug("CachedClient.suggest", a), b.__super__.suggest.call(this, a).then(function() {
                        return function(b) {
                            return f.debug("CachedClient.suggest", "variant", b), g.save(a, "lastView", b), 
                            b;
                        };
                    }(this));
                }, b.prototype.view = function(a, c) {
                    return f.debug("CachedClient.view", a, c), b.__super__.view.call(this, a, c).then(function() {
                        return function(b) {
                            return f.debug("CachedClient.view", "variant", b), g.save(a, "lastView", b), b;
                        };
                    }(this));
                }, b.prototype.reward = function(a, c) {
                    var d;
                    return null == c && (c = 1), f.debug("CachedClient.reward", a, c), d = g.load(a, "lastView"), 
                    f.debug("lastView", d), d ? b.__super__.reward.call(this, a, d, c).then(function() {
                        return function(b) {
                            return f.debug("CachedClient.reward", "variant", b), g.remove(a, "lastView"), b;
                        };
                    }(this)) : (f.debug("suffering epic fail"), e.reject(new Error("No last view for experiment " + a.id + " (" + a.uuid + ")")));
                }, b.prototype.clear = function(a) {
                    return f.debug("CachedClient.clear", a), g.remove(a, "lastView"), e.resolve(null);
                }, b;
            }(c);
        }, {
            "../common/log": "/Users/dave/dev/projects/myna-js/src/main/common/log.coffee",
            "./basic": "/Users/dave/dev/projects/myna-js/src/main/client/basic.coffee",
            "./variant": "/Users/dave/dev/projects/myna-js/src/main/client/variant.coffee",
            "es6-promise": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/main.js"
        } ],
        "/Users/dave/dev/projects/myna-js/src/main/client/default.coffee": [ function(a, b) {
            var c, d, e, f, g, h, i, j, k = function(a, b) {
                return function() {
                    return a.apply(b, arguments);
                };
            }, l = {}.hasOwnProperty, m = function(a, b) {
                function c() {
                    this.constructor = a;
                }
                for (var d in b) l.call(b, d) && (a[d] = b[d]);
                return c.prototype = b.prototype, a.prototype = new c(), a.__super__ = b.prototype, 
                a;
            };
            g = a("es6-promise").Promise, i = a("../common/log"), j = a("../common/settings"), 
            d = a("./cached"), h = a("./sticky"), c = a("./api"), f = a("./ga"), b.exports = e = function(a) {
                function b(a, b) {
                    var d, e, g, l, m, n;
                    for (null == a && (a = []), null == b && (b = {}), this._withStickyReward = k(this._withStickyReward, this), 
                    this._withStickyView = k(this._withStickyView, this), this._withExperiment = k(this._withExperiment, this), 
                    this.clear = k(this.clear, this), this.reward = k(this.reward, this), this.view = k(this.view, this), 
                    this.suggest = k(this.suggest, this), i.debug("DefaultClient.constructor", b), this.apiKey = null != (l = b.apiKey) ? l : i.error("Client.constructor", "no apiKey specified", b), 
                    this.apiRoot = null != (m = b.apiRoot) ? m : "//api.mynaweb.com", this.settings = j.create(null != (n = null != b ? b.settings : void 0) ? n : {}), 
                    this.sticky = new h(), this.record = new c(this.apiKey, this.apiRoot, this.settings), 
                    this.google = new f(this.settings), this.autoSync = j.get(this.settings, "myna.web.autoSync", !0), 
                    this.experiments = {}, e = 0, g = a.length; g > e; e++) d = a[e], this.experiments[d.id] = d;
                }
                return m(b, a), b.prototype.suggest = function(a) {
                    return i.debug("DefaultClient.suggest", a), this._withExperiment(a).then(function(a) {
                        return function(c) {
                            return a._withStickyView(c)["catch"](function() {
                                return b.__super__.suggest.call(a, c).then(function(b) {
                                    return a.sticky.saveView(c, b), a.google.view(c, b), a.record.view(c, b), a.autoSync && a.record.sync(), 
                                    b;
                                });
                            });
                        };
                    }(this));
                }, b.prototype.view = function(a, c) {
                    return i.debug("DefaultClient.view", a, c), this._withExperiment(a).then(function(a) {
                        return function(d) {
                            return a._withStickyView(d)["catch"](function() {
                                return b.__super__.view.call(a, d, c).then(function(b) {
                                    return a.sticky.saveView(d, b), a.google.view(d, b), a.record.view(d, b), a.autoSync && a.record.sync(), 
                                    b;
                                });
                            });
                        };
                    }(this));
                }, b.prototype.reward = function(a, c) {
                    return null == c && (c = 1), i.debug("DefaultClient.reward", a, c), this._withExperiment(a).then(function(a) {
                        return function(d) {
                            return a._withStickyReward(d)["catch"](function() {
                                return b.__super__.reward.call(a, d, c).then(function(b) {
                                    return a.sticky.saveReward(d, b), a.google.reward(d, b, c), a.record.reward(d, b, c), 
                                    a.autoSync ? a.record.sync().then(function() {
                                        return b;
                                    }) : b;
                                });
                            });
                        };
                    }(this));
                }, b.prototype.clear = function(a) {
                    return i.debug("DefaultClient.clear", a), this._withExperiment(a).then(function(a) {
                        return function(c) {
                            return b.__super__.clear.call(a, c).then(function() {
                                return a.sticky.clear(c), g.resolve(null);
                            });
                        };
                    }(this));
                }, b.prototype._withExperiment = function(a) {
                    var b;
                    return b = "string" == typeof a ? this.experiments[a] : a, b ? g.resolve(b) : g.reject(new Error("Experiment not found: " + a));
                }, b.prototype._withStickyView = function(a) {
                    var b;
                    return b = this.sticky.loadView(a), b ? g.resolve(b) : g.reject(new Error("Sticky view not found: " + a));
                }, b.prototype._withStickyReward = function(a) {
                    var b;
                    return b = this.sticky.loadReward(a), b ? g.resolve(b) : g.reject(new Error("Sticky reward not found: " + a));
                }, b;
            }(d);
        }, {
            "../common/log": "/Users/dave/dev/projects/myna-js/src/main/common/log.coffee",
            "../common/settings": "/Users/dave/dev/projects/myna-js/src/main/common/settings/index.coffee",
            "./api": "/Users/dave/dev/projects/myna-js/src/main/client/api.coffee",
            "./cached": "/Users/dave/dev/projects/myna-js/src/main/client/cached.coffee",
            "./ga": "/Users/dave/dev/projects/myna-js/src/main/client/ga.coffee",
            "./sticky": "/Users/dave/dev/projects/myna-js/src/main/client/sticky.coffee",
            "es6-promise": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/main.js"
        } ],
        "/Users/dave/dev/projects/myna-js/src/main/client/ga.coffee": [ function(a, b) {
            var c, d, e, f = function(a, b) {
                return function() {
                    return a.apply(b, arguments);
                };
            };
            d = a("../common/log"), e = a("../common/settings"), b.exports = c = function() {
                function a(a) {
                    this.settings = a, this._rewardMultiplier = f(this._rewardMultiplier, this), this._eventName = f(this._eventName, this), 
                    this._enabled = f(this._enabled, this), this._rewardEvent = f(this._rewardEvent, this), 
                    this._viewEvent = f(this._viewEvent, this), this.reward = f(this.reward, this), 
                    this.view = f(this.view, this);
                }
                return a.prototype.view = function(a, b) {
                    var c;
                    d.debug("GoogleAnalytics.view", a, b), this._enabled(a) && null != (c = window._gaq) && c.push(this._viewEvent(a, b));
                }, a.prototype.reward = function(a, b, c) {
                    var e;
                    d.debug("GoogleAnalytics.reward", a, b), this._enabled(a) && null != (e = window._gaq) && e.push(this._rewardEvent(a, b, c));
                }, a.prototype._viewEvent = function(a, b) {
                    return [ "_trackEvent", "myna", this._eventName(a, "view"), b.id, null, !1 ];
                }, a.prototype._rewardEvent = function(a, b, c) {
                    var d;
                    return d = this._rewardMultiplier(a), [ "_trackEvent", "myna", this._eventName(a, "reward"), b.id, Math.round(d * c), !0 ];
                }, a.prototype._enabled = function(a) {
                    return e.get(a.settings, "myna.web.googleAnalytics.enabled", !0);
                }, a.prototype._eventName = function(a, b) {
                    var c;
                    return null != (c = e.get(a.settings, "myna.web.googleAnalytics." + b + "Event")) ? c : "" + a.id + "-" + b;
                }, a.prototype._rewardMultiplier = function(a) {
                    return e.get(a.settings, "myna.web.googleAnalytics.rewardMultiplier", 100);
                }, a;
            }();
        }, {
            "../common/log": "/Users/dave/dev/projects/myna-js/src/main/common/log.coffee",
            "../common/settings": "/Users/dave/dev/projects/myna-js/src/main/common/settings/index.coffee"
        } ],
        "/Users/dave/dev/projects/myna-js/src/main/client/sticky.coffee": [ function(a, b) {
            var c, d, e, f, g, h = function(a, b) {
                return function() {
                    return a.apply(b, arguments);
                };
            };
            c = a("es6-promise").Promise, e = a("../common/log"), f = a("../common/settings"), 
            g = a("./variant"), b.exports = d = function() {
                function a(a) {
                    this.stickyKey = null != a ? a : "myna.web.sticky", this._isSticky = h(this._isSticky, this), 
                    this.clear = h(this.clear, this), this.saveReward = h(this.saveReward, this), this.loadReward = h(this.loadReward, this), 
                    this.saveView = h(this.saveView, this), this.loadView = h(this.loadView, this);
                }
                return a.prototype.loadView = function(a) {
                    var b;
                    return e.debug("StickyCache.loadView", a), b = this._isSticky(a) ? g.load(a, "stickyView") : null, 
                    e.debug("StickyCache.loadView", null != a ? a.id : void 0, null != b ? b.id : void 0), 
                    b;
                }, a.prototype.saveView = function(a, b) {
                    e.debug("StickyCache.saveView", null != a ? a.id : void 0, null != b ? b.id : void 0), 
                    this._isSticky(a) && g.save(a, "stickyView", b);
                }, a.prototype.loadReward = function(a) {
                    var b;
                    return b = this._isSticky(a) ? g.load(a, "stickyReward") : null, e.debug("StickyCache.loadReward", null != a ? a.id : void 0, null != b ? b.id : void 0), 
                    b;
                }, a.prototype.saveReward = function(a, b) {
                    e.debug("StickyCache.saveReward", null != a ? a.id : void 0, null != b ? b.id : void 0), 
                    this._isSticky(a) && g.save(a, "stickyReward", b);
                }, a.prototype.clear = function(a) {
                    e.debug("StickyCache.clear", a), g.remove(a, "stickyView"), g.remove(a, "stickyReward");
                }, a.prototype._isSticky = function(a) {
                    return !!f.get(a.settings, this.stickyKey, !1);
                }, a;
            }();
        }, {
            "../common/log": "/Users/dave/dev/projects/myna-js/src/main/common/log.coffee",
            "../common/settings": "/Users/dave/dev/projects/myna-js/src/main/common/settings/index.coffee",
            "./variant": "/Users/dave/dev/projects/myna-js/src/main/client/variant.coffee",
            "es6-promise": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/main.js"
        } ],
        "/Users/dave/dev/projects/myna-js/src/main/client/variant.coffee": [ function(a, b) {
            var c, d, e, f, g, h, i, j, k;
            c = a("es6-promise").Promise, e = a("../common/log"), j = a("../common/storage"), 
            i = function(a, b, c) {
                j.set("" + a.uuid + "_" + b, c.id);
            }, d = function(a, b) {
                var c, d;
                return c = null != (d = j.get("" + a.uuid + "_" + b)) ? d : null, e.debug("variant.load", "id", c), 
                c ? f(a, c) : null;
            }, h = function(a, b) {
                j.remove("" + a.uuid + "_" + b);
            }, f = function(a, b) {
                var c, d, e, f, g;
                for (c = b.id ? b.id : b, g = a.variants, e = 0, f = g.length; f > e; e++) if (d = g[e], 
                d.id === c) return d;
                return null;
            }, g = function(a) {
                var b, c, d, e;
                c = k(a), g = Math.random() * c, e = a.variants;
                for (b in e) if (d = e[b], c -= d.weight, g >= c) return d;
                return null;
            }, k = function(a) {
                var b, c, d, e, f;
                for (b = 0, f = a.variants, d = 0, e = f.length; e > d; d++) c = f[d], b += c.weight;
                return b;
            }, b.exports = {
                save: i,
                load: d,
                remove: h,
                lookup: f,
                random: g,
                _totalWeight: k
            };
        }, {
            "../common/log": "/Users/dave/dev/projects/myna-js/src/main/common/log.coffee",
            "../common/storage": "/Users/dave/dev/projects/myna-js/src/main/common/storage/index.coffee",
            "es6-promise": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/main.js"
        } ],
        "/Users/dave/dev/projects/myna-js/src/main/common/hash.coffee": [ function(a, b) {
            var c, d, e;
            c = a("./log"), e = function(a) {
                var b, d, e, f, g, h, i, j;
                for (a = a ? "#" === a[0] ? a.substring(1) : a : "", b = {}, i = a.split("&"), g = 0, 
                h = i.length; h > g; g++) e = i[g], "" !== e && (j = e.split("="), d = j[0], f = j[1], 
                b[decodeURIComponent(d)] = decodeURIComponent(null != f ? f : d));
                return c.debug("hash.parse", b), b;
            }, d = e(window.location.hash), b.exports = {
                parse: e,
                params: d
            };
        }, {
            "./log": "/Users/dave/dev/projects/myna-js/src/main/common/log.coffee"
        } ],
        "/Users/dave/dev/projects/myna-js/src/main/common/jsonp.coffee": [ function(a, b) {
            var c, d, e;
            c = a("es6-promise").Promise, e = a("./log"), b.exports = d = {}, window.__mynaCallbacks = {}, 
            d.request = function(a, b, f) {
                return null == b && (b = {}), null == f && (f = 0), e.debug("jsonp.request", a, b, f), 
                new c(function(c, g) {
                    var h, i, j, k, l;
                    k = !1, j = function() {
                        e.debug("jsonp.request.onTimeout", h, k, f), k || (k = !0, d._removeCallback(h), 
                        g(d._createTimeoutError(h)));
                    }, i = function(a) {
                        e.debug("jsonp.request.onComplete", h, k, a), k || (k = !0, window.clearTimeout(l), 
                        d._removeCallback(h), "problem" === a.typename ? g(a) : c(a));
                    }, l = f ? window.setTimeout(j, f) : null, h = d._createCallback(a, b, i);
                });
            }, d._createCallback = function(a, b, c) {
                var e, f, g, h;
                return f = "" + Math.floor(1e4 * Math.random()), h = new Date().getTime(), e = "c" + h + "_" + f, 
                window.__mynaCallbacks[e] = c, a = d._createUrl(a, b, e), g = d._createScriptElem(a, e), 
                document.getElementsByTagName("head")[0].appendChild(g), e;
            }, d._removeCallback = function(a) {
                var b, c, d;
                d = document.getElementById(a), c = null != d ? d.readyState : void 0, !window.__mynaCallbacks[a] || c && "complete" !== c && "loaded" !== c || (d.onload = d.onreadystatechange = null, 
                d.parentNode.removeChild(d));
                try {
                    window.__mynaCallbacks[a] = null, delete window.__mynaCallbacks[a];
                } catch (e) {
                    b = e;
                }
            }, d._createUrl = function(a, b, c) {
                var d, f, g;
                null == b && (b = {}), d = a, d += a.indexOf("?") < 0 ? "?" : "&";
                for (f in b) g = b[f], d += "" + f + "=" + g + "&";
                return d += "callback=__mynaCallbacks." + c, e.debug("jsonp._createUrl", d), d;
            }, d._createScriptElem = function(a, b) {
                var c;
                return c = document.createElement("script"), c.setAttribute("id", b), c.setAttribute("type", "text/javascript"), 
                c.setAttribute("async", "true"), c.setAttribute("src", a), c.setAttribute("class", "myna-jsonp"), 
                c.setAttribute("data-callback", b), c.onload = c.onreadystatechange = function() {
                    d._removeCallback(b);
                }, c;
            }, d._createTimeoutError = function(a) {
                return {
                    typename: "problem",
                    status: 500,
                    messages: [ {
                        typename: "timeout",
                        message: "request timed out after #{timeout}ms",
                        callback: a
                    } ]
                };
            };
        }, {
            "./log": "/Users/dave/dev/projects/myna-js/src/main/common/log.coffee",
            "es6-promise": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/main.js"
        } ],
        "/Users/dave/dev/projects/myna-js/src/main/common/log.coffee": [ function(a, b) {
            var c, d, e, f = [].slice;
            d = !1, c = function() {
                var a, b;
                a = 1 <= arguments.length ? f.call(arguments, 0) : [], d && null != (b = window.console) && b.log(a);
            }, e = function() {
                var a, b;
                throw a = 1 <= arguments.length ? f.call(arguments, 0) : [], d && null != (b = window.console) && b.error(a), 
                a;
            }, b.exports = {
                enabled: d,
                debug: c,
                error: e
            };
        }, {} ],
        "/Users/dave/dev/projects/myna-js/src/main/common/settings/index.coffee": [ function(a, b) {
            var c, d, e, f, g, h, i, j, k, l;
            j = a("../util"), c = a("./path"), d = function(a) {
                return k({}, a);
            }, f = function(a, b, d) {
                var e;
                return null == d && (d = void 0), null != (e = new c(b).get(a)) ? e : d;
            }, h = function(a) {
                if (arguments.length < 2) throw [ "settings.set", "not enough arguments", arguments ];
                return "object" == typeof arguments[1] ? k(a, arguments[1]) : l(a, arguments[1], arguments[2]);
            }, k = function(a, b) {
                var c, d;
                for (c in b) d = b[c], a = l(a, c, d);
                return a;
            }, l = function(a, b, d) {
                return new c(b).set(a, d);
            }, i = function(a, b) {
                return new c(b).unset(a);
            }, e = function() {
                var a, b, c;
                return a = [], b = function(a) {
                    return "." === a[0] ? a.substring(1) : a;
                }, c = function(d, e) {
                    var f, g, h, i, k, l, m;
                    if (null == e && (e = ""), j.isArray(d)) {
                        for (l = [], h = i = 0, k = d.length; k > i; h = ++i) f = d[h], l.push(c(h, e + "[" + f + "]"));
                        return l;
                    }
                    if (j.isObject(d)) {
                        m = [];
                        for (g in d) h = d[g], m.push(c(h, e + "." + g));
                        return m;
                    }
                    return a.push([ b(e), d ]);
                }, c(this.data), a;
            }, g = function(a) {
                return _.map(e(a), function(a) {
                    return a[0];
                }), {
                    toJSON: function(a) {
                        return function(b) {
                            return null == b && (b = {}), a.data;
                        };
                    }(this)
                };
            }, b.exports = {
                Path: c,
                create: d,
                get: f,
                set: h,
                unset: i,
                flatten: e,
                paths: g
            };
        }, {
            "../util": "/Users/dave/dev/projects/myna-js/src/main/common/util.coffee",
            "./path": "/Users/dave/dev/projects/myna-js/src/main/common/settings/path.coffee"
        } ],
        "/Users/dave/dev/projects/myna-js/src/main/common/settings/path.coffee": [ function(a, b) {
            var c, d, e = function(a, b) {
                return function() {
                    return a.apply(b, arguments);
                };
            }, f = [].slice;
            d = a("../util"), b.exports = c = function() {
                function a(b) {
                    this.toString = e(this.toString, this), this.drop = e(this.drop, this), this.take = e(this.take, this), 
                    this.isPrefixOf = e(this.isPrefixOf, this), this.prefixes = e(this.prefixes, this), 
                    this.unset = e(this.unset, this), this.set = e(this.set, this), this.get = e(this.get, this), 
                    this.path = e(this.path, this), this.quote = e(this.quote, this), this.nodes = "string" == typeof b ? a.parse(b) : b;
                }
                return a.identifierRegex = /^[a-z_$][a-z0-9_$]*/i, a.integerRegex = /^[0-9]+/, a.completeIdentifierRegex = /^[a-z_$][a-z0-9_$]*$/i, 
                a.permissiveIdentifierRegex = /^[^[.]+/, a.isValid = function(b) {
                    var c;
                    try {
                        return a.parse(b), !0;
                    } catch (d) {
                        return c = d, !1;
                    }
                }, a.normalize = function(b) {
                    var c;
                    try {
                        return new a(b).toString();
                    } catch (d) {
                        return c = d, b;
                    }
                }, a.parse = function(b) {
                    var c, e, f, g, h, i, j, k, l;
                    return g = b, h = function(a) {
                        if (g.length < a) throw "bad settings path: " + b;
                        g = g.substring(a);
                    }, j = function(a) {
                        var c;
                        if (g.length < a) throw "bad settings path: " + b;
                        return c = g.substring(0, a), g = g.substring(a), c;
                    }, k = function(a) {
                        return g = g.substring(a.length), a;
                    }, c = function() {
                        var c;
                        if (c = g.match(a.permissiveIdentifierRegex)) return k(c[0]);
                        throw "bad settings path: " + b;
                    }, f = function() {
                        var c;
                        if (c = g.match(a.integerRegex)) return parseInt(k(c[0]));
                        throw "bad settings path: " + b;
                    }, i = function(a) {
                        var b, c;
                        for (h(1), b = "", c = !1; !c; ) g[0] === a ? c = !0 : "\\" === g[0] ? (h(1), b += j(1)) : b += j(1);
                        return h(1), b;
                    }, e = function() {
                        var a;
                        return h(1), a = "'" === g[0] ? i("'") : '"' === g[0] ? i('"') : f(), h(1), a;
                    }, l = function() {
                        var a;
                        for (a = []; g.length > 0; ) "." === g[0] ? (h(1), a.push(c())) : a.push("[" === g[0] ? e() : c());
                        return a;
                    }, g = d.trim(g), "" === g ? [] : "." === g[0] || "[" === g[0] ? l() : (g = "." + g, 
                    l());
                }, a.prototype.quote = function(a) {
                    return a.replace(/['\"\\]/g, function(a) {
                        return "\\" + a;
                    });
                }, a.prototype.path = function(b) {
                    var c, d, e, f;
                    for (null == b && (b = this.nodes), c = "", e = 0, f = b.length; f > e; e++) d = b[e], 
                    c += "number" == typeof d ? "[" + d + "]" : a.completeIdentifierRegex.test(d) ? "." + d : '["' + this.quote(d) + '"]';
                    return "." === c[0] ? c.substring(1) : c;
                }, a.prototype.get = function(a) {
                    var b, c, d, e;
                    for (e = this.nodes, c = 0, d = e.length; d > c; c++) b = e[c], a = null != a ? a[b] : void 0;
                    return a;
                }, a.prototype.set = function(a, b) {
                    var c, d, e, g, h, i, j, k;
                    if (null != b) {
                        if (0 === this.nodes.length) return b;
                        for (g = a, k = this.nodes, c = 2 <= k.length ? f.call(k, 0, h = k.length - 1) : (h = 0, 
                        []), d = k[h++], i = 0, j = c.length; j > i; i++) e = c[i], "object" != typeof g[e] && (g[e] = {}), 
                        g = g[e];
                        return g[d] = b, a;
                    }
                    return this.unset(a);
                }, a.prototype.unset = function(a) {
                    var b, c, d, e, g, h, i, j;
                    if (0 === this.nodes.length) return void 0;
                    for (e = a, j = this.nodes, b = 2 <= j.length ? f.call(j, 0, g = j.length - 1) : (g = 0, 
                    []), c = j[g++], h = 0, i = b.length; i > h; h++) {
                        if (d = b[h], null == e[d]) return a;
                        e = e[d];
                    }
                    return delete e[c], a;
                }, a.prototype.prefixes = function() {
                    var a, b, c, d, e;
                    for (c = this.nodes, a = [], b = d = 1, e = c.length; e >= 1 ? e >= d : d >= e; b = e >= 1 ? ++d : --d) a.push(this.path(c.slice(0, b)));
                    return a;
                }, a.prototype.isPrefixOf = function(a) {
                    var b, c, d, e, f;
                    if (b = this.nodes, c = a.nodes, b.length > c.length) return !1;
                    for (d = e = 0, f = b.length; f >= 0 ? f > e : e > f; d = f >= 0 ? ++e : --e) if (b[d] !== c[d]) return !1;
                    return !0;
                }, a.prototype.take = function(b) {
                    return new a(_.take(this.nodes, b));
                }, a.prototype.drop = function(b) {
                    return new a(_.drop(this.nodes, b));
                }, a.prototype.toString = function() {
                    return this.path();
                }, a;
            }();
        }, {
            "../util": "/Users/dave/dev/projects/myna-js/src/main/common/util.coffee"
        } ],
        "/Users/dave/dev/projects/myna-js/src/main/common/storage/cookie.coffee": [ function(a, b) {
            var c, d, e, f, g;
            d = function(a) {
                return encodeURIComponent(JSON.stringify(a));
            }, c = function(a) {
                return JSON.parse(0 === a.indexOf('"') ? decodeURIComponent(a.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\")) : decodeURIComponent(a));
            }, g = function(a, b, c) {
                var e, f, g, h;
                null == c && (c = 365), h = "myna-" + a + "=" + d(b), f = c ? (e = new Date(), e.setTime(e.getTime() + 24 * c * 60 * 60 * 1e3), 
                "; expires=" + e.toGMTString()) : "", g = "; path=/", document.cookie = "" + h + f + g;
            }, e = function(a) {
                var b, d, e, f, g, h, i, j;
                for (g = "myna-" + a + "=", f = function(a) {
                    var b;
                    return b = a.indexOf(g), b >= 0 && a.substring(0, b).match("^\\s*$");
                }, d = function(a) {
                    var b;
                    return b = a.indexOf(g), a.substring(b + g.length, a.length);
                }, e = document.cookie.split(";"), i = 0, j = e.length; j > i; i++) if (b = e[i], 
                f(b) && null != (h = d(b))) return c(h);
                return null;
            }, f = function(a) {
                g(a, "", -1);
            }, b.exports = {
                get: e,
                set: g,
                remove: f
            };
        }, {} ],
        "/Users/dave/dev/projects/myna-js/src/main/common/storage/index.coffee": [ function(a, b) {
            var c, d, e, f, g, h;
            h = {}, c = a("./cookie"), e = a("./local"), d = function() {
                return function(a) {
                    return localStorage.supported && localStorage.enabled ? localStorage.get(a) : c.get(a);
                };
            }(this), g = function() {
                return function(a, b) {
                    localStorage.supported && localStorage.enabled ? localStorage.set(a, b) : c.set(a, b);
                };
            }(this), f = function() {
                return function(a) {
                    localStorage.supported && localStorage.enabled ? localStorage.remove(a) : c.remove(a);
                };
            }(this), b.exports = {
                get: d,
                set: g,
                remove: f
            };
        }, {
            "./cookie": "/Users/dave/dev/projects/myna-js/src/main/common/storage/cookie.coffee",
            "./local": "/Users/dave/dev/projects/myna-js/src/main/common/storage/local.coffee"
        } ],
        "/Users/dave/dev/projects/myna-js/src/main/common/storage/local.coffee": [ function(a, b) {
            var c, d, e, f, g, h;
            c = !1, h = function() {
                try {
                    return localStorage.setItem("modernizer", "modernizer"), localStorage.removeItem("modernizer"), 
                    !0;
                } catch (a) {
                    return d = a, !1;
                }
            }(), e = function(a) {
                var b;
                if (b = window.localStorage.getItem("myna-" + a), null == b) return null;
                try {
                    return JSON.parse(b);
                } catch (c) {
                    return d = c, null;
                }
            }, g = function(a, b) {
                null != b ? window.localStorage.setItem("myna-" + a, JSON.stringify(b)) : window.localStorage.removeItem("myna-" + a);
            }, f = function(a) {
                window.localStorage.removeItem("myna-" + a);
            }, b.exports = {
                enabled: c,
                supported: h,
                get: e,
                set: g,
                remove: f
            };
        }, {} ],
        "/Users/dave/dev/projects/myna-js/src/main/common/util.coffee": [ function(a, b) {
            var c, d, e, f, g, h, i, j, k, l = [].slice;
            k = function(a) {
                return null === a ? "" : a.replace(/^\s+|\s+$/g, "");
            }, f = Array.isArray || function(a) {
                return "[object Array]" === Object.prototype.toString.call(a);
            }, h = function(a) {
                return a === Object(a);
            }, g = function(a) {
                var b, c;
                if (h(a)) {
                    b = Object.prototype.hasOwnProperty;
                    for (c in a) if (b.call(a, c)) return !1;
                    return !0;
                }
                return !1;
            }, e = function() {
                var a, b, c, d, e, f, g;
                for (a = arguments[0], c = 2 <= arguments.length ? l.call(arguments, 1) : [], f = 0, 
                g = c.length; g > f; f++) {
                    d = c[f];
                    for (b in d) e = d[b], a[b] = e;
                }
                return a;
            }, d = function() {
                var a, b, c, d, f, g;
                for (d = arguments[0], c = 2 <= arguments.length ? l.call(arguments, 1) : [], a = e({}, d), 
                f = 0, g = c.length; g > f; f++) b = c[f], delete a[b];
                return a;
            }, c = function(a) {
                var b, c, d, e, f, g, h, i;
                return Date.prototype.toISOString ? a.toISOString() : (g = function(a, b) {
                    var c;
                    for (c = "" + a; c.length < b; ) c = "0" + c;
                    return c;
                }, i = g(a.getUTCFullYear(), 4), f = g(a.getUTCMonth() + 1, 2), b = g(a.getUTCDate(), 2), 
                c = g(a.getUTCHours(), 2), e = g(a.getUTCMinutes(), 2), h = g(a.getUTCSeconds(), 2), 
                d = g(a.getUTCMilliseconds(), 2), "" + i + "-" + f + "-" + b + "T" + c + ":" + e + ":" + h + "." + d + "Z");
            }, i = function(a) {
                return new Error(a);
            }, j = function(a) {
                return window.location.replace(a);
            }, b.exports = {
                trim: k,
                isArray: f,
                isObject: h,
                isEmptyObject: g,
                extend: e,
                deleteKeys: d,
                dateToString: c,
                problem: i,
                redirect: j
            };
        }, {} ],
        "/Users/dave/dev/projects/myna-js/src/main/myna.coffee": [ function(a, b) {
            var c, d;
            c = a("./client/default"), d = a("./bootstrap"), b.exports = d.create(function(a, b) {
                return new c(a, b);
            });
        }, {
            "./bootstrap": "/Users/dave/dev/projects/myna-js/src/main/bootstrap.coffee",
            "./client/default": "/Users/dave/dev/projects/myna-js/src/main/client/default.coffee"
        } ]
    }, {}, [ "/Users/dave/dev/projects/myna-js/src/main/myna.coffee" ])("/Users/dave/dev/projects/myna-js/src/main/myna.coffee");
});