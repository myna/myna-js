/*! Myna JS v3.0.0 - 2014-09-02
 * http://mynaweb.com
 * Copyright (c) 2014 Myna Limited; Licensed BSD 2-Clause
 */
!function a(b, c, d) {
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
    "/Users/dave/dev/projects/myna-js/src/main/client/base-experiment.coffee": [ function(a, b) {
        var c, d, e, f, g, h, i, j = function(a, b) {
            return function() {
                return a.apply(b, arguments);
            };
        }, k = {}.hasOwnProperty, l = function(a, b) {
            function c() {
                this.constructor = a;
            }
            for (var d in b) k.call(b, d) && (a[d] = b[d]);
            return c.prototype = b.prototype, a.prototype = new c(), a.__super__ = b.prototype, 
            a;
        };
        f = a("../common/log"), i = a("../common/util"), h = a("../common/storage"), g = a("../common/settings"), 
        d = a("./events"), e = a("./variant"), b.exports = c = function(a) {
            function b(a) {
                var c, d, h, i, k, l, m, n;
                for (null == a && (a = {}), this.save = j(this.save, this), this.load = j(this.load, this), 
                this.loadAndSave = j(this.loadAndSave, this), this.clearVariant = j(this.clearVariant, this), 
                this.saveVariant = j(this.saveVariant, this), this.loadVariant = j(this.loadVariant, this), 
                this.clearLastReward = j(this.clearLastReward, this), this.saveLastReward = j(this.saveLastReward, this), 
                this.loadLastReward = j(this.loadLastReward, this), this.clearLastView = j(this.clearLastView, this), 
                this.saveLastView = j(this.saveLastView, this), this.loadLastView = j(this.loadLastView, this), 
                this.randomVariant = j(this.randomVariant, this), this.totalWeight = j(this.totalWeight, this), 
                this.saveVariantFromReward = j(this.saveVariantFromReward, this), this.rewardVariant = j(this.rewardVariant, this), 
                this.loadVariantsForReward = j(this.loadVariantsForReward, this), this.reward = j(this.reward, this), 
                this.saveVariantFromView = j(this.saveVariantFromView, this), this.viewVariant = j(this.viewVariant, this), 
                this.loadVariantsForView = j(this.loadVariantsForView, this), this.view = j(this.view, this), 
                this.loadVariantsForSuggest = j(this.loadVariantsForSuggest, this), this.suggest = j(this.suggest, this), 
                b.__super__.constructor.call(this, a), f.debug("BaseExperiment.constructor", a), 
                this.uuid = null != (i = a.uuid) ? i : f.error("BaseExperiment.constructor", this.id, "no uuid in options", a), 
                this.id = null != (k = a.id) ? k : f.error("BaseExperiment.constructor", this.id, "no id in options", a), 
                this.settings = g.create(null != (l = a.settings) ? l : {}), this.variants = {}, 
                n = null != (m = a.variants) ? m : [], d = 0, h = n.length; h > d; d++) c = n[d], 
                this.variants[c.id] = new e(c);
            }
            return l(b, a), b.prototype.suggest = function(a, b) {
                var c, d, e;
                null == a && (a = function() {}), null == b && (b = function() {}), c = this.loadVariantsForSuggest(), 
                f.debug("BaseExperiment.suggest", this.id, null != (d = c.variant) ? d.id : void 0, null != (e = c.viewed) ? e.id : void 0), 
                this.viewVariant(i.extend({
                    success: a,
                    error: b
                }, c));
            }, b.prototype.loadVariantsForSuggest = function() {
                return {
                    variant: this.randomVariant(),
                    viewed: this.loadLastView()
                };
            }, b.prototype.view = function(a, b, c) {
                var d, e, g;
                null == b && (b = function() {}), null == c && (c = function() {}), d = this.loadVariantsForView(a), 
                f.debug("BaseExperiment.view", this.id, null != (e = d.variant) ? e.id : void 0, null != (g = d.viewed) ? g.id : void 0), 
                this.viewVariant(i.extend({
                    success: b,
                    error: c
                }, d));
            }, b.prototype.loadVariantsForView = function(a) {
                return {
                    variant: a instanceof e ? a : this.variants[a],
                    viewed: null
                };
            }, b.prototype.viewVariant = function(a) {
                var b, c, d, e, g, h;
                d = a.variant, e = a.viewed, c = null != (g = a.success) ? g : function() {}, b = null != (h = a.error) ? h : function() {}, 
                f.debug("BaseExperiment.viewVariant", this.id, null != d ? d.id : void 0, null != e ? e.id : void 0), 
                null != e ? this.trigger("beforeView", e, !1) !== !1 && (c.call(this, e, !1), this.trigger("view", e, !1)) : null != d ? this.trigger("beforeView", d, !0) !== !1 && (this.saveVariantFromView(d), 
                c.call(this, d, !0), this.trigger("view", d, !0), this.trigger("recordView", d)) : b(i.problem("no-variant"));
            }, b.prototype.saveVariantFromView = function(a) {
                return this.saveLastView(a), this.clearLastReward();
            }, b.prototype.reward = function(a, b, c) {
                var d, e, g;
                null == a && (a = 1), null == b && (b = function() {}), null == c && (c = function() {}), 
                d = this.loadVariantsForReward(), f.debug("BaseExperiment.reward", this.id, null != (e = d.variant) ? e.id : void 0, null != (g = d.rewarded) ? g.id : void 0, a), 
                this.rewardVariant(i.extend({
                    amount: a,
                    success: b,
                    error: c
                }, d));
            }, b.prototype.loadVariantsForReward = function() {
                return {
                    variant: this.loadLastView(),
                    rewarded: this.loadLastReward()
                };
            }, b.prototype.rewardVariant = function(a) {
                var b, c, d, e, g, h, j, k;
                null == a && (a = {}), f.debug("BaseExperiment.rewardVariant", this.id, a), g = a.variant, 
                d = a.rewarded, b = null != (h = a.amount) ? h : 1, e = null != (j = a.success) ? j : function() {}, 
                c = null != (k = a.error) ? k : function() {}, null != d ? this.trigger("beforeReward", d, b, !1) !== !1 && (e.call(this, d, b, !1), 
                this.trigger("reward", d, b, !1)) : null != g ? this.trigger("beforeReward", g, b, !0) !== !1 && this.triggerAsync("recordReward", g, b, function(a) {
                    return function() {
                        return a.saveVariantFromReward(g), e.call(a, g, b, !0), a.trigger("reward", g, b, !0);
                    };
                }(this), function(a) {
                    return function() {
                        a.saveVariantFromReward(g), c.call(a);
                    };
                }(this)) : c(i.problem("no-variant"));
            }, b.prototype.saveVariantFromReward = function(a) {
                return this.clearLastView(), this.saveLastReward(a);
            }, b.prototype.totalWeight = function() {
                var a, b, c, d;
                a = 0, d = this.variants;
                for (b in d) c = d[b], a += c.weight;
                return a;
            }, b.prototype.randomVariant = function() {
                var a, b, c, d, e;
                c = this.totalWeight(), b = Math.random() * c, e = this.variants;
                for (a in e) if (d = e[a], c -= d.weight, b >= c) return f.debug("BaseExperiment.randomVariant", this.id, d.id), 
                d;
                return f.debug("BaseExperiment.randomVariant", this.id, null), null;
            }, b.prototype.loadLastView = function() {
                return this.loadVariant("lastView");
            }, b.prototype.saveLastView = function(a) {
                return this.saveVariant("lastView", a), this.clearVariant("lastReward");
            }, b.prototype.clearLastView = function() {
                return this.clearVariant("lastView");
            }, b.prototype.loadLastReward = function() {
                return this.loadVariant("lastReward");
            }, b.prototype.saveLastReward = function(a) {
                return this.saveVariant("lastReward", a);
            }, b.prototype.clearLastReward = function() {
                return this.clearVariant("lastReward");
            }, b.prototype.loadVariant = function(a) {
                var b, c;
                return b = null != (c = this.load()) ? c[a] : void 0, f.debug("BaseExperiment.loadVariant", this.id, a, b), 
                null != b ? this.variants[b] : null;
            }, b.prototype.saveVariant = function(a, b) {
                return this.loadAndSave(function(c) {
                    return function(d) {
                        return f.debug("BaseExperiment.saveVariant", c.id, a, b, d), null != b ? d[a] = b.id : delete d[a], 
                        d;
                    };
                }(this));
            }, b.prototype.clearVariant = function(a) {
                return this.saveVariant(a, null);
            }, b.prototype.loadAndSave = function(a) {
                var b;
                return this.save(a(null != (b = this.load()) ? b : {}));
            }, b.prototype.load = function() {
                return h.get(this.uuid);
            }, b.prototype.save = function(a) {
                return h.set(this.uuid, a);
            }, b;
        }(d);
    }, {
        "../common/log": "/Users/dave/dev/projects/myna-js/src/main/common/log.coffee",
        "../common/settings": "/Users/dave/dev/projects/myna-js/src/main/common/settings/index.coffee",
        "../common/storage": "/Users/dave/dev/projects/myna-js/src/main/common/storage/index.coffee",
        "../common/util": "/Users/dave/dev/projects/myna-js/src/main/common/util.coffee",
        "./events": "/Users/dave/dev/projects/myna-js/src/main/client/events.coffee",
        "./variant": "/Users/dave/dev/projects/myna-js/src/main/client/variant.coffee"
    } ],
    "/Users/dave/dev/projects/myna-js/src/main/client/events.coffee": [ function(a, b) {
        var c, d, e = function(a, b) {
            return function() {
                return a.apply(b, arguments);
            };
        }, f = [].slice;
        d = a("../common/log"), b.exports = c = function() {
            function a() {
                this.off = e(this.off, this), this.on = e(this.on, this), this.triggerAsync = e(this.triggerAsync, this), 
                this.trigger = e(this.trigger, this), this.eventHandlers = {};
            }
            return a.prototype.trigger = function() {
                var a, b, c, e, g, h, i, j;
                for (c = arguments[0], a = 2 <= arguments.length ? f.call(arguments, 1) : [], d.debug.apply(d, [ "Events.trigger", c ].concat(f.call(a))), 
                b = !1, j = null != (i = this.eventHandlers[c]) ? i : [], g = 0, h = j.length; h > g; g++) e = j[g], 
                b = b || e.apply(this, a) === !1;
                return b ? !1 : void 0;
            }, a.prototype.triggerAsync = function() {
                var a, b, c, e, g, h, i;
                return c = arguments[0], a = 4 <= arguments.length ? f.call(arguments, 1, h = arguments.length - 2) : (h = 1, 
                []), e = arguments[h++], b = arguments[h++], d.debug.apply(d, [ "Events.triggerAsync", c ].concat(f.call(a))), 
                (g = function(c) {
                    return function(h) {
                        var i, j;
                        return d.debug("Events.triggerAsync.triggerAll", h), 0 === h.length ? e() : (i = h[0], 
                        j = 2 <= h.length ? f.call(h, 1) : [], i.call.apply(i, [ c ].concat(f.call(a), [ function() {
                            return g(j);
                        } ], [ b ])));
                    };
                }(this))(null != (i = this.eventHandlers[c]) ? i : []);
            }, a.prototype.on = function(a, b) {
                var c;
                return this.eventHandlers[a] = (null != (c = this.eventHandlers[a]) ? c : []).concat([ b ]), 
                d.debug("Events.on", a, b, this.eventHandlers[a]);
            }, a.prototype.off = function(a, b) {
                var c;
                switch (null == b && (b = null), arguments.length) {
                  case 0:
                    this.eventHandlers = {};
                    break;

                  case 1:
                    delete this.eventHandlers[arguments[0]];
                    break;

                  default:
                    a = arguments[0], b = arguments[1], this.eventHandlers[a] = function() {
                        var d, e, f, g;
                        for (f = this.eventHandlers[a], g = [], d = 0, e = f.length; e > d; d++) c = f[d], 
                        c !== b && g.push(c);
                        return g;
                    }.call(this);
                }
                return d.debug("Events.off", a, b, this.eventHandlers[a]);
            }, a;
        }();
    }, {
        "../common/log": "/Users/dave/dev/projects/myna-js/src/main/common/log.coffee"
    } ],
    "/Users/dave/dev/projects/myna-js/src/main/client/experiment.coffee": [ function(a, b) {
        var c, d, e, f, g = function(a, b) {
            return function() {
                return a.apply(b, arguments);
            };
        }, h = {}.hasOwnProperty, i = function(a, b) {
            function c() {
                this.constructor = a;
            }
            for (var d in b) h.call(b, d) && (a[d] = b[d]);
            return c.prototype = b.prototype, a.prototype = new c(), a.__super__ = b.prototype, 
            a;
        };
        e = a("../common/log"), f = a("../common/settings"), c = a("./base-experiment"), 
        b.exports = d = function(a) {
            function b() {
                return this.clearStickyReward = g(this.clearStickyReward, this), this.saveStickyReward = g(this.saveStickyReward, this), 
                this.loadStickyReward = g(this.loadStickyReward, this), this.clearStickySuggestion = g(this.clearStickySuggestion, this), 
                this.saveStickySuggestion = g(this.saveStickySuggestion, this), this.loadStickySuggestion = g(this.loadStickySuggestion, this), 
                this.unstick = g(this.unstick, this), this.saveVariantFromReward = g(this.saveVariantFromReward, this), 
                this.loadVariantsForReward = g(this.loadVariantsForReward, this), this.saveVariantFromView = g(this.saveVariantFromView, this), 
                this.loadVariantsForView = g(this.loadVariantsForView, this), this.loadVariantsForSuggest = g(this.loadVariantsForSuggest, this), 
                this.sticky = g(this.sticky, this), b.__super__.constructor.apply(this, arguments);
            }
            return i(b, a), b.prototype.sticky = function() {
                return !!f.get(this.settings, "myna.web.sticky", !0);
            }, b.prototype.loadVariantsForSuggest = function() {
                var a;
                return a = this.loadStickySuggestion(), {
                    variant: null != a ? a : this.randomVariant(),
                    viewed: null != a ? a : null
                };
            }, b.prototype.loadVariantsForView = function(a) {
                return b.__super__.loadVariantsForView.call(this, a);
            }, b.prototype.saveVariantFromView = function(a) {
                return this.sticky() && this.saveStickySuggestion(a), b.__super__.saveVariantFromView.call(this, a);
            }, b.prototype.loadVariantsForReward = function() {
                return this.sticky() ? {
                    variant: this.loadLastView(),
                    rewarded: this.loadStickyReward()
                } : b.__super__.loadVariantsForReward.call(this);
            }, b.prototype.saveVariantFromReward = function(a) {
                return this.sticky() && this.saveStickyReward(a), b.__super__.saveVariantFromReward.call(this, a);
            }, b.prototype.unstick = function() {
                return e.debug("Experiment.unstick", this.id), this.clearLastView(), this.clearLastReward(), 
                this.clearStickySuggestion(), this.clearStickyReward();
            }, b.prototype.loadStickySuggestion = function() {
                return this.sticky() ? this.loadVariant("stickySuggestion") : null;
            }, b.prototype.saveStickySuggestion = function(a) {
                return this.saveVariant("stickySuggestion", a), this.clearVariant("stickyReward");
            }, b.prototype.clearStickySuggestion = function() {
                return this.clearVariant("stickySuggestion"), this.clearVariant("stickyReward");
            }, b.prototype.loadStickyReward = function() {
                return this.sticky() ? this.loadVariant("stickyReward") : null;
            }, b.prototype.saveStickyReward = function(a) {
                return this.saveVariant("stickyReward", a);
            }, b.prototype.clearStickyReward = function() {
                return this.clearVariant("stickyReward");
            }, b;
        }(c);
    }, {
        "../common/log": "/Users/dave/dev/projects/myna-js/src/main/common/log.coffee",
        "../common/settings": "/Users/dave/dev/projects/myna-js/src/main/common/settings/index.coffee",
        "./base-experiment": "/Users/dave/dev/projects/myna-js/src/main/client/base-experiment.coffee"
    } ],
    "/Users/dave/dev/projects/myna-js/src/main/client/google-analytics.coffee": [ function(a, b) {
        var c, d, e, f, g = function(a, b) {
            return function() {
                return a.apply(b, arguments);
            };
        }, h = {}.hasOwnProperty, i = function(a, b) {
            function c() {
                this.constructor = a;
            }
            for (var d in b) h.call(b, d) && (a[d] = b[d]);
            return c.prototype = b.prototype, a.prototype = new c(), a.__super__ = b.prototype, 
            a;
        };
        e = a("../common/log"), f = a("../common/settings"), c = a("./events"), b.exports = d = function(a) {
            function b(a) {
                this.rewardMultiplier = g(this.rewardMultiplier, this), this.eventName = g(this.eventName, this), 
                this.enabled = g(this.enabled, this), this.rewardEvent = g(this.rewardEvent, this), 
                this.viewEvent = g(this.viewEvent, this), this.recordReward = g(this.recordReward, this), 
                this.recordView = g(this.recordView, this), this.listenTo = g(this.listenTo, this), 
                this.init = g(this.init, this), e.debug("GoogleAnalytics.constructor", a), this.client = a;
            }
            return i(b, a), b.prototype.init = function() {
                var a, b, c, d;
                c = this.client.experiments, d = [];
                for (b in c) a = c[b], d.push(this.listenTo(a));
                return d;
            }, b.prototype.listenTo = function(a) {
                return e.debug("GoogleAnalytics.listenTo", a.id), a.on("recordView", function(b) {
                    return function(c, d, e) {
                        return b.recordView(a, c, d, e);
                    };
                }(this)), a.on("recordReward", function(b) {
                    return function(c, d, e, f) {
                        return b.recordReward(a, c, d, e, f);
                    };
                }(this));
            }, b.prototype.recordView = function(a, b, c, d) {
                return null == c && (c = function() {}), null == d && (d = function() {}), e.debug("GoogleAnalytics.recordView", a, b, c, d), 
                this.enabled(a) && "undefined" != typeof _gaq && null !== _gaq && _gaq.push(this.viewEvent(a, b)), 
                c();
            }, b.prototype.recordReward = function(a, b, c, d, f) {
                return null == d && (d = function() {}), null == f && (f = function() {}), e.debug("GoogleAnalytics.recordReward", a, b, d, f), 
                this.enabled(a) && "undefined" != typeof _gaq && null !== _gaq && _gaq.push(this.rewardEvent(a, b, c)), 
                d();
            }, b.prototype.viewEvent = function(a, b) {
                return [ "_trackEvent", "myna", this.eventName(a, "view"), b.id, null, !1 ];
            }, b.prototype.rewardEvent = function(a, b, c) {
                var d;
                return d = this.rewardMultiplier(a), [ "_trackEvent", "myna", this.eventName(a, "reward"), b.id, Math.round(d * c), !0 ];
            }, b.prototype.enabled = function(a) {
                return f.get(a.settings, "myna.web.googleAnalytics.enabled", !0);
            }, b.prototype.eventName = function(a, b) {
                var c;
                return null != (c = f.get(a.settings, "myna.web.googleAnalytics." + b + "Event")) ? c : "" + a.id + "-" + b;
            }, b.prototype.rewardMultiplier = function(a) {
                return f.get(a.settings, "myna.web.googleAnalytics.rewardMultiplier", 100);
            }, b;
        }(c);
    }, {
        "../common/log": "/Users/dave/dev/projects/myna-js/src/main/common/log.coffee",
        "../common/settings": "/Users/dave/dev/projects/myna-js/src/main/common/settings/index.coffee",
        "./events": "/Users/dave/dev/projects/myna-js/src/main/client/events.coffee"
    } ],
    "/Users/dave/dev/projects/myna-js/src/main/client/index.coffee": [ function(a, b) {
        var c, d, e, f = function(a, b) {
            return function() {
                return a.apply(b, arguments);
            };
        };
        d = a("../common/log"), e = a("../common/settings"), b.exports = c = function() {
            function a(a) {
                var b, c, g, h, i, j, k, l, m;
                for (null == a && (a = {}), this.reward = f(this.reward, this), this.view = f(this.view, this), 
                this.suggest = f(this.suggest, this), d.debug("Client.constructor", a), this.uuid = null != (h = a.uuid) ? h : null, 
                this.apiKey = null != (i = a.apiKey) ? i : d.error("Client.constructor", "no apiKey in options", a), 
                this.apiRoot = null != (j = a.apiRoot) ? j : "//api.mynaweb.com", this.settings = e.create(null != (k = a.settings) ? k : {}), 
                this.experiments = {}, m = null != (l = a.experiments) ? l : [], c = 0, g = m.length; g > c; c++) b = m[c], 
                this.experiments[b.id] = b;
            }
            return a.prototype.suggest = function(a, b, c) {
                return null == b && (b = function() {}), null == c && (c = function() {}), this.experiments[a].suggest(b, c);
            }, a.prototype.view = function(a, b, c, d) {
                return null == c && (c = function() {}), null == d && (d = function() {}), this.experiments[a].view(b, c, d);
            }, a.prototype.reward = function(a, b, c, d) {
                return null == b && (b = 1), null == c && (c = function() {}), null == d && (d = function() {}), 
                this.experiments[a].reward(b, c, d);
            }, a;
        }();
    }, {
        "../common/log": "/Users/dave/dev/projects/myna-js/src/main/common/log.coffee",
        "../common/settings": "/Users/dave/dev/projects/myna-js/src/main/common/settings/index.coffee"
    } ],
    "/Users/dave/dev/projects/myna-js/src/main/client/recorder.coffee": [ function(a, b) {
        var c, d, e, f, g, h, i, j = function(a, b) {
            return function() {
                return a.apply(b, arguments);
            };
        }, k = {}.hasOwnProperty, l = function(a, b) {
            function c() {
                this.constructor = a;
            }
            for (var d in b) k.call(b, d) && (a[d] = b[d]);
            return c.prototype = b.prototype, a.prototype = new c(), a.__super__ = b.prototype, 
            a;
        }, m = [].slice;
        e = a("../common/jsonp"), f = a("../common/log"), g = a("../common/settings"), h = a("../common/storage"), 
        i = a("../common/util"), c = a("./events"), b.exports = d = function(a) {
            function b(a) {
                this.save = j(this.save, this), this.load = j(this.load, this), this.loadAndSave = j(this.loadAndSave, this), 
                this.clearQueuedEvents = j(this.clearQueuedEvents, this), this.requeueEvents = j(this.requeueEvents, this), 
                this.queueEvent = j(this.queueEvent, this), this.queuedEvents = j(this.queuedEvents, this), 
                this.sync = j(this.sync, this), this.recordReward = j(this.recordReward, this), 
                this.recordView = j(this.recordView, this), this.listenTo = j(this.listenTo, this), 
                this.init = j(this.init, this);
                var c, d;
                b.__super__.constructor.call(this), f.debug("Recorder.constructor", a), this.client = a, 
                this.apiKey = null != (c = a.apiKey) ? c : f.error("Recorder.constructor", "no apiKey in options", options), 
                this.apiRoot = null != (d = a.apiRoot) ? d : "//api.mynaweb.com", this.storageKey = g.get(a.settings, "myna.web.storageKey", "myna"), 
                this.timeout = g.get(a.settings, "myna.web.timeout", 1e3), this.autoSync = g.get(a.settings, "myna.web.autoSync", !0), 
                this.semaphore = 0, this.waiting = [];
            }
            return l(b, a), b.prototype.init = function() {
                var a, b, c, d;
                c = this.client.experiments, d = [];
                for (b in c) a = c[b], d.push(this.listenTo(a));
                return d;
            }, b.prototype.listenTo = function(a) {
                return f.debug("Recorder.listenTo", a.id), a.on("recordView", function(b) {
                    return function(c, d, e) {
                        return b.recordView(a, c, d, e);
                    };
                }(this)), a.on("recordReward", function(b) {
                    return function(c, d, e, f) {
                        return b.recordReward(a, c, d, e, f);
                    };
                }(this));
            }, b.prototype.recordView = function(a, b, c, d) {
                return null == c && (c = function() {}), null == d && (d = function() {}), f.debug("Recorder.recordView", a.id, b.id), 
                this.queueEvent({
                    typename: "view",
                    experiment: a.uuid,
                    variant: b.id,
                    timestamp: i.dateToString(new Date())
                }), f.debug("Recorder.recordReward", "aboutToSync", this.autoSync), this.autoSync ? this.sync(c, d) : c();
            }, b.prototype.recordReward = function(a, b, c, d, e) {
                return null == d && (d = function() {}), null == e && (e = function() {}), f.debug("Recorder.recordReward", a.id, b.id, c), 
                this.queueEvent({
                    typename: "reward",
                    experiment: a.uuid,
                    variant: b.id,
                    amount: c,
                    timestamp: i.dateToString(new Date())
                }), f.debug("Recorder.recordReward", "aboutToSync", this.autoSync), this.autoSync ? this.sync(d, e) : d();
            }, b.prototype.sync = function(a, b) {
                var c, d, g, h, j;
                return null == a && (a = function() {}), null == b && (b = function() {}), this.waiting.push({
                    success: a,
                    error: b
                }), this.semaphore > 0 ? f.debug("Recorder.sync", "queued", this.waiting.length) : (this.semaphore++, 
                j = this.waiting, this.waiting = [], d = function(a) {
                    return function() {
                        var b;
                        return b = a.clearQueuedEvents(), f.debug("Recorder.sync.start", b, j.length), a.trigger("beforeSync", b) === !1 ? c([], [], b, !0) : g(b, [], [], []);
                    };
                }(this), g = function() {
                    return function(a, b, d, e) {
                        var g, i;
                        return f.debug("Recorder.sync.syncAll", a, b, d, e), 0 === a.length ? c(b, d, e) : (g = a[0], 
                        i = 2 <= a.length ? m.call(a, 1) : [], h(g, i, b, d, e));
                    };
                }(this), h = function(a) {
                    return function(b, c, d, h, j) {
                        var k;
                        return f.debug("Recorder.sync.syncOne", b, c, d, h, j), k = i.extend({}, b, {
                            apikey: a.apiKey
                        }), k = i.deleteKeys(k, "experiment"), e.request({
                            url: "" + a.apiRoot + "/v2/experiment/" + b.experiment + "/record",
                            success: function() {
                                return g(c, d.concat([ b ]), h, j);
                            },
                            error: function(a) {
                                return a.status && a.status >= 500 ? g(c, d, h, j.concat([ b ])) : g(c, d, h.concat([ b ]), j);
                            },
                            timeout: a.timeout,
                            params: k
                        });
                    };
                }(this), c = function(a) {
                    return function(b, c, d, e) {
                        var g, h, i, k, l;
                        if (null == e && (e = !1), f.debug("Recorder.sync.finish", b, c, d, a.waiting.length), 
                        d.length > 0 && a.requeueEvents(d), c.length > 0 || d.length > 0) for (h = 0, k = j.length; k > h; h++) g = j[h], 
                        g.error(b, c, d); else for (i = 0, l = j.length; l > i; i++) g = j[i], g.success(b, c, d);
                        return e || a.trigger("sync", b, c, d), a.semaphore--, !e && a.waiting.length > 0 ? a.sync() : void 0;
                    };
                }(this), d());
            }, b.prototype.queuedEvents = function() {
                var a, b;
                return a = null != (b = this.load().queuedEvents) ? b : [], f.debug("Recorder.queuedEvents", a), 
                a;
            }, b.prototype.queueEvent = function(a) {
                return f.debug("Recorder.queueEvent", a), this.loadAndSave(function(b) {
                    var c;
                    return b.queuedEvents = (null != (c = b.queuedEvents) ? c : []).concat([ a ]), b;
                });
            }, b.prototype.requeueEvents = function(a) {
                return f.debug("Recorder.requeueEvents", a), this.loadAndSave(function(b) {
                    var c;
                    return b.queuedEvents = a.concat(null != (c = b.queuedEvents) ? c : []), b;
                });
            }, b.prototype.clearQueuedEvents = function() {
                var a;
                return f.debug("Recorder.clearQueuedEvents"), a = [], this.loadAndSave(function(b) {
                    var c;
                    return a = null != (c = b.queuedEvents) ? c : [], delete b.queuedEvents, b;
                }), a;
            }, b.prototype.loadAndSave = function(a) {
                var b;
                return this.save(a(null != (b = this.load()) ? b : {}));
            }, b.prototype.load = function() {
                return h.get(this.storageKey);
            }, b.prototype.save = function(a) {
                return h.set(this.storageKey, a);
            }, b;
        }(c);
    }, {
        "../common/jsonp": "/Users/dave/dev/projects/myna-js/src/main/common/jsonp.coffee",
        "../common/log": "/Users/dave/dev/projects/myna-js/src/main/common/log.coffee",
        "../common/settings": "/Users/dave/dev/projects/myna-js/src/main/common/settings/index.coffee",
        "../common/storage": "/Users/dave/dev/projects/myna-js/src/main/common/storage/index.coffee",
        "../common/util": "/Users/dave/dev/projects/myna-js/src/main/common/util.coffee",
        "./events": "/Users/dave/dev/projects/myna-js/src/main/client/events.coffee"
    } ],
    "/Users/dave/dev/projects/myna-js/src/main/client/variant.coffee": [ function(a, b) {
        var c, d, e;
        d = a("../common/log"), e = a("../common/settings"), b.exports = c = function() {
            function a(a) {
                var b, c, f, g;
                null == a && (a = {}), this.id = null != (b = a.id) ? b : d.error("Variant.constructor", "no id in options", a), 
                this.name = null != (c = a.name) ? c : this.id, this.weight = null != (f = a.weight) ? f : d.error("Variant.constructor", "no weight in options", a), 
                this.settings = e.create(null != (g = a.settings) ? g : {});
            }
            return a;
        }();
    }, {
        "../common/log": "/Users/dave/dev/projects/myna-js/src/main/common/log.coffee",
        "../common/settings": "/Users/dave/dev/projects/myna-js/src/main/common/settings/index.coffee"
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
        var c, d, e, f;
        d = a("./log"), window.__mynacallbacks = {}, e = function(a, b) {
            var c;
            if (null == a && (a = null), null == b && (b = null), d.debug("removeCallback", a, b, null != b ? b.parentNode : void 0), 
            c = null != b ? b.readyState : void 0, !c || "complete" === c || "loaded" === c) try {
                b && (b.onload = null, b.parentNode.removeChild(b));
            } finally {
                a && delete window.__mynacallbacks[a];
            }
        }, c = function(a, b) {
            var c;
            return c = document.createElement("script"), c.setAttribute("type", "text/javascript"), 
            c.setAttribute("async", "true"), c.setAttribute("src", a), c.setAttribute("class", "myna-jsonp"), 
            c.setAttribute("data-callback", b), c.onload = c.onreadystatechange = function() {
                return e(b, c);
            }, c;
        }, f = function(a) {
            var b, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w;
            null == a && (a = {}), q = null != (s = a.url) ? s : d.error("jsonp.request", "no url in options", a), 
            m = null != (t = a.success) ? t : function() {}, f = null != (u = a.error) ? u : function() {}, 
            n = null != (v = a.timeout) ? v : 0, j = null != (w = a.params) ? w : {}, b = "callback" + new Date().getTime(), 
            k = !1, p = "" + q + "?";
            for (g in j) r = j[g], p += "" + g + "=" + r + "&";
            p += "callback=__mynacallbacks." + b, d.debug("jsonp.request", p, m, f, n), l = c(p, b), 
            i = function() {
                return k ? d.debug("jsonp.request.onTimeout", b, n, "already returned") : (k = !0, 
                d.debug("jsonp.request.onTimeout", b, n), e(b, l), f({
                    typename: "problem",
                    status: 500,
                    messages: [ {
                        typename: "timeout",
                        message: "request timed out after #{timeout}ms",
                        callback: b
                    } ]
                }));
            }, o = n > 0 ? window.setTimeout(i, n) : null, h = function(a) {
                return k ? d.debug("jsonp.request.onComplete", b, "already returned") : (k = !0, 
                d.debug("jsonp.request.onComplete", b, a.typename, "problem" === a.typename, a), 
                window.clearTimeout(o), e(b, l), "problem" === a.typename ? f(a) : m(a));
            }, window.__mynacallbacks[b] = h, document.getElementsByTagName("head")[0].appendChild(l);
        }, b.exports = {
            request: f,
            callbacks: function() {
                return window.__mynacallbacks;
            },
            createScriptElem: c,
            removeCallback: e
        };
    }, {
        "./log": "/Users/dave/dev/projects/myna-js/src/main/common/log.coffee"
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
        var c, d, e, f, g, h, i, j, k = [].slice;
        j = function(a) {
            return null === a ? "" : a.replace(/^\s+|\s+$/g, "");
        }, f = Array.isArray || function(a) {
            return "[object Array]" === Object.prototype.toString.call(a);
        }, g = function(a) {
            return a === Object(a);
        }, e = function() {
            var a, b, c, d, e, f, g;
            for (a = arguments[0], c = 2 <= arguments.length ? k.call(arguments, 1) : [], f = 0, 
            g = c.length; g > f; f++) {
                d = c[f];
                for (b in d) e = d[b], a[b] = e;
            }
            return a;
        }, d = function() {
            var a, b, c, d, f, g;
            for (d = arguments[0], c = 2 <= arguments.length ? k.call(arguments, 1) : [], a = e({}, d), 
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
        }, h = function(a) {
            return new Error(a);
        }, i = function(a) {
            return window.location.replace(a);
        }, b.exports = {
            trim: j,
            isArray: f,
            isObject: g,
            extend: e,
            deleteKeys: d,
            dateToString: c,
            problem: h,
            redirect: i
        };
    }, {} ],
    "/Users/dave/dev/projects/myna-js/src/main/myna-js.coffee": [ function(a, b) {
        var c, d, e, f, g, h, i, j;
        j = a("./common/log"), h = a("./common/hash"), i = a("./common/jsonp"), c = a("./client"), 
        g = a("./client/recorder"), d = a("./client/experiment"), e = a("./client/google-analytics"), 
        null != h.params.debug && (j.enabled = !0), f = {}, f.readyHandlers = [], f.ready = function(a) {
            f.client ? a(f.client) : f.readyHandlers.push(a);
        }, f.triggerReady = function(a) {
            var b, c, d, e, g;
            for (e = f.readyHandlers, g = [], c = 0, d = e.length; d > c; c++) b = e[c], g.push(b.call(f, a));
            return g;
        }, f.init = function(a) {
            var b, c, d, e, g, h;
            j.debug("Myna.init", a), e = null != (g = a.success) ? g : function() {}, c = null != (h = a.error) ? h : function() {};
            try {
                b = f.initLocal(a), e(b);
            } catch (i) {
                d = i, c(d);
            }
        }, f.initLocal = function(a) {
            var b, h, i, k, l, m, n;
            return j.debug("Myna.init", a), l = a.typename, "deployment" !== l && j.error("Myna.initLocal", 'Myna needs a deployment to initialise. The given JSON is not a deployment.\nIt has a typename of "' + l + '". Check you are initialising Myna with the\ncorrect UUID if you are calling initRemote', a), 
            b = null != (m = a.apiKey) ? m : j.error("Myna.init", "no apiKey in options", a), 
            h = null != (n = a.apiRoot) ? n : "//api.mynaweb.com", i = function() {
                var b, c, e, f, g;
                for (f = null != (e = a.experiments) ? e : [], g = [], b = 0, c = f.length; c > b; b++) k = f[b], 
                g.push(new d(k));
                return g;
            }(), f.client = new c({
                apiKey: b,
                apiRoot: h,
                experiments: i
            }), f.recorder = new g(f.client), f.googleAnalytics = new e(f.client), f.triggerReady(f.client), 
            f.recorder.init(), f.googleAnalytics.init(), f.client;
        }, f.initRemote = function(a) {
            var b, c, d, e, g, h;
            j.debug("Myna.initRemote", a), d = null != (e = a.url) ? e : j.error("Myna.initRemote", "no url specified in options", a), 
            c = null != (g = a.success) ? g : function() {}, b = null != (h = a.error) ? h : function() {}, 
            i.request({
                url: d,
                success: function(a) {
                    var d, e;
                    j.debug("Myna.initRemote", "response", a);
                    try {
                        return d = f.initLocal(a), c(d);
                    } catch (g) {
                        return e = g, b(e);
                    }
                },
                error: b
            });
        }, b.exports = window.Myna = f;
    }, {
        "./client": "/Users/dave/dev/projects/myna-js/src/main/client/index.coffee",
        "./client/experiment": "/Users/dave/dev/projects/myna-js/src/main/client/experiment.coffee",
        "./client/google-analytics": "/Users/dave/dev/projects/myna-js/src/main/client/google-analytics.coffee",
        "./client/recorder": "/Users/dave/dev/projects/myna-js/src/main/client/recorder.coffee",
        "./common/hash": "/Users/dave/dev/projects/myna-js/src/main/common/hash.coffee",
        "./common/jsonp": "/Users/dave/dev/projects/myna-js/src/main/common/jsonp.coffee",
        "./common/log": "/Users/dave/dev/projects/myna-js/src/main/common/log.coffee"
    } ]
}, {}, [ "/Users/dave/dev/projects/myna-js/src/main/myna-js.coffee" ]);