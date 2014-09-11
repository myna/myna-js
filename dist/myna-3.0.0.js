/*! Myna v3.0.0 - 2014-09-11
 * http://mynaweb.com
 * Copyright (c) 2014 Myna Limited; Licensed BSD 2-Clause
 */
!function(e) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = e(); else if ("function" == typeof define && define.amd) define([], e); else {
        var f;
        "undefined" != typeof window ? f = window : "undefined" != typeof global ? f = global : "undefined" != typeof self && (f = self), 
        f.Myna = e();
    }
}(function() {
    return function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = "function" == typeof require && require;
                    if (!u && a) return a(o, !0);
                    if (i) return i(o, !0);
                    var f = new Error("Cannot find module '" + o + "'");
                    throw f.code = "MODULE_NOT_FOUND", f;
                }
                var l = n[o] = {
                    exports: {}
                };
                t[o][0].call(l.exports, function(e) {
                    var n = t[o][1][e];
                    return s(n ? n : e);
                }, l, l.exports, e, t, n, r);
            }
            return n[o].exports;
        }
        for (var i = "function" == typeof require && require, o = 0; o < r.length; o++) s(r[o]);
        return s;
    }({
        "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/main.js": [ function(require, module, exports) {
            "use strict";
            var Promise = require("./promise/promise").Promise, polyfill = require("./promise/polyfill").polyfill;
            exports.Promise = Promise, exports.polyfill = polyfill;
        }, {
            "./promise/polyfill": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/polyfill.js",
            "./promise/promise": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/promise.js"
        } ],
        "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/all.js": [ function(require, module, exports) {
            "use strict";
            function all(promises) {
                var Promise = this;
                if (!isArray(promises)) throw new TypeError("You must pass an array to all.");
                return new Promise(function(resolve, reject) {
                    function resolver(index) {
                        return function(value) {
                            resolveAll(index, value);
                        };
                    }
                    function resolveAll(index, value) {
                        results[index] = value, 0 === --remaining && resolve(results);
                    }
                    var promise, results = [], remaining = promises.length;
                    0 === remaining && resolve([]);
                    for (var i = 0; i < promises.length; i++) promise = promises[i], promise && isFunction(promise.then) ? promise.then(resolver(i), reject) : resolveAll(i, promise);
                });
            }
            var isArray = require("./utils").isArray, isFunction = require("./utils").isFunction;
            exports.all = all;
        }, {
            "./utils": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/utils.js"
        } ],
        "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/asap.js": [ function(require, module, exports) {
            (function(process, global) {
                "use strict";
                function useNextTick() {
                    return function() {
                        process.nextTick(flush);
                    };
                }
                function useMutationObserver() {
                    var iterations = 0, observer = new BrowserMutationObserver(flush), node = document.createTextNode("");
                    return observer.observe(node, {
                        characterData: !0
                    }), function() {
                        node.data = iterations = ++iterations % 2;
                    };
                }
                function useSetTimeout() {
                    return function() {
                        local.setTimeout(flush, 1);
                    };
                }
                function flush() {
                    for (var i = 0; i < queue.length; i++) {
                        var tuple = queue[i], callback = tuple[0], arg = tuple[1];
                        callback(arg);
                    }
                    queue = [];
                }
                function asap(callback, arg) {
                    var length = queue.push([ callback, arg ]);
                    1 === length && scheduleFlush();
                }
                var scheduleFlush, browserGlobal = "undefined" != typeof window ? window : {}, BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver, local = "undefined" != typeof global ? global : void 0 === this ? window : this, queue = [];
                scheduleFlush = "undefined" != typeof process && "[object process]" === {}.toString.call(process) ? useNextTick() : BrowserMutationObserver ? useMutationObserver() : useSetTimeout(), 
                exports.asap = asap;
            }).call(this, require("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
        }, {
            _process: "/Users/dave/dev/projects/myna-js/node_modules/grunt-browserify/node_modules/browserify/node_modules/process/browser.js"
        } ],
        "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/config.js": [ function(require, module, exports) {
            "use strict";
            function configure(name, value) {
                return 2 !== arguments.length ? config[name] : void (config[name] = value);
            }
            var config = {
                instrument: !1
            };
            exports.config = config, exports.configure = configure;
        }, {} ],
        "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/polyfill.js": [ function(require, module, exports) {
            (function(global) {
                "use strict";
                function polyfill() {
                    var local;
                    local = "undefined" != typeof global ? global : "undefined" != typeof window && window.document ? window : self;
                    var es6PromiseSupport = "Promise" in local && "resolve" in local.Promise && "reject" in local.Promise && "all" in local.Promise && "race" in local.Promise && function() {
                        var resolve;
                        return new local.Promise(function(r) {
                            resolve = r;
                        }), isFunction(resolve);
                    }();
                    es6PromiseSupport || (local.Promise = RSVPPromise);
                }
                var RSVPPromise = require("./promise").Promise, isFunction = require("./utils").isFunction;
                exports.polyfill = polyfill;
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
        }, {
            "./promise": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/promise.js",
            "./utils": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/utils.js"
        } ],
        "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/promise.js": [ function(require, module, exports) {
            "use strict";
            function Promise(resolver) {
                if (!isFunction(resolver)) throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");
                if (!(this instanceof Promise)) throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
                this._subscribers = [], invokeResolver(resolver, this);
            }
            function invokeResolver(resolver, promise) {
                function resolvePromise(value) {
                    resolve(promise, value);
                }
                function rejectPromise(reason) {
                    reject(promise, reason);
                }
                try {
                    resolver(resolvePromise, rejectPromise);
                } catch (e) {
                    rejectPromise(e);
                }
            }
            function invokeCallback(settled, promise, callback, detail) {
                var value, error, succeeded, failed, hasCallback = isFunction(callback);
                if (hasCallback) try {
                    value = callback(detail), succeeded = !0;
                } catch (e) {
                    failed = !0, error = e;
                } else value = detail, succeeded = !0;
                handleThenable(promise, value) || (hasCallback && succeeded ? resolve(promise, value) : failed ? reject(promise, error) : settled === FULFILLED ? resolve(promise, value) : settled === REJECTED && reject(promise, value));
            }
            function subscribe(parent, child, onFulfillment, onRejection) {
                var subscribers = parent._subscribers, length = subscribers.length;
                subscribers[length] = child, subscribers[length + FULFILLED] = onFulfillment, subscribers[length + REJECTED] = onRejection;
            }
            function publish(promise, settled) {
                for (var child, callback, subscribers = promise._subscribers, detail = promise._detail, i = 0; i < subscribers.length; i += 3) child = subscribers[i], 
                callback = subscribers[i + settled], invokeCallback(settled, child, callback, detail);
                promise._subscribers = null;
            }
            function handleThenable(promise, value) {
                var resolved, then = null;
                try {
                    if (promise === value) throw new TypeError("A promises callback cannot return that same promise.");
                    if (objectOrFunction(value) && (then = value.then, isFunction(then))) return then.call(value, function(val) {
                        return resolved ? !0 : (resolved = !0, void (value !== val ? resolve(promise, val) : fulfill(promise, val)));
                    }, function(val) {
                        return resolved ? !0 : (resolved = !0, void reject(promise, val));
                    }), !0;
                } catch (error) {
                    return resolved ? !0 : (reject(promise, error), !0);
                }
                return !1;
            }
            function resolve(promise, value) {
                promise === value ? fulfill(promise, value) : handleThenable(promise, value) || fulfill(promise, value);
            }
            function fulfill(promise, value) {
                promise._state === PENDING && (promise._state = SEALED, promise._detail = value, 
                config.async(publishFulfillment, promise));
            }
            function reject(promise, reason) {
                promise._state === PENDING && (promise._state = SEALED, promise._detail = reason, 
                config.async(publishRejection, promise));
            }
            function publishFulfillment(promise) {
                publish(promise, promise._state = FULFILLED);
            }
            function publishRejection(promise) {
                publish(promise, promise._state = REJECTED);
            }
            var config = require("./config").config, objectOrFunction = (require("./config").configure, 
            require("./utils").objectOrFunction), isFunction = require("./utils").isFunction, all = (require("./utils").now, 
            require("./all").all), race = require("./race").race, staticResolve = require("./resolve").resolve, staticReject = require("./reject").reject, asap = require("./asap").asap;
            config.async = asap;
            var PENDING = void 0, SEALED = 0, FULFILLED = 1, REJECTED = 2;
            Promise.prototype = {
                constructor: Promise,
                _state: void 0,
                _detail: void 0,
                _subscribers: void 0,
                then: function(onFulfillment, onRejection) {
                    var promise = this, thenPromise = new this.constructor(function() {});
                    if (this._state) {
                        var callbacks = arguments;
                        config.async(function() {
                            invokeCallback(promise._state, thenPromise, callbacks[promise._state - 1], promise._detail);
                        });
                    } else subscribe(this, thenPromise, onFulfillment, onRejection);
                    return thenPromise;
                },
                "catch": function(onRejection) {
                    return this.then(null, onRejection);
                }
            }, Promise.all = all, Promise.race = race, Promise.resolve = staticResolve, Promise.reject = staticReject, 
            exports.Promise = Promise;
        }, {
            "./all": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/all.js",
            "./asap": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/asap.js",
            "./config": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/config.js",
            "./race": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/race.js",
            "./reject": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/reject.js",
            "./resolve": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/resolve.js",
            "./utils": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/utils.js"
        } ],
        "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/race.js": [ function(require, module, exports) {
            "use strict";
            function race(promises) {
                var Promise = this;
                if (!isArray(promises)) throw new TypeError("You must pass an array to race.");
                return new Promise(function(resolve, reject) {
                    for (var promise, i = 0; i < promises.length; i++) promise = promises[i], promise && "function" == typeof promise.then ? promise.then(resolve, reject) : resolve(promise);
                });
            }
            var isArray = require("./utils").isArray;
            exports.race = race;
        }, {
            "./utils": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/utils.js"
        } ],
        "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/reject.js": [ function(require, module, exports) {
            "use strict";
            function reject(reason) {
                var Promise = this;
                return new Promise(function(resolve, reject) {
                    reject(reason);
                });
            }
            exports.reject = reject;
        }, {} ],
        "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/resolve.js": [ function(require, module, exports) {
            "use strict";
            function resolve(value) {
                if (value && "object" == typeof value && value.constructor === this) return value;
                var Promise = this;
                return new Promise(function(resolve) {
                    resolve(value);
                });
            }
            exports.resolve = resolve;
        }, {} ],
        "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/promise/utils.js": [ function(require, module, exports) {
            "use strict";
            function objectOrFunction(x) {
                return isFunction(x) || "object" == typeof x && null !== x;
            }
            function isFunction(x) {
                return "function" == typeof x;
            }
            function isArray(x) {
                return "[object Array]" === Object.prototype.toString.call(x);
            }
            var now = Date.now || function() {
                return new Date().getTime();
            };
            exports.objectOrFunction = objectOrFunction, exports.isFunction = isFunction, exports.isArray = isArray, 
            exports.now = now;
        }, {} ],
        "/Users/dave/dev/projects/myna-js/node_modules/grunt-browserify/node_modules/browserify/node_modules/process/browser.js": [ function(require, module) {
            function noop() {}
            var process = module.exports = {};
            process.nextTick = function() {
                var canSetImmediate = "undefined" != typeof window && window.setImmediate, canPost = "undefined" != typeof window && window.postMessage && window.addEventListener;
                if (canSetImmediate) return function(f) {
                    return window.setImmediate(f);
                };
                if (canPost) {
                    var queue = [];
                    return window.addEventListener("message", function(ev) {
                        var source = ev.source;
                        if ((source === window || null === source) && "process-tick" === ev.data && (ev.stopPropagation(), 
                        queue.length > 0)) {
                            var fn = queue.shift();
                            fn();
                        }
                    }, !0), function(fn) {
                        queue.push(fn), window.postMessage("process-tick", "*");
                    };
                }
                return function(fn) {
                    setTimeout(fn, 0);
                };
            }(), process.title = "browser", process.browser = !0, process.env = {}, process.argv = [], 
            process.on = noop, process.addListener = noop, process.once = noop, process.off = noop, 
            process.removeListener = noop, process.removeAllListeners = noop, process.emit = noop, 
            process.binding = function() {
                throw new Error("process.binding is not supported");
            }, process.cwd = function() {
                return "/";
            }, process.chdir = function() {
                throw new Error("process.chdir is not supported");
            };
        }, {} ],
        "/Users/dave/dev/projects/myna-js/src/main/bootstrap.coffee": [ function(require, module) {
            var create, createLocalInit, createRemoteInit, hash, jsonp, log;
            log = require("./common/log"), hash = require("./common/hash"), jsonp = require("./common/jsonp"), 
            create = function(createClient) {
                var initLocal, initRemote;
                return initLocal = createLocalInit(createClient), initRemote = createRemoteInit(initLocal), 
                {
                    initLocal: initLocal,
                    initRemote: initRemote
                };
            }, createLocalInit = function(createClient) {
                return function(deployment) {
                    var apiKey, apiRoot, client, experiments, settings, _ref, _ref1;
                    return null != hash.params.debug && (log.enabled = !0), log.debug("myna.initLocal", deployment), 
                    "deployment" !== deployment.typename && log.error("myna.initLocal", 'Myna needs a deployment to initialise. The given JSON is not a deployment.\nIt has a typename of "' + typename + '". Check you are initialising Myna with the\ncorrect UUID if you are calling initRemote', deployment), 
                    experiments = deployment.experiments, apiKey = null != (_ref = deployment.apiKey) ? _ref : log.error("myna.init", "no apiKey in deployment", deployment), 
                    apiRoot = null != (_ref1 = deployment.apiRoot) ? _ref1 : "//api.mynaweb.com", settings = util["extends"](deployment.settings, {
                        apiKey: apiKey,
                        apiRoot: apiRoot
                    }), client = createClient(experiments, settings), client.sync().then(function() {
                        return client;
                    });
                };
            }, createRemoteInit = function(localInit) {
                return function(url, timeout) {
                    return null == timeout && (timeout = 0), log.debug("myna.initRemote", url, timeout), 
                    jsonp.request(url, {}, timeout).then(localInit);
                };
            }, module.exports = {
                create: create,
                createLocalInit: createLocalInit,
                createRemoteInit: createRemoteInit
            };
        }, {
            "./common/hash": "/Users/dave/dev/projects/myna-js/src/main/common/hash.coffee",
            "./common/jsonp": "/Users/dave/dev/projects/myna-js/src/main/common/jsonp.coffee",
            "./common/log": "/Users/dave/dev/projects/myna-js/src/main/common/log.coffee"
        } ],
        "/Users/dave/dev/projects/myna-js/src/main/client/api.coffee": [ function(require, module) {
            var ApiRecorder, Promise, SyncResult, jsonp, log, settings, storage, util, __bind = function(fn, me) {
                return function() {
                    return fn.apply(me, arguments);
                };
            }, __slice = [].slice;
            Promise = require("es6-promise").Promise, jsonp = require("../common/jsonp"), log = require("../common/log"), 
            settings = require("../common/settings"), storage = require("../common/storage"), 
            util = require("../common/util"), SyncResult = function() {
                function SyncResult(completed, discarded, requeued) {
                    this.completed = null != completed ? completed : [], this.discarded = null != discarded ? discarded : [], 
                    this.requeued = null != requeued ? requeued : [], this.successful = __bind(this.successful, this), 
                    this.requeue = __bind(this.requeue, this), this.discard = __bind(this.discard, this), 
                    this.complete = __bind(this.complete, this);
                }
                return SyncResult.prototype.complete = function(completed) {
                    return new SyncResult(this.completed.concat([ completed ]), this.discarded, this.requeued);
                }, SyncResult.prototype.discard = function(discarded) {
                    return new SyncResult(this.completed, this.discarded.concat([ discarded ]), this.requeued);
                }, SyncResult.prototype.requeue = function(requeued) {
                    return new SyncResult(this.completed, this.discarded, this.requeued.concat([ requeued ]));
                }, SyncResult.prototype.successful = function() {
                    return 0 === this.discarded.length && 0 === this.requeued.length;
                }, SyncResult;
            }(), module.exports = ApiRecorder = function() {
                function ApiRecorder(apiKey, apiRoot, options) {
                    this.apiKey = apiKey, this.apiRoot = apiRoot, null == options && (options = {}), 
                    this._dequeue = __bind(this._dequeue, this), this._enqueue = __bind(this._enqueue, this), 
                    this._queue = __bind(this._queue, this), this.clear = __bind(this.clear, this), 
                    this.sync = __bind(this.sync, this), this.reward = __bind(this.reward, this), this.view = __bind(this.view, this), 
                    this.apiKey || log.error("ApiRecorder.constructor", "missing apiKey"), this.apiRoot || log.error("ApiRecorder.constructor", "missing apiRoot"), 
                    this.storageKey = settings.get(options, "myna.web.storageKey", "myna"), this.timeout = settings.get(options, "myna.web.timeout", 1e3), 
                    this.inProgress = null;
                }
                return ApiRecorder.prototype.view = function(expt, variant) {
                    var event;
                    return event = {
                        typename: "view",
                        experiment: expt.uuid,
                        variant: variant.id,
                        timestamp: util.dateToString(new Date())
                    }, log.debug("ApiRecorder.view", event), this._enqueue(event);
                }, ApiRecorder.prototype.reward = function(expt, variant, amount) {
                    var event;
                    return event = {
                        typename: "reward",
                        experiment: expt.uuid,
                        variant: variant.id,
                        amount: amount,
                        timestamp: util.dateToString(new Date())
                    }, log.debug("ApiRecorder.reward", event), this._enqueue(event);
                }, ApiRecorder.prototype.sync = function() {
                    var onComplete, onError, syncAll, syncOne;
                    return log.debug("ApiRecorder.sync", this._queue().length), syncOne = function(_this) {
                        return function(event, accum) {
                            var params;
                            return null == accum && (accum = new SyncResult()), log.debug("ApiRecorder.sync.syncOne", event, accum), 
                            params = util.extend({}, event, {
                                apikey: _this.apiKey
                            }), params = util.deleteKeys(params, "experiment"), jsonp.request("" + _this.apiRoot + "/v2/experiment/" + event.experiment + "/record", params, _this.timeout).then(function(response) {
                                return log.debug("ApiRecorder.sync.syncOne.then", response), syncAll(accum.complete(event));
                            })["catch"](function(response) {
                                return log.debug("ApiRecorder.sync.syncOne.catch", response), response.status && response.status >= 500 ? accum.requeue(event) : accum.discard(event);
                            });
                        };
                    }(this), syncAll = function(_this) {
                        return function(accum) {
                            var event;
                            return null == accum && (accum = new SyncResult()), log.debug("ApiRecorder.sync.syncAll", accum), 
                            event = _this._dequeue(), event ? syncOne(event, accum).then(syncAll) : (_this._enqueue.apply(_this, accum.requeued), 
                            Promise.resolve(accum));
                        };
                    }(this), onComplete = function(_this) {
                        return function(result) {
                            return log.debug("ApiRecorder.sync.onComplete", result), _this.inProgress = null, 
                            result;
                        };
                    }(this), onError = function(_this) {
                        return function(result) {
                            return log.debug("ApiRecorder.sync.onError", result), _this.inProgress = null, Promise.reject(result);
                        };
                    }(this), null == this.inProgress && (this.inProgress = syncAll().then(onComplete, onError)), 
                    this.inProgress;
                }, ApiRecorder.prototype.clear = function() {
                    log.debug("ApiRecorder.clear"), storage.remove(this.storageKey);
                }, ApiRecorder.prototype._queue = function() {
                    var ans, _ref;
                    return ans = null != (_ref = storage.get(this.storageKey)) ? _ref : [];
                }, ApiRecorder.prototype._enqueue = function() {
                    var events, queue, _ref;
                    return events = 1 <= arguments.length ? __slice.call(arguments, 0) : [], queue = (_ref = this._queue()).concat.apply(_ref, events), 
                    storage.set(this.storageKey, queue), queue.length;
                }, ApiRecorder.prototype._dequeue = function() {
                    var event, queue;
                    return queue = this._queue(), queue.length > 0 ? (event = queue.shift(), storage.set(this.storageKey, queue), 
                    event) : null;
                }, ApiRecorder;
            }();
        }, {
            "../common/jsonp": "/Users/dave/dev/projects/myna-js/src/main/common/jsonp.coffee",
            "../common/log": "/Users/dave/dev/projects/myna-js/src/main/common/log.coffee",
            "../common/settings": "/Users/dave/dev/projects/myna-js/src/main/common/settings/index.coffee",
            "../common/storage": "/Users/dave/dev/projects/myna-js/src/main/common/storage/index.coffee",
            "../common/util": "/Users/dave/dev/projects/myna-js/src/main/common/util.coffee",
            "es6-promise": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/main.js"
        } ],
        "/Users/dave/dev/projects/myna-js/src/main/client/basic.coffee": [ function(require, module) {
            var BasicClient, Promise, log, variant, __bind = function(fn, me) {
                return function() {
                    return fn.apply(me, arguments);
                };
            };
            Promise = require("es6-promise").Promise, log = require("../common/log"), variant = require("./variant"), 
            module.exports = BasicClient = function() {
                function BasicClient() {
                    this._lookup = __bind(this._lookup, this), this._random = __bind(this._random, this), 
                    this.reward = __bind(this.reward, this), this.view = __bind(this.view, this), this.suggest = __bind(this.suggest, this);
                }
                return BasicClient.prototype.suggest = function(expt) {
                    return this._random(expt).then(function() {
                        return function(variant) {
                            return log.debug("BasicClient.suggest", null != expt ? expt.id : void 0, null != variant ? variant.id : void 0), 
                            variant;
                        };
                    }(this));
                }, BasicClient.prototype.view = function(expt, variantOrId) {
                    return this._lookup(expt, variantOrId).then(function() {
                        return function(variant) {
                            return log.debug("BasicClient.suggest", null != expt ? expt.id : void 0, null != variant ? variant.id : void 0), 
                            variant;
                        };
                    }(this));
                }, BasicClient.prototype.reward = function(expt, variantOrId, amount) {
                    return null == amount && (amount = 1), log.debug("BasicClient.reward", null != expt ? expt.id : void 0, variantOrId, amount), 
                    this._lookup(expt, variantOrId);
                }, BasicClient.prototype._random = function(expt) {
                    var ans;
                    return ans = variant.random(expt), ans ? Promise.resolve(ans) : Promise.reject(new Error("Could not choose random variant"));
                }, BasicClient.prototype._lookup = function(expt, variantOrId) {
                    var ans;
                    return ans = variant.lookup(expt, variantOrId), ans ? Promise.resolve(ans) : Promise.reject(new Error("Could not choose random variant"));
                }, BasicClient;
            }();
        }, {
            "../common/log": "/Users/dave/dev/projects/myna-js/src/main/common/log.coffee",
            "./variant": "/Users/dave/dev/projects/myna-js/src/main/client/variant.coffee",
            "es6-promise": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/main.js"
        } ],
        "/Users/dave/dev/projects/myna-js/src/main/client/cached.coffee": [ function(require, module) {
            var BasicClient, CachedClient, Promise, log, variant, __bind = function(fn, me) {
                return function() {
                    return fn.apply(me, arguments);
                };
            }, __hasProp = {}.hasOwnProperty, __extends = function(child, parent) {
                function ctor() {
                    this.constructor = child;
                }
                for (var key in parent) __hasProp.call(parent, key) && (child[key] = parent[key]);
                return ctor.prototype = parent.prototype, child.prototype = new ctor(), child.__super__ = parent.prototype, 
                child;
            };
            Promise = require("es6-promise").Promise, log = require("../common/log"), BasicClient = require("./basic"), 
            variant = require("./variant"), module.exports = CachedClient = function(_super) {
                function CachedClient() {
                    return this.clear = __bind(this.clear, this), this.reward = __bind(this.reward, this), 
                    this.view = __bind(this.view, this), this.suggest = __bind(this.suggest, this), 
                    CachedClient.__super__.constructor.apply(this, arguments);
                }
                return __extends(CachedClient, _super), CachedClient.prototype.suggest = function(expt) {
                    return log.debug("CachedClient.suggest", expt), CachedClient.__super__.suggest.call(this, expt).then(function() {
                        return function(vrnt) {
                            return log.debug("CachedClient.suggest", "variant", vrnt), variant.save(expt, "lastView", vrnt), 
                            vrnt;
                        };
                    }(this));
                }, CachedClient.prototype.view = function(expt, variantOrId) {
                    return log.debug("CachedClient.view", expt, variantOrId), CachedClient.__super__.view.call(this, expt, variantOrId).then(function() {
                        return function(vrnt) {
                            return log.debug("CachedClient.view", "variant", vrnt), variant.save(expt, "lastView", vrnt), 
                            vrnt;
                        };
                    }(this));
                }, CachedClient.prototype.reward = function(expt, amount) {
                    var lastView;
                    return null == amount && (amount = 1), log.debug("CachedClient.reward", expt, amount), 
                    lastView = variant.load(expt, "lastView"), log.debug("lastView", lastView), lastView ? CachedClient.__super__.reward.call(this, expt, lastView, amount).then(function() {
                        return function(vrnt) {
                            return log.debug("CachedClient.reward", "variant", vrnt), variant.remove(expt, "lastView"), 
                            vrnt;
                        };
                    }(this)) : (log.debug("suffering epic fail"), Promise.reject(new Error("No last view for experiment " + expt.id + " (" + expt.uuid + ")")));
                }, CachedClient.prototype.clear = function(expt) {
                    return log.debug("CachedClient.clear", expt), variant.remove(expt, "lastView"), 
                    Promise.resolve(null);
                }, CachedClient;
            }(BasicClient);
        }, {
            "../common/log": "/Users/dave/dev/projects/myna-js/src/main/common/log.coffee",
            "./basic": "/Users/dave/dev/projects/myna-js/src/main/client/basic.coffee",
            "./variant": "/Users/dave/dev/projects/myna-js/src/main/client/variant.coffee",
            "es6-promise": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/main.js"
        } ],
        "/Users/dave/dev/projects/myna-js/src/main/client/default.coffee": [ function(require, module) {
            var ApiRecorder, CachedClient, DefaultClient, GaRecorder, Promise, StickyCache, log, settings, __bind = function(fn, me) {
                return function() {
                    return fn.apply(me, arguments);
                };
            }, __hasProp = {}.hasOwnProperty, __extends = function(child, parent) {
                function ctor() {
                    this.constructor = child;
                }
                for (var key in parent) __hasProp.call(parent, key) && (child[key] = parent[key]);
                return ctor.prototype = parent.prototype, child.prototype = new ctor(), child.__super__ = parent.prototype, 
                child;
            };
            Promise = require("es6-promise").Promise, log = require("../common/log"), settings = require("../common/settings"), 
            CachedClient = require("./cached"), StickyCache = require("./sticky"), ApiRecorder = require("./api"), 
            GaRecorder = require("./ga"), module.exports = DefaultClient = function(_super) {
                function DefaultClient(experiments, options) {
                    var expt, _i, _len, _ref, _ref1, _ref2;
                    for (null == experiments && (experiments = []), null == options && (options = {}), 
                    this._withStickyReward = __bind(this._withStickyReward, this), this._withStickyView = __bind(this._withStickyView, this), 
                    this._withExperiment = __bind(this._withExperiment, this), this.clear = __bind(this.clear, this), 
                    this.reward = __bind(this.reward, this), this.view = __bind(this.view, this), this.suggest = __bind(this.suggest, this), 
                    log.debug("DefaultClient.constructor", options), this.apiKey = null != (_ref = options.apiKey) ? _ref : log.error("Client.constructor", "no apiKey specified", options), 
                    this.apiRoot = null != (_ref1 = options.apiRoot) ? _ref1 : "//api.mynaweb.com", 
                    this.settings = settings.create(null != (_ref2 = null != options ? options.settings : void 0) ? _ref2 : {}), 
                    this.sticky = new StickyCache(), this.record = new ApiRecorder(this.apiKey, this.apiRoot, this.settings), 
                    this.google = new GaRecorder(this.settings), this.autoSync = settings.get(this.settings, "myna.web.autoSync", !0), 
                    this.experiments = {}, _i = 0, _len = experiments.length; _len > _i; _i++) expt = experiments[_i], 
                    this.experiments[expt.id] = expt;
                }
                return __extends(DefaultClient, _super), DefaultClient.prototype.suggest = function(exptOrId) {
                    return log.debug("DefaultClient.suggest", exptOrId), this._withExperiment(exptOrId).then(function(_this) {
                        return function(expt) {
                            return _this._withStickyView(expt)["catch"](function() {
                                return DefaultClient.__super__.suggest.call(_this, expt).then(function(variant) {
                                    return _this.sticky.saveView(expt, variant), _this.google.view(expt, variant), _this.record.view(expt, variant), 
                                    _this.autoSync && _this.record.sync(), variant;
                                });
                            });
                        };
                    }(this));
                }, DefaultClient.prototype.view = function(exptOrId, variantOrId) {
                    return log.debug("DefaultClient.view", exptOrId, variantOrId), this._withExperiment(exptOrId).then(function(_this) {
                        return function(expt) {
                            return _this._withStickyView(expt)["catch"](function() {
                                return DefaultClient.__super__.view.call(_this, expt, variantOrId).then(function(variant) {
                                    return _this.sticky.saveView(expt, variant), _this.google.view(expt, variant), _this.record.view(expt, variant), 
                                    _this.autoSync && _this.record.sync(), variant;
                                });
                            });
                        };
                    }(this));
                }, DefaultClient.prototype.reward = function(exptOrId, amount) {
                    return null == amount && (amount = 1), log.debug("DefaultClient.reward", exptOrId, amount), 
                    this._withExperiment(exptOrId).then(function(_this) {
                        return function(expt) {
                            return _this._withStickyReward(expt)["catch"](function() {
                                return DefaultClient.__super__.reward.call(_this, expt, amount).then(function(variant) {
                                    return _this.sticky.saveReward(expt, variant), _this.google.reward(expt, variant, amount), 
                                    _this.record.reward(expt, variant, amount), _this.autoSync ? _this.record.sync().then(function() {
                                        return variant;
                                    }) : variant;
                                });
                            });
                        };
                    }(this));
                }, DefaultClient.prototype.clear = function(exptOrId) {
                    return log.debug("DefaultClient.clear", exptOrId), this._withExperiment(exptOrId).then(function(_this) {
                        return function(expt) {
                            return DefaultClient.__super__.clear.call(_this, expt).then(function() {
                                return _this.sticky.clear(expt), Promise.resolve(null);
                            });
                        };
                    }(this));
                }, DefaultClient.prototype._withExperiment = function(exptOrId) {
                    var expt;
                    return expt = "string" == typeof exptOrId ? this.experiments[exptOrId] : exptOrId, 
                    expt ? Promise.resolve(expt) : Promise.reject(new Error("Experiment not found: " + exptOrId));
                }, DefaultClient.prototype._withStickyView = function(expt) {
                    var variant;
                    return variant = this.sticky.loadView(expt), variant ? Promise.resolve(variant) : Promise.reject(new Error("Sticky view not found: " + expt));
                }, DefaultClient.prototype._withStickyReward = function(expt) {
                    var variant;
                    return variant = this.sticky.loadReward(expt), variant ? Promise.resolve(variant) : Promise.reject(new Error("Sticky reward not found: " + expt));
                }, DefaultClient;
            }(CachedClient);
        }, {
            "../common/log": "/Users/dave/dev/projects/myna-js/src/main/common/log.coffee",
            "../common/settings": "/Users/dave/dev/projects/myna-js/src/main/common/settings/index.coffee",
            "./api": "/Users/dave/dev/projects/myna-js/src/main/client/api.coffee",
            "./cached": "/Users/dave/dev/projects/myna-js/src/main/client/cached.coffee",
            "./ga": "/Users/dave/dev/projects/myna-js/src/main/client/ga.coffee",
            "./sticky": "/Users/dave/dev/projects/myna-js/src/main/client/sticky.coffee",
            "es6-promise": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/main.js"
        } ],
        "/Users/dave/dev/projects/myna-js/src/main/client/ga.coffee": [ function(require, module) {
            var GaRecorder, log, settings, __bind = function(fn, me) {
                return function() {
                    return fn.apply(me, arguments);
                };
            };
            log = require("../common/log"), settings = require("../common/settings"), module.exports = GaRecorder = function() {
                function GaRecorder(settings) {
                    this.settings = settings, this._rewardMultiplier = __bind(this._rewardMultiplier, this), 
                    this._eventName = __bind(this._eventName, this), this._enabled = __bind(this._enabled, this), 
                    this._rewardEvent = __bind(this._rewardEvent, this), this._viewEvent = __bind(this._viewEvent, this), 
                    this.reward = __bind(this.reward, this), this.view = __bind(this.view, this);
                }
                return GaRecorder.prototype.view = function(expt, variant) {
                    var _ref;
                    log.debug("GoogleAnalytics.view", expt, variant), this._enabled(expt) && null != (_ref = window._gaq) && _ref.push(this._viewEvent(expt, variant));
                }, GaRecorder.prototype.reward = function(expt, variant, amount) {
                    var _ref;
                    log.debug("GoogleAnalytics.reward", expt, variant), this._enabled(expt) && null != (_ref = window._gaq) && _ref.push(this._rewardEvent(expt, variant, amount));
                }, GaRecorder.prototype._viewEvent = function(expt, variant) {
                    return [ "_trackEvent", "myna", this._eventName(expt, "view"), variant.id, null, !1 ];
                }, GaRecorder.prototype._rewardEvent = function(expt, variant, amount) {
                    var multiplier;
                    return multiplier = this._rewardMultiplier(expt), [ "_trackEvent", "myna", this._eventName(expt, "reward"), variant.id, Math.round(multiplier * amount), !0 ];
                }, GaRecorder.prototype._enabled = function(expt) {
                    return settings.get(expt.settings, "myna.web.googleAnalytics.enabled", !0);
                }, GaRecorder.prototype._eventName = function(expt, event) {
                    var _ref;
                    return null != (_ref = settings.get(expt.settings, "myna.web.googleAnalytics." + event + "Event")) ? _ref : "" + expt.id + "-" + event;
                }, GaRecorder.prototype._rewardMultiplier = function(expt) {
                    return settings.get(expt.settings, "myna.web.googleAnalytics.rewardMultiplier", 100);
                }, GaRecorder;
            }();
        }, {
            "../common/log": "/Users/dave/dev/projects/myna-js/src/main/common/log.coffee",
            "../common/settings": "/Users/dave/dev/projects/myna-js/src/main/common/settings/index.coffee"
        } ],
        "/Users/dave/dev/projects/myna-js/src/main/client/sticky.coffee": [ function(require, module) {
            var Promise, StickyCache, log, settings, variant, __bind = function(fn, me) {
                return function() {
                    return fn.apply(me, arguments);
                };
            };
            Promise = require("es6-promise").Promise, log = require("../common/log"), settings = require("../common/settings"), 
            variant = require("./variant"), module.exports = StickyCache = function() {
                function StickyCache(stickyKey) {
                    this.stickyKey = null != stickyKey ? stickyKey : "myna.web.sticky", this._isSticky = __bind(this._isSticky, this), 
                    this.clear = __bind(this.clear, this), this.saveReward = __bind(this.saveReward, this), 
                    this.loadReward = __bind(this.loadReward, this), this.saveView = __bind(this.saveView, this), 
                    this.loadView = __bind(this.loadView, this);
                }
                return StickyCache.prototype.loadView = function(expt) {
                    var ans;
                    return log.debug("StickyCache.loadView", expt), ans = this._isSticky(expt) ? variant.load(expt, "stickyView") : null, 
                    log.debug("StickyCache.loadView", null != expt ? expt.id : void 0, null != ans ? ans.id : void 0), 
                    ans;
                }, StickyCache.prototype.saveView = function(expt, v) {
                    log.debug("StickyCache.saveView", null != expt ? expt.id : void 0, null != v ? v.id : void 0), 
                    this._isSticky(expt) && variant.save(expt, "stickyView", v);
                }, StickyCache.prototype.loadReward = function(expt) {
                    var ans;
                    return ans = this._isSticky(expt) ? variant.load(expt, "stickyReward") : null, log.debug("StickyCache.loadReward", null != expt ? expt.id : void 0, null != ans ? ans.id : void 0), 
                    ans;
                }, StickyCache.prototype.saveReward = function(expt, v) {
                    log.debug("StickyCache.saveReward", null != expt ? expt.id : void 0, null != v ? v.id : void 0), 
                    this._isSticky(expt) && variant.save(expt, "stickyReward", v);
                }, StickyCache.prototype.clear = function(expt) {
                    log.debug("StickyCache.clear", expt), variant.remove(expt, "stickyView"), variant.remove(expt, "stickyReward");
                }, StickyCache.prototype._isSticky = function(expt) {
                    return !!settings.get(expt.settings, this.stickyKey, !1);
                }, StickyCache;
            }();
        }, {
            "../common/log": "/Users/dave/dev/projects/myna-js/src/main/common/log.coffee",
            "../common/settings": "/Users/dave/dev/projects/myna-js/src/main/common/settings/index.coffee",
            "./variant": "/Users/dave/dev/projects/myna-js/src/main/client/variant.coffee",
            "es6-promise": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/main.js"
        } ],
        "/Users/dave/dev/projects/myna-js/src/main/client/variant.coffee": [ function(require, module) {
            var Promise, load, log, lookup, random, remove, save, storage, _totalWeight;
            Promise = require("es6-promise").Promise, log = require("../common/log"), storage = require("../common/storage"), 
            save = function(expt, storageKey, variant) {
                storage.set("" + expt.uuid + "_" + storageKey, variant.id);
            }, load = function(expt, storageKey) {
                var id, _ref;
                return id = null != (_ref = storage.get("" + expt.uuid + "_" + storageKey)) ? _ref : null, 
                log.debug("variant.load", "id", id), id ? lookup(expt, id) : null;
            }, remove = function(expt, storageKey) {
                storage.remove("" + expt.uuid + "_" + storageKey);
            }, lookup = function(expt, variantOrId) {
                var id, variant, _i, _len, _ref;
                for (id = variantOrId.id ? variantOrId.id : variantOrId, _ref = expt.variants, _i = 0, 
                _len = _ref.length; _len > _i; _i++) if (variant = _ref[_i], variant.id === id) return variant;
                return null;
            }, random = function(expt) {
                var id, total, variant, _ref;
                total = _totalWeight(expt), random = Math.random() * total, _ref = expt.variants;
                for (id in _ref) if (variant = _ref[id], total -= variant.weight, random >= total) return variant;
                return null;
            }, _totalWeight = function(expt) {
                var ans, variant, _i, _len, _ref;
                for (ans = 0, _ref = expt.variants, _i = 0, _len = _ref.length; _len > _i; _i++) variant = _ref[_i], 
                ans += variant.weight;
                return ans;
            }, module.exports = {
                save: save,
                load: load,
                remove: remove,
                lookup: lookup,
                random: random,
                _totalWeight: _totalWeight
            };
        }, {
            "../common/log": "/Users/dave/dev/projects/myna-js/src/main/common/log.coffee",
            "../common/storage": "/Users/dave/dev/projects/myna-js/src/main/common/storage/index.coffee",
            "es6-promise": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/main.js"
        } ],
        "/Users/dave/dev/projects/myna-js/src/main/common/hash.coffee": [ function(require, module) {
            var log, params, parse;
            log = require("./log"), parse = function(hash) {
                var ans, lhs, part, rhs, _i, _len, _ref, _ref1;
                for (hash = hash ? "#" === hash[0] ? hash.substring(1) : hash : "", ans = {}, _ref = hash.split("&"), 
                _i = 0, _len = _ref.length; _len > _i; _i++) part = _ref[_i], "" !== part && (_ref1 = part.split("="), 
                lhs = _ref1[0], rhs = _ref1[1], ans[decodeURIComponent(lhs)] = decodeURIComponent(null != rhs ? rhs : lhs));
                return log.debug("hash.parse", ans), ans;
            }, params = parse(window.location.hash), module.exports = {
                parse: parse,
                params: params
            };
        }, {
            "./log": "/Users/dave/dev/projects/myna-js/src/main/common/log.coffee"
        } ],
        "/Users/dave/dev/projects/myna-js/src/main/common/jsonp.coffee": [ function(require, module) {
            var Promise, jsonp, log;
            Promise = require("es6-promise").Promise, log = require("./log"), module.exports = jsonp = {}, 
            window.__mynaCallbacks = {}, jsonp.request = function(url, params, timeout) {
                return null == params && (params = {}), null == timeout && (timeout = 0), log.debug("jsonp.request", url, params, timeout), 
                new Promise(function(resolve, reject) {
                    var callbackId, onComplete, onTimeout, resolved, timer;
                    resolved = !1, onTimeout = function() {
                        log.debug("jsonp.request.onTimeout", callbackId, resolved, timeout), resolved || (resolved = !0, 
                        jsonp._removeCallback(callbackId), reject(jsonp._createTimeoutError(callbackId)));
                    }, onComplete = function(response) {
                        log.debug("jsonp.request.onComplete", callbackId, resolved, response), resolved || (resolved = !0, 
                        window.clearTimeout(timer), jsonp._removeCallback(callbackId), "problem" === response.typename ? reject(response) : resolve(response));
                    }, timer = timeout ? window.setTimeout(onTimeout, timeout) : null, callbackId = jsonp._createCallback(url, params, onComplete);
                });
            }, jsonp._createCallback = function(url, params, callback) {
                var callbackId, randSuffix, scriptElem, timeSuffix;
                return randSuffix = "" + Math.floor(1e4 * Math.random()), timeSuffix = new Date().getTime(), 
                callbackId = "c" + timeSuffix + "_" + randSuffix, window.__mynaCallbacks[callbackId] = callback, 
                url = jsonp._createUrl(url, params, callbackId), scriptElem = jsonp._createScriptElem(url, callbackId), 
                document.getElementsByTagName("head")[0].appendChild(scriptElem), callbackId;
            }, jsonp._removeCallback = function(callbackId) {
                var exn, readyState, scriptElem;
                scriptElem = document.getElementById(callbackId), readyState = null != scriptElem ? scriptElem.readyState : void 0, 
                !window.__mynaCallbacks[callbackId] || readyState && "complete" !== readyState && "loaded" !== readyState || (scriptElem.onload = scriptElem.onreadystatechange = null, 
                scriptElem.parentNode.removeChild(scriptElem));
                try {
                    window.__mynaCallbacks[callbackId] = null, delete window.__mynaCallbacks[callbackId];
                } catch (_error) {
                    exn = _error;
                }
            }, jsonp._createUrl = function(url, params, callbackId) {
                var ans, key, value;
                null == params && (params = {}), ans = url, ans += url.indexOf("?") < 0 ? "?" : "&";
                for (key in params) value = params[key], ans += "" + key + "=" + value + "&";
                return ans += "callback=__mynaCallbacks." + callbackId, log.debug("jsonp._createUrl", ans), 
                ans;
            }, jsonp._createScriptElem = function(url, callbackId) {
                var scriptElem;
                return scriptElem = document.createElement("script"), scriptElem.setAttribute("id", callbackId), 
                scriptElem.setAttribute("type", "text/javascript"), scriptElem.setAttribute("async", "true"), 
                scriptElem.setAttribute("src", url), scriptElem.setAttribute("class", "myna-jsonp"), 
                scriptElem.setAttribute("data-callback", callbackId), scriptElem.onload = scriptElem.onreadystatechange = function() {
                    jsonp._removeCallback(callbackId);
                }, scriptElem;
            }, jsonp._createTimeoutError = function(callbackId) {
                return {
                    typename: "problem",
                    status: 500,
                    messages: [ {
                        typename: "timeout",
                        message: "request timed out after #{timeout}ms",
                        callback: callbackId
                    } ]
                };
            };
        }, {
            "./log": "/Users/dave/dev/projects/myna-js/src/main/common/log.coffee",
            "es6-promise": "/Users/dave/dev/projects/myna-js/node_modules/es6-promise/dist/commonjs/main.js"
        } ],
        "/Users/dave/dev/projects/myna-js/src/main/common/log.coffee": [ function(require, module) {
            var debug, enabled, error, __slice = [].slice;
            enabled = !1, debug = function() {
                var args, _ref;
                args = 1 <= arguments.length ? __slice.call(arguments, 0) : [], enabled && null != (_ref = window.console) && _ref.log(args);
            }, error = function() {
                var args, _ref;
                throw args = 1 <= arguments.length ? __slice.call(arguments, 0) : [], enabled && null != (_ref = window.console) && _ref.error(args), 
                args;
            }, module.exports = {
                enabled: enabled,
                debug: debug,
                error: error
            };
        }, {} ],
        "/Users/dave/dev/projects/myna-js/src/main/common/settings/index.coffee": [ function(require, module) {
            var Path, create, flatten, get, paths, set, unset, util, _setAll, _setOne;
            util = require("../util"), Path = require("./path"), create = function(updates) {
                return _setAll({}, updates);
            }, get = function(data, path, orElse) {
                var _ref;
                return null == orElse && (orElse = void 0), null != (_ref = new Path(path).get(data)) ? _ref : orElse;
            }, set = function(data) {
                if (arguments.length < 2) throw [ "settings.set", "not enough arguments", arguments ];
                return "object" == typeof arguments[1] ? _setAll(data, arguments[1]) : _setOne(data, arguments[1], arguments[2]);
            }, _setAll = function(data, updates) {
                var path, value;
                for (path in updates) value = updates[path], data = _setOne(data, path, value);
                return data;
            }, _setOne = function(data, path, value) {
                return new Path(path).set(data, value);
            }, unset = function(data, path) {
                return new Path(path).unset(data);
            }, flatten = function() {
                var ans, normalize, visit;
                return ans = [], normalize = function(path) {
                    return "." === path[0] ? path.substring(1) : path;
                }, visit = function(value, path) {
                    var i, k, v, _i, _len, _results, _results1;
                    if (null == path && (path = ""), util.isArray(value)) {
                        for (_results = [], v = _i = 0, _len = value.length; _len > _i; v = ++_i) i = value[v], 
                        _results.push(visit(v, path + "[" + i + "]"));
                        return _results;
                    }
                    if (util.isObject(value)) {
                        _results1 = [];
                        for (k in value) v = value[k], _results1.push(visit(v, path + "." + k));
                        return _results1;
                    }
                    return ans.push([ normalize(path), value ]);
                }, visit(this.data), ans;
            }, paths = function(data) {
                return _.map(flatten(data), function(pair) {
                    return pair[0];
                }), {
                    toJSON: function(_this) {
                        return function(options) {
                            return null == options && (options = {}), _this.data;
                        };
                    }(this)
                };
            }, module.exports = {
                Path: Path,
                create: create,
                get: get,
                set: set,
                unset: unset,
                flatten: flatten,
                paths: paths
            };
        }, {
            "../util": "/Users/dave/dev/projects/myna-js/src/main/common/util.coffee",
            "./path": "/Users/dave/dev/projects/myna-js/src/main/common/settings/path.coffee"
        } ],
        "/Users/dave/dev/projects/myna-js/src/main/common/settings/path.coffee": [ function(require, module) {
            var Path, util, __bind = function(fn, me) {
                return function() {
                    return fn.apply(me, arguments);
                };
            }, __slice = [].slice;
            util = require("../util"), module.exports = Path = function() {
                function Path(input) {
                    this.toString = __bind(this.toString, this), this.drop = __bind(this.drop, this), 
                    this.take = __bind(this.take, this), this.isPrefixOf = __bind(this.isPrefixOf, this), 
                    this.prefixes = __bind(this.prefixes, this), this.unset = __bind(this.unset, this), 
                    this.set = __bind(this.set, this), this.get = __bind(this.get, this), this.path = __bind(this.path, this), 
                    this.quote = __bind(this.quote, this), this.nodes = "string" == typeof input ? Path.parse(input) : input;
                }
                return Path.identifierRegex = /^[a-z_$][a-z0-9_$]*/i, Path.integerRegex = /^[0-9]+/, 
                Path.completeIdentifierRegex = /^[a-z_$][a-z0-9_$]*$/i, Path.permissiveIdentifierRegex = /^[^[.]+/, 
                Path.isValid = function(path) {
                    var exn;
                    try {
                        return Path.parse(path), !0;
                    } catch (_error) {
                        return exn = _error, !1;
                    }
                }, Path.normalize = function(path) {
                    var exn;
                    try {
                        return new Path(path).toString();
                    } catch (_error) {
                        return exn = _error, path;
                    }
                }, Path.parse = function(originalPath) {
                    var identifier, indexField, number, path, skip, string, take, takeString, topLevel;
                    return path = originalPath, skip = function(num) {
                        if (path.length < num) throw "bad settings path: " + originalPath;
                        path = path.substring(num);
                    }, take = function(num) {
                        var ans;
                        if (path.length < num) throw "bad settings path: " + originalPath;
                        return ans = path.substring(0, num), path = path.substring(num), ans;
                    }, takeString = function(str) {
                        return path = path.substring(str.length), str;
                    }, identifier = function() {
                        var match;
                        if (match = path.match(Path.permissiveIdentifierRegex)) return takeString(match[0]);
                        throw "bad settings path: " + originalPath;
                    }, number = function() {
                        var match;
                        if (match = path.match(Path.integerRegex)) return parseInt(takeString(match[0]));
                        throw "bad settings path: " + originalPath;
                    }, string = function(quote) {
                        var ans, terminated;
                        for (skip(1), ans = "", terminated = !1; !terminated; ) path[0] === quote ? terminated = !0 : "\\" === path[0] ? (skip(1), 
                        ans += take(1)) : ans += take(1);
                        return skip(1), ans;
                    }, indexField = function() {
                        var ans;
                        return skip(1), ans = "'" === path[0] ? string("'") : '"' === path[0] ? string('"') : number(), 
                        skip(1), ans;
                    }, topLevel = function() {
                        var ans;
                        for (ans = []; path.length > 0; ) "." === path[0] ? (skip(1), ans.push(identifier())) : ans.push("[" === path[0] ? indexField() : identifier());
                        return ans;
                    }, path = util.trim(path), "" === path ? [] : "." === path[0] || "[" === path[0] ? topLevel() : (path = "." + path, 
                    topLevel());
                }, Path.prototype.quote = function(str) {
                    return str.replace(/['\"\\]/g, function(quote) {
                        return "\\" + quote;
                    });
                }, Path.prototype.path = function(nodes) {
                    var ans, node, _i, _len;
                    for (null == nodes && (nodes = this.nodes), ans = "", _i = 0, _len = nodes.length; _len > _i; _i++) node = nodes[_i], 
                    ans += "number" == typeof node ? "[" + node + "]" : Path.completeIdentifierRegex.test(node) ? "." + node : '["' + this.quote(node) + '"]';
                    return "." === ans[0] ? ans.substring(1) : ans;
                }, Path.prototype.get = function(data) {
                    var node, _i, _len, _ref;
                    for (_ref = this.nodes, _i = 0, _len = _ref.length; _len > _i; _i++) node = _ref[_i], 
                    data = null != data ? data[node] : void 0;
                    return data;
                }, Path.prototype.set = function(data, value) {
                    var first, last, node, obj, _i, _j, _len, _ref;
                    if (null != value) {
                        if (0 === this.nodes.length) return value;
                        for (obj = data, _ref = this.nodes, first = 2 <= _ref.length ? __slice.call(_ref, 0, _i = _ref.length - 1) : (_i = 0, 
                        []), last = _ref[_i++], _j = 0, _len = first.length; _len > _j; _j++) node = first[_j], 
                        "object" != typeof obj[node] && (obj[node] = {}), obj = obj[node];
                        return obj[last] = value, data;
                    }
                    return this.unset(data);
                }, Path.prototype.unset = function(data) {
                    var first, last, node, obj, _i, _j, _len, _ref;
                    if (0 === this.nodes.length) return void 0;
                    for (obj = data, _ref = this.nodes, first = 2 <= _ref.length ? __slice.call(_ref, 0, _i = _ref.length - 1) : (_i = 0, 
                    []), last = _ref[_i++], _j = 0, _len = first.length; _len > _j; _j++) {
                        if (node = first[_j], null == obj[node]) return data;
                        obj = obj[node];
                    }
                    return delete obj[last], data;
                }, Path.prototype.prefixes = function() {
                    var ans, n, nodes, _i, _ref;
                    for (nodes = this.nodes, ans = [], n = _i = 1, _ref = nodes.length; _ref >= 1 ? _ref >= _i : _i >= _ref; n = _ref >= 1 ? ++_i : --_i) ans.push(this.path(nodes.slice(0, n)));
                    return ans;
                }, Path.prototype.isPrefixOf = function(path) {
                    var a, b, num, _i, _ref;
                    if (a = this.nodes, b = path.nodes, a.length > b.length) return !1;
                    for (num = _i = 0, _ref = a.length; _ref >= 0 ? _ref > _i : _i > _ref; num = _ref >= 0 ? ++_i : --_i) if (a[num] !== b[num]) return !1;
                    return !0;
                }, Path.prototype.take = function(num) {
                    return new Path(_.take(this.nodes, num));
                }, Path.prototype.drop = function(num) {
                    return new Path(_.drop(this.nodes, num));
                }, Path.prototype.toString = function() {
                    return this.path();
                }, Path;
            }();
        }, {
            "../util": "/Users/dave/dev/projects/myna-js/src/main/common/util.coffee"
        } ],
        "/Users/dave/dev/projects/myna-js/src/main/common/storage/cookie.coffee": [ function(require, module) {
            var decodeCookieValue, encodeCookieValue, get, remove, set;
            encodeCookieValue = function(obj) {
                return encodeURIComponent(JSON.stringify(obj));
            }, decodeCookieValue = function(str) {
                return JSON.parse(0 === str.indexOf('"') ? decodeURIComponent(str.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\")) : decodeURIComponent(str));
            }, set = function(name, obj, days) {
                var date, expires, path, value;
                null == days && (days = 365), value = "myna-" + name + "=" + encodeCookieValue(obj), 
                expires = days ? (date = new Date(), date.setTime(date.getTime() + 24 * days * 60 * 60 * 1e3), 
                "; expires=" + date.toGMTString()) : "", path = "; path=/", document.cookie = "" + value + expires + path;
            }, get = function(name) {
                var cookie, cookieValue, cookies, isNameEQCookie, nameEQ, str, _i, _len;
                for (nameEQ = "myna-" + name + "=", isNameEQCookie = function(cookie) {
                    var i;
                    return i = cookie.indexOf(nameEQ), i >= 0 && cookie.substring(0, i).match("^\\s*$");
                }, cookieValue = function(cookie) {
                    var i;
                    return i = cookie.indexOf(nameEQ), cookie.substring(i + nameEQ.length, cookie.length);
                }, cookies = document.cookie.split(";"), _i = 0, _len = cookies.length; _len > _i; _i++) if (cookie = cookies[_i], 
                isNameEQCookie(cookie) && null != (str = cookieValue(cookie))) return decodeCookieValue(str);
                return null;
            }, remove = function(name) {
                set(name, "", -1);
            }, module.exports = {
                get: get,
                set: set,
                remove: remove
            };
        }, {} ],
        "/Users/dave/dev/projects/myna-js/src/main/common/storage/index.coffee": [ function(require, module) {
            var cookie, get, local, remove, set, storage;
            storage = {}, cookie = require("./cookie"), local = require("./local"), get = function() {
                return function(key) {
                    return localStorage.supported && localStorage.enabled ? localStorage.get(key) : cookie.get(key);
                };
            }(this), set = function() {
                return function(key, value) {
                    localStorage.supported && localStorage.enabled ? localStorage.set(key, value) : cookie.set(key, value);
                };
            }(this), remove = function() {
                return function(key) {
                    localStorage.supported && localStorage.enabled ? localStorage.remove(key) : cookie.remove(key);
                };
            }(this), module.exports = {
                get: get,
                set: set,
                remove: remove
            };
        }, {
            "./cookie": "/Users/dave/dev/projects/myna-js/src/main/common/storage/cookie.coffee",
            "./local": "/Users/dave/dev/projects/myna-js/src/main/common/storage/local.coffee"
        } ],
        "/Users/dave/dev/projects/myna-js/src/main/common/storage/local.coffee": [ function(require, module) {
            var enabled, exn, get, remove, set, supported;
            enabled = !1, supported = function() {
                try {
                    return localStorage.setItem("modernizer", "modernizer"), localStorage.removeItem("modernizer"), 
                    !0;
                } catch (_error) {
                    return exn = _error, !1;
                }
            }(), get = function(key) {
                var str;
                if (str = window.localStorage.getItem("myna-" + key), null == str) return null;
                try {
                    return JSON.parse(str);
                } catch (_error) {
                    return exn = _error, null;
                }
            }, set = function(key, obj) {
                null != obj ? window.localStorage.setItem("myna-" + key, JSON.stringify(obj)) : window.localStorage.removeItem("myna-" + key);
            }, remove = function(key) {
                window.localStorage.removeItem("myna-" + key);
            }, module.exports = {
                enabled: enabled,
                supported: supported,
                get: get,
                set: set,
                remove: remove
            };
        }, {} ],
        "/Users/dave/dev/projects/myna-js/src/main/common/util.coffee": [ function(require, module) {
            var dateToString, deleteKeys, extend, isArray, isEmptyObject, isObject, problem, redirect, trim, __slice = [].slice;
            trim = function(str) {
                return null === str ? "" : str.replace(/^\s+|\s+$/g, "");
            }, isArray = Array.isArray || function(obj) {
                return "[object Array]" === Object.prototype.toString.call(obj);
            }, isObject = function(obj) {
                return obj === Object(obj);
            }, isEmptyObject = function(obj) {
                var hasOwnProperty, key;
                if (isObject(obj)) {
                    hasOwnProperty = Object.prototype.hasOwnProperty;
                    for (key in obj) if (hasOwnProperty.call(obj, key)) return !1;
                    return !0;
                }
                return !1;
            }, extend = function() {
                var des, key, sources, src, value, _i, _len;
                for (des = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [], 
                _i = 0, _len = sources.length; _len > _i; _i++) {
                    src = sources[_i];
                    for (key in src) value = src[key], des[key] = value;
                }
                return des;
            }, deleteKeys = function() {
                var ans, key, keys, obj, _i, _len;
                for (obj = arguments[0], keys = 2 <= arguments.length ? __slice.call(arguments, 1) : [], 
                ans = extend({}, obj), _i = 0, _len = keys.length; _len > _i; _i++) key = keys[_i], 
                delete ans[key];
                return ans;
            }, dateToString = function(date) {
                var day, hour, milli, minute, month, pad, second, year;
                return Date.prototype.toISOString ? date.toISOString() : (pad = function(num, len) {
                    var str;
                    for (str = "" + num; str.length < len; ) str = "0" + str;
                    return str;
                }, year = pad(date.getUTCFullYear(), 4), month = pad(date.getUTCMonth() + 1, 2), 
                day = pad(date.getUTCDate(), 2), hour = pad(date.getUTCHours(), 2), minute = pad(date.getUTCMinutes(), 2), 
                second = pad(date.getUTCSeconds(), 2), milli = pad(date.getUTCMilliseconds(), 2), 
                "" + year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second + "." + milli + "Z");
            }, problem = function(msg) {
                return new Error(msg);
            }, redirect = function(url) {
                return window.location.replace(url);
            }, module.exports = {
                trim: trim,
                isArray: isArray,
                isObject: isObject,
                isEmptyObject: isEmptyObject,
                extend: extend,
                deleteKeys: deleteKeys,
                dateToString: dateToString,
                problem: problem,
                redirect: redirect
            };
        }, {} ],
        "/Users/dave/dev/projects/myna-js/src/main/myna.coffee": [ function(require, module) {
            var DefaultClient, bootstrap;
            DefaultClient = require("./client/default"), bootstrap = require("./bootstrap"), 
            module.exports = bootstrap.create(function(experiment, settings) {
                return new DefaultClient(experiment, settings);
            });
        }, {
            "./bootstrap": "/Users/dave/dev/projects/myna-js/src/main/bootstrap.coffee",
            "./client/default": "/Users/dave/dev/projects/myna-js/src/main/client/default.coffee"
        } ]
    }, {}, [ "/Users/dave/dev/projects/myna-js/src/main/myna.coffee" ])("/Users/dave/dev/projects/myna-js/src/main/myna.coffee");
});