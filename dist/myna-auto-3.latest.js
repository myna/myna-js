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
    var a;
    return function b(a, c, d) {
        function e(g, h) {
            if (!c[g]) {
                if (!a[g]) {
                    var i = "function" == typeof require && require;
                    if (!h && i) return i(g, !0);
                    if (f) return f(g, !0);
                    var j = new Error("Cannot find module '" + g + "'");
                    throw j.code = "MODULE_NOT_FOUND", j;
                }
                var k = c[g] = {
                    exports: {}
                };
                a[g][0].call(k.exports, function(b) {
                    var c = a[g][1][b];
                    return e(c ? c : b);
                }, k, k.exports, b, a, c, d);
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
        "/Users/dave/dev/projects/myna-js/node_modules/jquery/dist/jquery.js": [ function(b, c) {
            !function(a, b) {
                "object" == typeof c && "object" == typeof c.exports ? c.exports = a.document ? b(a, !0) : function(a) {
                    if (!a.document) throw new Error("jQuery requires a window with a document");
                    return b(a);
                } : b(a);
            }("undefined" != typeof window ? window : this, function(b, c) {
                function d(a) {
                    var b = a.length, c = fb.type(a);
                    return "function" === c || fb.isWindow(a) ? !1 : 1 === a.nodeType && b ? !0 : "array" === c || 0 === b || "number" == typeof b && b > 0 && b - 1 in a;
                }
                function e(a, b, c) {
                    if (fb.isFunction(b)) return fb.grep(a, function(a, d) {
                        return !!b.call(a, d, a) !== c;
                    });
                    if (b.nodeType) return fb.grep(a, function(a) {
                        return a === b !== c;
                    });
                    if ("string" == typeof b) {
                        if (nb.test(b)) return fb.filter(b, a, c);
                        b = fb.filter(b, a);
                    }
                    return fb.grep(a, function(a) {
                        return fb.inArray(a, b) >= 0 !== c;
                    });
                }
                function f(a, b) {
                    do a = a[b]; while (a && 1 !== a.nodeType);
                    return a;
                }
                function g(a) {
                    var b = vb[a] = {};
                    return fb.each(a.match(ub) || [], function(a, c) {
                        b[c] = !0;
                    }), b;
                }
                function h() {
                    pb.addEventListener ? (pb.removeEventListener("DOMContentLoaded", i, !1), b.removeEventListener("load", i, !1)) : (pb.detachEvent("onreadystatechange", i), 
                    b.detachEvent("onload", i));
                }
                function i() {
                    (pb.addEventListener || "load" === event.type || "complete" === pb.readyState) && (h(), 
                    fb.ready());
                }
                function j(a, b, c) {
                    if (void 0 === c && 1 === a.nodeType) {
                        var d = "data-" + b.replace(Ab, "-$1").toLowerCase();
                        if (c = a.getAttribute(d), "string" == typeof c) {
                            try {
                                c = "true" === c ? !0 : "false" === c ? !1 : "null" === c ? null : +c + "" === c ? +c : zb.test(c) ? fb.parseJSON(c) : c;
                            } catch (e) {}
                            fb.data(a, b, c);
                        } else c = void 0;
                    }
                    return c;
                }
                function k(a) {
                    var b;
                    for (b in a) if (("data" !== b || !fb.isEmptyObject(a[b])) && "toJSON" !== b) return !1;
                    return !0;
                }
                function l(a, b, c, d) {
                    if (fb.acceptData(a)) {
                        var e, f, g = fb.expando, h = a.nodeType, i = h ? fb.cache : a, j = h ? a[g] : a[g] && g;
                        if (j && i[j] && (d || i[j].data) || void 0 !== c || "string" != typeof b) return j || (j = h ? a[g] = X.pop() || fb.guid++ : g), 
                        i[j] || (i[j] = h ? {} : {
                            toJSON: fb.noop
                        }), ("object" == typeof b || "function" == typeof b) && (d ? i[j] = fb.extend(i[j], b) : i[j].data = fb.extend(i[j].data, b)), 
                        f = i[j], d || (f.data || (f.data = {}), f = f.data), void 0 !== c && (f[fb.camelCase(b)] = c), 
                        "string" == typeof b ? (e = f[b], null == e && (e = f[fb.camelCase(b)])) : e = f, 
                        e;
                    }
                }
                function m(a, b, c) {
                    if (fb.acceptData(a)) {
                        var d, e, f = a.nodeType, g = f ? fb.cache : a, h = f ? a[fb.expando] : fb.expando;
                        if (g[h]) {
                            if (b && (d = c ? g[h] : g[h].data)) {
                                fb.isArray(b) ? b = b.concat(fb.map(b, fb.camelCase)) : b in d ? b = [ b ] : (b = fb.camelCase(b), 
                                b = b in d ? [ b ] : b.split(" ")), e = b.length;
                                for (;e--; ) delete d[b[e]];
                                if (c ? !k(d) : !fb.isEmptyObject(d)) return;
                            }
                            (c || (delete g[h].data, k(g[h]))) && (f ? fb.cleanData([ a ], !0) : db.deleteExpando || g != g.window ? delete g[h] : g[h] = null);
                        }
                    }
                }
                function n() {
                    return !0;
                }
                function o() {
                    return !1;
                }
                function p() {
                    try {
                        return pb.activeElement;
                    } catch (a) {}
                }
                function q(a) {
                    var b = Lb.split("|"), c = a.createDocumentFragment();
                    if (c.createElement) for (;b.length; ) c.createElement(b.pop());
                    return c;
                }
                function r(a, b) {
                    var c, d, e = 0, f = typeof a.getElementsByTagName !== yb ? a.getElementsByTagName(b || "*") : typeof a.querySelectorAll !== yb ? a.querySelectorAll(b || "*") : void 0;
                    if (!f) for (f = [], c = a.childNodes || a; null != (d = c[e]); e++) !b || fb.nodeName(d, b) ? f.push(d) : fb.merge(f, r(d, b));
                    return void 0 === b || b && fb.nodeName(a, b) ? fb.merge([ a ], f) : f;
                }
                function s(a) {
                    Fb.test(a.type) && (a.defaultChecked = a.checked);
                }
                function t(a, b) {
                    return fb.nodeName(a, "table") && fb.nodeName(11 !== b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a;
                }
                function u(a) {
                    return a.type = (null !== fb.find.attr(a, "type")) + "/" + a.type, a;
                }
                function v(a) {
                    var b = Wb.exec(a.type);
                    return b ? a.type = b[1] : a.removeAttribute("type"), a;
                }
                function w(a, b) {
                    for (var c, d = 0; null != (c = a[d]); d++) fb._data(c, "globalEval", !b || fb._data(b[d], "globalEval"));
                }
                function x(a, b) {
                    if (1 === b.nodeType && fb.hasData(a)) {
                        var c, d, e, f = fb._data(a), g = fb._data(b, f), h = f.events;
                        if (h) {
                            delete g.handle, g.events = {};
                            for (c in h) for (d = 0, e = h[c].length; e > d; d++) fb.event.add(b, c, h[c][d]);
                        }
                        g.data && (g.data = fb.extend({}, g.data));
                    }
                }
                function y(a, b) {
                    var c, d, e;
                    if (1 === b.nodeType) {
                        if (c = b.nodeName.toLowerCase(), !db.noCloneEvent && b[fb.expando]) {
                            e = fb._data(b);
                            for (d in e.events) fb.removeEvent(b, d, e.handle);
                            b.removeAttribute(fb.expando);
                        }
                        "script" === c && b.text !== a.text ? (u(b).text = a.text, v(b)) : "object" === c ? (b.parentNode && (b.outerHTML = a.outerHTML), 
                        db.html5Clone && a.innerHTML && !fb.trim(b.innerHTML) && (b.innerHTML = a.innerHTML)) : "input" === c && Fb.test(a.type) ? (b.defaultChecked = b.checked = a.checked, 
                        b.value !== a.value && (b.value = a.value)) : "option" === c ? b.defaultSelected = b.selected = a.defaultSelected : ("input" === c || "textarea" === c) && (b.defaultValue = a.defaultValue);
                    }
                }
                function z(a, c) {
                    var d, e = fb(c.createElement(a)).appendTo(c.body), f = b.getDefaultComputedStyle && (d = b.getDefaultComputedStyle(e[0])) ? d.display : fb.css(e[0], "display");
                    return e.detach(), f;
                }
                function A(a) {
                    var b = pb, c = ac[a];
                    return c || (c = z(a, b), "none" !== c && c || (_b = (_b || fb("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement), 
                    b = (_b[0].contentWindow || _b[0].contentDocument).document, b.write(), b.close(), 
                    c = z(a, b), _b.detach()), ac[a] = c), c;
                }
                function B(a, b) {
                    return {
                        get: function() {
                            var c = a();
                            if (null != c) return c ? void delete this.get : (this.get = b).apply(this, arguments);
                        }
                    };
                }
                function C(a, b) {
                    if (b in a) return b;
                    for (var c = b.charAt(0).toUpperCase() + b.slice(1), d = b, e = nc.length; e--; ) if (b = nc[e] + c, 
                    b in a) return b;
                    return d;
                }
                function D(a, b) {
                    for (var c, d, e, f = [], g = 0, h = a.length; h > g; g++) d = a[g], d.style && (f[g] = fb._data(d, "olddisplay"), 
                    c = d.style.display, b ? (f[g] || "none" !== c || (d.style.display = ""), "" === d.style.display && Db(d) && (f[g] = fb._data(d, "olddisplay", A(d.nodeName)))) : (e = Db(d), 
                    (c && "none" !== c || !e) && fb._data(d, "olddisplay", e ? c : fb.css(d, "display"))));
                    for (g = 0; h > g; g++) d = a[g], d.style && (b && "none" !== d.style.display && "" !== d.style.display || (d.style.display = b ? f[g] || "" : "none"));
                    return a;
                }
                function E(a, b, c) {
                    var d = jc.exec(b);
                    return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b;
                }
                function F(a, b, c, d, e) {
                    for (var f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, g = 0; 4 > f; f += 2) "margin" === c && (g += fb.css(a, c + Cb[f], !0, e)), 
                    d ? ("content" === c && (g -= fb.css(a, "padding" + Cb[f], !0, e)), "margin" !== c && (g -= fb.css(a, "border" + Cb[f] + "Width", !0, e))) : (g += fb.css(a, "padding" + Cb[f], !0, e), 
                    "padding" !== c && (g += fb.css(a, "border" + Cb[f] + "Width", !0, e)));
                    return g;
                }
                function G(a, b, c) {
                    var d = !0, e = "width" === b ? a.offsetWidth : a.offsetHeight, f = bc(a), g = db.boxSizing && "border-box" === fb.css(a, "boxSizing", !1, f);
                    if (0 >= e || null == e) {
                        if (e = cc(a, b, f), (0 > e || null == e) && (e = a.style[b]), ec.test(e)) return e;
                        d = g && (db.boxSizingReliable() || e === a.style[b]), e = parseFloat(e) || 0;
                    }
                    return e + F(a, b, c || (g ? "border" : "content"), d, f) + "px";
                }
                function H(a, b, c, d, e) {
                    return new H.prototype.init(a, b, c, d, e);
                }
                function I() {
                    return setTimeout(function() {
                        oc = void 0;
                    }), oc = fb.now();
                }
                function J(a, b) {
                    var c, d = {
                        height: a
                    }, e = 0;
                    for (b = b ? 1 : 0; 4 > e; e += 2 - b) c = Cb[e], d["margin" + c] = d["padding" + c] = a;
                    return b && (d.opacity = d.width = a), d;
                }
                function K(a, b, c) {
                    for (var d, e = (uc[b] || []).concat(uc["*"]), f = 0, g = e.length; g > f; f++) if (d = e[f].call(c, b, a)) return d;
                }
                function L(a, b, c) {
                    var d, e, f, g, h, i, j, k, l = this, m = {}, n = a.style, o = a.nodeType && Db(a), p = fb._data(a, "fxshow");
                    c.queue || (h = fb._queueHooks(a, "fx"), null == h.unqueued && (h.unqueued = 0, 
                    i = h.empty.fire, h.empty.fire = function() {
                        h.unqueued || i();
                    }), h.unqueued++, l.always(function() {
                        l.always(function() {
                            h.unqueued--, fb.queue(a, "fx").length || h.empty.fire();
                        });
                    })), 1 === a.nodeType && ("height" in b || "width" in b) && (c.overflow = [ n.overflow, n.overflowX, n.overflowY ], 
                    j = fb.css(a, "display"), k = "none" === j ? fb._data(a, "olddisplay") || A(a.nodeName) : j, 
                    "inline" === k && "none" === fb.css(a, "float") && (db.inlineBlockNeedsLayout && "inline" !== A(a.nodeName) ? n.zoom = 1 : n.display = "inline-block")), 
                    c.overflow && (n.overflow = "hidden", db.shrinkWrapBlocks() || l.always(function() {
                        n.overflow = c.overflow[0], n.overflowX = c.overflow[1], n.overflowY = c.overflow[2];
                    }));
                    for (d in b) if (e = b[d], qc.exec(e)) {
                        if (delete b[d], f = f || "toggle" === e, e === (o ? "hide" : "show")) {
                            if ("show" !== e || !p || void 0 === p[d]) continue;
                            o = !0;
                        }
                        m[d] = p && p[d] || fb.style(a, d);
                    } else j = void 0;
                    if (fb.isEmptyObject(m)) "inline" === ("none" === j ? A(a.nodeName) : j) && (n.display = j); else {
                        p ? "hidden" in p && (o = p.hidden) : p = fb._data(a, "fxshow", {}), f && (p.hidden = !o), 
                        o ? fb(a).show() : l.done(function() {
                            fb(a).hide();
                        }), l.done(function() {
                            var b;
                            fb._removeData(a, "fxshow");
                            for (b in m) fb.style(a, b, m[b]);
                        });
                        for (d in m) g = K(o ? p[d] : 0, d, l), d in p || (p[d] = g.start, o && (g.end = g.start, 
                        g.start = "width" === d || "height" === d ? 1 : 0));
                    }
                }
                function M(a, b) {
                    var c, d, e, f, g;
                    for (c in a) if (d = fb.camelCase(c), e = b[d], f = a[c], fb.isArray(f) && (e = f[1], 
                    f = a[c] = f[0]), c !== d && (a[d] = f, delete a[c]), g = fb.cssHooks[d], g && "expand" in g) {
                        f = g.expand(f), delete a[d];
                        for (c in f) c in a || (a[c] = f[c], b[c] = e);
                    } else b[d] = e;
                }
                function N(a, b, c) {
                    var d, e, f = 0, g = tc.length, h = fb.Deferred().always(function() {
                        delete i.elem;
                    }), i = function() {
                        if (e) return !1;
                        for (var b = oc || I(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; i > g; g++) j.tweens[g].run(f);
                        return h.notifyWith(a, [ j, f, c ]), 1 > f && i ? c : (h.resolveWith(a, [ j ]), 
                        !1);
                    }, j = h.promise({
                        elem: a,
                        props: fb.extend({}, b),
                        opts: fb.extend(!0, {
                            specialEasing: {}
                        }, c),
                        originalProperties: b,
                        originalOptions: c,
                        startTime: oc || I(),
                        duration: c.duration,
                        tweens: [],
                        createTween: function(b, c) {
                            var d = fb.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
                            return j.tweens.push(d), d;
                        },
                        stop: function(b) {
                            var c = 0, d = b ? j.tweens.length : 0;
                            if (e) return this;
                            for (e = !0; d > c; c++) j.tweens[c].run(1);
                            return b ? h.resolveWith(a, [ j, b ]) : h.rejectWith(a, [ j, b ]), this;
                        }
                    }), k = j.props;
                    for (M(k, j.opts.specialEasing); g > f; f++) if (d = tc[f].call(j, a, k, j.opts)) return d;
                    return fb.map(k, K, j), fb.isFunction(j.opts.start) && j.opts.start.call(a, j), 
                    fb.fx.timer(fb.extend(i, {
                        elem: a,
                        anim: j,
                        queue: j.opts.queue
                    })), j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always);
                }
                function O(a) {
                    return function(b, c) {
                        "string" != typeof b && (c = b, b = "*");
                        var d, e = 0, f = b.toLowerCase().match(ub) || [];
                        if (fb.isFunction(c)) for (;d = f[e++]; ) "+" === d.charAt(0) ? (d = d.slice(1) || "*", 
                        (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c);
                    };
                }
                function P(a, b, c, d) {
                    function e(h) {
                        var i;
                        return f[h] = !0, fb.each(a[h] || [], function(a, h) {
                            var j = h(b, c, d);
                            return "string" != typeof j || g || f[j] ? g ? !(i = j) : void 0 : (b.dataTypes.unshift(j), 
                            e(j), !1);
                        }), i;
                    }
                    var f = {}, g = a === Sc;
                    return e(b.dataTypes[0]) || !f["*"] && e("*");
                }
                function Q(a, b) {
                    var c, d, e = fb.ajaxSettings.flatOptions || {};
                    for (d in b) void 0 !== b[d] && ((e[d] ? a : c || (c = {}))[d] = b[d]);
                    return c && fb.extend(!0, a, c), a;
                }
                function R(a, b, c) {
                    for (var d, e, f, g, h = a.contents, i = a.dataTypes; "*" === i[0]; ) i.shift(), 
                    void 0 === e && (e = a.mimeType || b.getResponseHeader("Content-Type"));
                    if (e) for (g in h) if (h[g] && h[g].test(e)) {
                        i.unshift(g);
                        break;
                    }
                    if (i[0] in c) f = i[0]; else {
                        for (g in c) {
                            if (!i[0] || a.converters[g + " " + i[0]]) {
                                f = g;
                                break;
                            }
                            d || (d = g);
                        }
                        f = f || d;
                    }
                    return f ? (f !== i[0] && i.unshift(f), c[f]) : void 0;
                }
                function S(a, b, c, d) {
                    var e, f, g, h, i, j = {}, k = a.dataTypes.slice();
                    if (k[1]) for (g in a.converters) j[g.toLowerCase()] = a.converters[g];
                    for (f = k.shift(); f; ) if (a.responseFields[f] && (c[a.responseFields[f]] = b), 
                    !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)), i = f, f = k.shift()) if ("*" === f) f = i; else if ("*" !== i && i !== f) {
                        if (g = j[i + " " + f] || j["* " + f], !g) for (e in j) if (h = e.split(" "), h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) {
                            g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0], k.unshift(h[1]));
                            break;
                        }
                        if (g !== !0) if (g && a["throws"]) b = g(b); else try {
                            b = g(b);
                        } catch (l) {
                            return {
                                state: "parsererror",
                                error: g ? l : "No conversion from " + i + " to " + f
                            };
                        }
                    }
                    return {
                        state: "success",
                        data: b
                    };
                }
                function T(a, b, c, d) {
                    var e;
                    if (fb.isArray(b)) fb.each(b, function(b, e) {
                        c || Wc.test(a) ? d(a, e) : T(a + "[" + ("object" == typeof e ? b : "") + "]", e, c, d);
                    }); else if (c || "object" !== fb.type(b)) d(a, b); else for (e in b) T(a + "[" + e + "]", b[e], c, d);
                }
                function U() {
                    try {
                        return new b.XMLHttpRequest();
                    } catch (a) {}
                }
                function V() {
                    try {
                        return new b.ActiveXObject("Microsoft.XMLHTTP");
                    } catch (a) {}
                }
                function W(a) {
                    return fb.isWindow(a) ? a : 9 === a.nodeType ? a.defaultView || a.parentWindow : !1;
                }
                var X = [], Y = X.slice, Z = X.concat, $ = X.push, _ = X.indexOf, ab = {}, bb = ab.toString, cb = ab.hasOwnProperty, db = {}, eb = "1.11.1", fb = function(a, b) {
                    return new fb.fn.init(a, b);
                }, gb = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, hb = /^-ms-/, ib = /-([\da-z])/gi, jb = function(a, b) {
                    return b.toUpperCase();
                };
                fb.fn = fb.prototype = {
                    jquery: eb,
                    constructor: fb,
                    selector: "",
                    length: 0,
                    toArray: function() {
                        return Y.call(this);
                    },
                    get: function(a) {
                        return null != a ? 0 > a ? this[a + this.length] : this[a] : Y.call(this);
                    },
                    pushStack: function(a) {
                        var b = fb.merge(this.constructor(), a);
                        return b.prevObject = this, b.context = this.context, b;
                    },
                    each: function(a, b) {
                        return fb.each(this, a, b);
                    },
                    map: function(a) {
                        return this.pushStack(fb.map(this, function(b, c) {
                            return a.call(b, c, b);
                        }));
                    },
                    slice: function() {
                        return this.pushStack(Y.apply(this, arguments));
                    },
                    first: function() {
                        return this.eq(0);
                    },
                    last: function() {
                        return this.eq(-1);
                    },
                    eq: function(a) {
                        var b = this.length, c = +a + (0 > a ? b : 0);
                        return this.pushStack(c >= 0 && b > c ? [ this[c] ] : []);
                    },
                    end: function() {
                        return this.prevObject || this.constructor(null);
                    },
                    push: $,
                    sort: X.sort,
                    splice: X.splice
                }, fb.extend = fb.fn.extend = function() {
                    var a, b, c, d, e, f, g = arguments[0] || {}, h = 1, i = arguments.length, j = !1;
                    for ("boolean" == typeof g && (j = g, g = arguments[h] || {}, h++), "object" == typeof g || fb.isFunction(g) || (g = {}), 
                    h === i && (g = this, h--); i > h; h++) if (null != (e = arguments[h])) for (d in e) a = g[d], 
                    c = e[d], g !== c && (j && c && (fb.isPlainObject(c) || (b = fb.isArray(c))) ? (b ? (b = !1, 
                    f = a && fb.isArray(a) ? a : []) : f = a && fb.isPlainObject(a) ? a : {}, g[d] = fb.extend(j, f, c)) : void 0 !== c && (g[d] = c));
                    return g;
                }, fb.extend({
                    expando: "jQuery" + (eb + Math.random()).replace(/\D/g, ""),
                    isReady: !0,
                    error: function(a) {
                        throw new Error(a);
                    },
                    noop: function() {},
                    isFunction: function(a) {
                        return "function" === fb.type(a);
                    },
                    isArray: Array.isArray || function(a) {
                        return "array" === fb.type(a);
                    },
                    isWindow: function(a) {
                        return null != a && a == a.window;
                    },
                    isNumeric: function(a) {
                        return !fb.isArray(a) && a - parseFloat(a) >= 0;
                    },
                    isEmptyObject: function(a) {
                        var b;
                        for (b in a) return !1;
                        return !0;
                    },
                    isPlainObject: function(a) {
                        var b;
                        if (!a || "object" !== fb.type(a) || a.nodeType || fb.isWindow(a)) return !1;
                        try {
                            if (a.constructor && !cb.call(a, "constructor") && !cb.call(a.constructor.prototype, "isPrototypeOf")) return !1;
                        } catch (c) {
                            return !1;
                        }
                        if (db.ownLast) for (b in a) return cb.call(a, b);
                        for (b in a) ;
                        return void 0 === b || cb.call(a, b);
                    },
                    type: function(a) {
                        return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? ab[bb.call(a)] || "object" : typeof a;
                    },
                    globalEval: function(a) {
                        a && fb.trim(a) && (b.execScript || function(a) {
                            b.eval.call(b, a);
                        })(a);
                    },
                    camelCase: function(a) {
                        return a.replace(hb, "ms-").replace(ib, jb);
                    },
                    nodeName: function(a, b) {
                        return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase();
                    },
                    each: function(a, b, c) {
                        var e, f = 0, g = a.length, h = d(a);
                        if (c) {
                            if (h) for (;g > f && (e = b.apply(a[f], c), e !== !1); f++) ; else for (f in a) if (e = b.apply(a[f], c), 
                            e === !1) break;
                        } else if (h) for (;g > f && (e = b.call(a[f], f, a[f]), e !== !1); f++) ; else for (f in a) if (e = b.call(a[f], f, a[f]), 
                        e === !1) break;
                        return a;
                    },
                    trim: function(a) {
                        return null == a ? "" : (a + "").replace(gb, "");
                    },
                    makeArray: function(a, b) {
                        var c = b || [];
                        return null != a && (d(Object(a)) ? fb.merge(c, "string" == typeof a ? [ a ] : a) : $.call(c, a)), 
                        c;
                    },
                    inArray: function(a, b, c) {
                        var d;
                        if (b) {
                            if (_) return _.call(b, a, c);
                            for (d = b.length, c = c ? 0 > c ? Math.max(0, d + c) : c : 0; d > c; c++) if (c in b && b[c] === a) return c;
                        }
                        return -1;
                    },
                    merge: function(a, b) {
                        for (var c = +b.length, d = 0, e = a.length; c > d; ) a[e++] = b[d++];
                        if (c !== c) for (;void 0 !== b[d]; ) a[e++] = b[d++];
                        return a.length = e, a;
                    },
                    grep: function(a, b, c) {
                        for (var d, e = [], f = 0, g = a.length, h = !c; g > f; f++) d = !b(a[f], f), d !== h && e.push(a[f]);
                        return e;
                    },
                    map: function(a, b, c) {
                        var e, f = 0, g = a.length, h = d(a), i = [];
                        if (h) for (;g > f; f++) e = b(a[f], f, c), null != e && i.push(e); else for (f in a) e = b(a[f], f, c), 
                        null != e && i.push(e);
                        return Z.apply([], i);
                    },
                    guid: 1,
                    proxy: function(a, b) {
                        var c, d, e;
                        return "string" == typeof b && (e = a[b], b = a, a = e), fb.isFunction(a) ? (c = Y.call(arguments, 2), 
                        d = function() {
                            return a.apply(b || this, c.concat(Y.call(arguments)));
                        }, d.guid = a.guid = a.guid || fb.guid++, d) : void 0;
                    },
                    now: function() {
                        return +new Date();
                    },
                    support: db
                }), fb.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(a, b) {
                    ab["[object " + b + "]"] = b.toLowerCase();
                });
                var kb = function(a) {
                    function b(a, b, c, d) {
                        var e, f, g, h, i, j, l, n, o, p;
                        if ((b ? b.ownerDocument || b : O) !== G && F(b), b = b || G, c = c || [], !a || "string" != typeof a) return c;
                        if (1 !== (h = b.nodeType) && 9 !== h) return [];
                        if (I && !d) {
                            if (e = sb.exec(a)) if (g = e[1]) {
                                if (9 === h) {
                                    if (f = b.getElementById(g), !f || !f.parentNode) return c;
                                    if (f.id === g) return c.push(f), c;
                                } else if (b.ownerDocument && (f = b.ownerDocument.getElementById(g)) && M(b, f) && f.id === g) return c.push(f), 
                                c;
                            } else {
                                if (e[2]) return _.apply(c, b.getElementsByTagName(a)), c;
                                if ((g = e[3]) && v.getElementsByClassName && b.getElementsByClassName) return _.apply(c, b.getElementsByClassName(g)), 
                                c;
                            }
                            if (v.qsa && (!J || !J.test(a))) {
                                if (n = l = N, o = b, p = 9 === h && a, 1 === h && "object" !== b.nodeName.toLowerCase()) {
                                    for (j = z(a), (l = b.getAttribute("id")) ? n = l.replace(ub, "\\$&") : b.setAttribute("id", n), 
                                    n = "[id='" + n + "'] ", i = j.length; i--; ) j[i] = n + m(j[i]);
                                    o = tb.test(a) && k(b.parentNode) || b, p = j.join(",");
                                }
                                if (p) try {
                                    return _.apply(c, o.querySelectorAll(p)), c;
                                } catch (q) {} finally {
                                    l || b.removeAttribute("id");
                                }
                            }
                        }
                        return B(a.replace(ib, "$1"), b, c, d);
                    }
                    function c() {
                        function a(c, d) {
                            return b.push(c + " ") > w.cacheLength && delete a[b.shift()], a[c + " "] = d;
                        }
                        var b = [];
                        return a;
                    }
                    function d(a) {
                        return a[N] = !0, a;
                    }
                    function e(a) {
                        var b = G.createElement("div");
                        try {
                            return !!a(b);
                        } catch (c) {
                            return !1;
                        } finally {
                            b.parentNode && b.parentNode.removeChild(b), b = null;
                        }
                    }
                    function f(a, b) {
                        for (var c = a.split("|"), d = a.length; d--; ) w.attrHandle[c[d]] = b;
                    }
                    function g(a, b) {
                        var c = b && a, d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || W) - (~a.sourceIndex || W);
                        if (d) return d;
                        if (c) for (;c = c.nextSibling; ) if (c === b) return -1;
                        return a ? 1 : -1;
                    }
                    function h(a) {
                        return function(b) {
                            var c = b.nodeName.toLowerCase();
                            return "input" === c && b.type === a;
                        };
                    }
                    function i(a) {
                        return function(b) {
                            var c = b.nodeName.toLowerCase();
                            return ("input" === c || "button" === c) && b.type === a;
                        };
                    }
                    function j(a) {
                        return d(function(b) {
                            return b = +b, d(function(c, d) {
                                for (var e, f = a([], c.length, b), g = f.length; g--; ) c[e = f[g]] && (c[e] = !(d[e] = c[e]));
                            });
                        });
                    }
                    function k(a) {
                        return a && typeof a.getElementsByTagName !== V && a;
                    }
                    function l() {}
                    function m(a) {
                        for (var b = 0, c = a.length, d = ""; c > b; b++) d += a[b].value;
                        return d;
                    }
                    function n(a, b, c) {
                        var d = b.dir, e = c && "parentNode" === d, f = Q++;
                        return b.first ? function(b, c, f) {
                            for (;b = b[d]; ) if (1 === b.nodeType || e) return a(b, c, f);
                        } : function(b, c, g) {
                            var h, i, j = [ P, f ];
                            if (g) {
                                for (;b = b[d]; ) if ((1 === b.nodeType || e) && a(b, c, g)) return !0;
                            } else for (;b = b[d]; ) if (1 === b.nodeType || e) {
                                if (i = b[N] || (b[N] = {}), (h = i[d]) && h[0] === P && h[1] === f) return j[2] = h[2];
                                if (i[d] = j, j[2] = a(b, c, g)) return !0;
                            }
                        };
                    }
                    function o(a) {
                        return a.length > 1 ? function(b, c, d) {
                            for (var e = a.length; e--; ) if (!a[e](b, c, d)) return !1;
                            return !0;
                        } : a[0];
                    }
                    function p(a, c, d) {
                        for (var e = 0, f = c.length; f > e; e++) b(a, c[e], d);
                        return d;
                    }
                    function q(a, b, c, d, e) {
                        for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++) (f = a[h]) && (!c || c(f, d, e)) && (g.push(f), 
                        j && b.push(h));
                        return g;
                    }
                    function r(a, b, c, e, f, g) {
                        return e && !e[N] && (e = r(e)), f && !f[N] && (f = r(f, g)), d(function(d, g, h, i) {
                            var j, k, l, m = [], n = [], o = g.length, r = d || p(b || "*", h.nodeType ? [ h ] : h, []), s = !a || !d && b ? r : q(r, m, a, h, i), t = c ? f || (d ? a : o || e) ? [] : g : s;
                            if (c && c(s, t, h, i), e) for (j = q(t, n), e(j, [], h, i), k = j.length; k--; ) (l = j[k]) && (t[n[k]] = !(s[n[k]] = l));
                            if (d) {
                                if (f || a) {
                                    if (f) {
                                        for (j = [], k = t.length; k--; ) (l = t[k]) && j.push(s[k] = l);
                                        f(null, t = [], j, i);
                                    }
                                    for (k = t.length; k--; ) (l = t[k]) && (j = f ? bb.call(d, l) : m[k]) > -1 && (d[j] = !(g[j] = l));
                                }
                            } else t = q(t === g ? t.splice(o, t.length) : t), f ? f(null, g, t, i) : _.apply(g, t);
                        });
                    }
                    function s(a) {
                        for (var b, c, d, e = a.length, f = w.relative[a[0].type], g = f || w.relative[" "], h = f ? 1 : 0, i = n(function(a) {
                            return a === b;
                        }, g, !0), j = n(function(a) {
                            return bb.call(b, a) > -1;
                        }, g, !0), k = [ function(a, c, d) {
                            return !f && (d || c !== C) || ((b = c).nodeType ? i(a, c, d) : j(a, c, d));
                        } ]; e > h; h++) if (c = w.relative[a[h].type]) k = [ n(o(k), c) ]; else {
                            if (c = w.filter[a[h].type].apply(null, a[h].matches), c[N]) {
                                for (d = ++h; e > d && !w.relative[a[d].type]; d++) ;
                                return r(h > 1 && o(k), h > 1 && m(a.slice(0, h - 1).concat({
                                    value: " " === a[h - 2].type ? "*" : ""
                                })).replace(ib, "$1"), c, d > h && s(a.slice(h, d)), e > d && s(a = a.slice(d)), e > d && m(a));
                            }
                            k.push(c);
                        }
                        return o(k);
                    }
                    function t(a, c) {
                        var e = c.length > 0, f = a.length > 0, g = function(d, g, h, i, j) {
                            var k, l, m, n = 0, o = "0", p = d && [], r = [], s = C, t = d || f && w.find.TAG("*", j), u = P += null == s ? 1 : Math.random() || .1, v = t.length;
                            for (j && (C = g !== G && g); o !== v && null != (k = t[o]); o++) {
                                if (f && k) {
                                    for (l = 0; m = a[l++]; ) if (m(k, g, h)) {
                                        i.push(k);
                                        break;
                                    }
                                    j && (P = u);
                                }
                                e && ((k = !m && k) && n--, d && p.push(k));
                            }
                            if (n += o, e && o !== n) {
                                for (l = 0; m = c[l++]; ) m(p, r, g, h);
                                if (d) {
                                    if (n > 0) for (;o--; ) p[o] || r[o] || (r[o] = Z.call(i));
                                    r = q(r);
                                }
                                _.apply(i, r), j && !d && r.length > 0 && n + c.length > 1 && b.uniqueSort(i);
                            }
                            return j && (P = u, C = s), p;
                        };
                        return e ? d(g) : g;
                    }
                    var u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M, N = "sizzle" + -new Date(), O = a.document, P = 0, Q = 0, R = c(), S = c(), T = c(), U = function(a, b) {
                        return a === b && (E = !0), 0;
                    }, V = "undefined", W = 1 << 31, X = {}.hasOwnProperty, Y = [], Z = Y.pop, $ = Y.push, _ = Y.push, ab = Y.slice, bb = Y.indexOf || function(a) {
                        for (var b = 0, c = this.length; c > b; b++) if (this[b] === a) return b;
                        return -1;
                    }, cb = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", db = "[\\x20\\t\\r\\n\\f]", eb = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", fb = eb.replace("w", "w#"), gb = "\\[" + db + "*(" + eb + ")(?:" + db + "*([*^$|!~]?=)" + db + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + fb + "))|)" + db + "*\\]", hb = ":(" + eb + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + gb + ")*)|.*)\\)|)", ib = new RegExp("^" + db + "+|((?:^|[^\\\\])(?:\\\\.)*)" + db + "+$", "g"), jb = new RegExp("^" + db + "*," + db + "*"), kb = new RegExp("^" + db + "*([>+~]|" + db + ")" + db + "*"), lb = new RegExp("=" + db + "*([^\\]'\"]*?)" + db + "*\\]", "g"), mb = new RegExp(hb), nb = new RegExp("^" + fb + "$"), ob = {
                        ID: new RegExp("^#(" + eb + ")"),
                        CLASS: new RegExp("^\\.(" + eb + ")"),
                        TAG: new RegExp("^(" + eb.replace("w", "w*") + ")"),
                        ATTR: new RegExp("^" + gb),
                        PSEUDO: new RegExp("^" + hb),
                        CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + db + "*(even|odd|(([+-]|)(\\d*)n|)" + db + "*(?:([+-]|)" + db + "*(\\d+)|))" + db + "*\\)|)", "i"),
                        bool: new RegExp("^(?:" + cb + ")$", "i"),
                        needsContext: new RegExp("^" + db + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + db + "*((?:-\\d)?\\d*)" + db + "*\\)|)(?=[^-]|$)", "i")
                    }, pb = /^(?:input|select|textarea|button)$/i, qb = /^h\d$/i, rb = /^[^{]+\{\s*\[native \w/, sb = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, tb = /[+~]/, ub = /'|\\/g, vb = new RegExp("\\\\([\\da-f]{1,6}" + db + "?|(" + db + ")|.)", "ig"), wb = function(a, b, c) {
                        var d = "0x" + b - 65536;
                        return d !== d || c ? b : 0 > d ? String.fromCharCode(d + 65536) : String.fromCharCode(d >> 10 | 55296, 1023 & d | 56320);
                    };
                    try {
                        _.apply(Y = ab.call(O.childNodes), O.childNodes), Y[O.childNodes.length].nodeType;
                    } catch (xb) {
                        _ = {
                            apply: Y.length ? function(a, b) {
                                $.apply(a, ab.call(b));
                            } : function(a, b) {
                                for (var c = a.length, d = 0; a[c++] = b[d++]; ) ;
                                a.length = c - 1;
                            }
                        };
                    }
                    v = b.support = {}, y = b.isXML = function(a) {
                        var b = a && (a.ownerDocument || a).documentElement;
                        return b ? "HTML" !== b.nodeName : !1;
                    }, F = b.setDocument = function(a) {
                        var b, c = a ? a.ownerDocument || a : O, d = c.defaultView;
                        return c !== G && 9 === c.nodeType && c.documentElement ? (G = c, H = c.documentElement, 
                        I = !y(c), d && d !== d.top && (d.addEventListener ? d.addEventListener("unload", function() {
                            F();
                        }, !1) : d.attachEvent && d.attachEvent("onunload", function() {
                            F();
                        })), v.attributes = e(function(a) {
                            return a.className = "i", !a.getAttribute("className");
                        }), v.getElementsByTagName = e(function(a) {
                            return a.appendChild(c.createComment("")), !a.getElementsByTagName("*").length;
                        }), v.getElementsByClassName = rb.test(c.getElementsByClassName) && e(function(a) {
                            return a.innerHTML = "<div class='a'></div><div class='a i'></div>", a.firstChild.className = "i", 
                            2 === a.getElementsByClassName("i").length;
                        }), v.getById = e(function(a) {
                            return H.appendChild(a).id = N, !c.getElementsByName || !c.getElementsByName(N).length;
                        }), v.getById ? (w.find.ID = function(a, b) {
                            if (typeof b.getElementById !== V && I) {
                                var c = b.getElementById(a);
                                return c && c.parentNode ? [ c ] : [];
                            }
                        }, w.filter.ID = function(a) {
                            var b = a.replace(vb, wb);
                            return function(a) {
                                return a.getAttribute("id") === b;
                            };
                        }) : (delete w.find.ID, w.filter.ID = function(a) {
                            var b = a.replace(vb, wb);
                            return function(a) {
                                var c = typeof a.getAttributeNode !== V && a.getAttributeNode("id");
                                return c && c.value === b;
                            };
                        }), w.find.TAG = v.getElementsByTagName ? function(a, b) {
                            return typeof b.getElementsByTagName !== V ? b.getElementsByTagName(a) : void 0;
                        } : function(a, b) {
                            var c, d = [], e = 0, f = b.getElementsByTagName(a);
                            if ("*" === a) {
                                for (;c = f[e++]; ) 1 === c.nodeType && d.push(c);
                                return d;
                            }
                            return f;
                        }, w.find.CLASS = v.getElementsByClassName && function(a, b) {
                            return typeof b.getElementsByClassName !== V && I ? b.getElementsByClassName(a) : void 0;
                        }, K = [], J = [], (v.qsa = rb.test(c.querySelectorAll)) && (e(function(a) {
                            a.innerHTML = "<select msallowclip=''><option selected=''></option></select>", a.querySelectorAll("[msallowclip^='']").length && J.push("[*^$]=" + db + "*(?:''|\"\")"), 
                            a.querySelectorAll("[selected]").length || J.push("\\[" + db + "*(?:value|" + cb + ")"), 
                            a.querySelectorAll(":checked").length || J.push(":checked");
                        }), e(function(a) {
                            var b = c.createElement("input");
                            b.setAttribute("type", "hidden"), a.appendChild(b).setAttribute("name", "D"), a.querySelectorAll("[name=d]").length && J.push("name" + db + "*[*^$|!~]?="), 
                            a.querySelectorAll(":enabled").length || J.push(":enabled", ":disabled"), a.querySelectorAll("*,:x"), 
                            J.push(",.*:");
                        })), (v.matchesSelector = rb.test(L = H.matches || H.webkitMatchesSelector || H.mozMatchesSelector || H.oMatchesSelector || H.msMatchesSelector)) && e(function(a) {
                            v.disconnectedMatch = L.call(a, "div"), L.call(a, "[s!='']:x"), K.push("!=", hb);
                        }), J = J.length && new RegExp(J.join("|")), K = K.length && new RegExp(K.join("|")), 
                        b = rb.test(H.compareDocumentPosition), M = b || rb.test(H.contains) ? function(a, b) {
                            var c = 9 === a.nodeType ? a.documentElement : a, d = b && b.parentNode;
                            return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)));
                        } : function(a, b) {
                            if (b) for (;b = b.parentNode; ) if (b === a) return !0;
                            return !1;
                        }, U = b ? function(a, b) {
                            if (a === b) return E = !0, 0;
                            var d = !a.compareDocumentPosition - !b.compareDocumentPosition;
                            return d ? d : (d = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 
                            1 & d || !v.sortDetached && b.compareDocumentPosition(a) === d ? a === c || a.ownerDocument === O && M(O, a) ? -1 : b === c || b.ownerDocument === O && M(O, b) ? 1 : D ? bb.call(D, a) - bb.call(D, b) : 0 : 4 & d ? -1 : 1);
                        } : function(a, b) {
                            if (a === b) return E = !0, 0;
                            var d, e = 0, f = a.parentNode, h = b.parentNode, i = [ a ], j = [ b ];
                            if (!f || !h) return a === c ? -1 : b === c ? 1 : f ? -1 : h ? 1 : D ? bb.call(D, a) - bb.call(D, b) : 0;
                            if (f === h) return g(a, b);
                            for (d = a; d = d.parentNode; ) i.unshift(d);
                            for (d = b; d = d.parentNode; ) j.unshift(d);
                            for (;i[e] === j[e]; ) e++;
                            return e ? g(i[e], j[e]) : i[e] === O ? -1 : j[e] === O ? 1 : 0;
                        }, c) : G;
                    }, b.matches = function(a, c) {
                        return b(a, null, null, c);
                    }, b.matchesSelector = function(a, c) {
                        if ((a.ownerDocument || a) !== G && F(a), c = c.replace(lb, "='$1']"), !(!v.matchesSelector || !I || K && K.test(c) || J && J.test(c))) try {
                            var d = L.call(a, c);
                            if (d || v.disconnectedMatch || a.document && 11 !== a.document.nodeType) return d;
                        } catch (e) {}
                        return b(c, G, null, [ a ]).length > 0;
                    }, b.contains = function(a, b) {
                        return (a.ownerDocument || a) !== G && F(a), M(a, b);
                    }, b.attr = function(a, b) {
                        (a.ownerDocument || a) !== G && F(a);
                        var c = w.attrHandle[b.toLowerCase()], d = c && X.call(w.attrHandle, b.toLowerCase()) ? c(a, b, !I) : void 0;
                        return void 0 !== d ? d : v.attributes || !I ? a.getAttribute(b) : (d = a.getAttributeNode(b)) && d.specified ? d.value : null;
                    }, b.error = function(a) {
                        throw new Error("Syntax error, unrecognized expression: " + a);
                    }, b.uniqueSort = function(a) {
                        var b, c = [], d = 0, e = 0;
                        if (E = !v.detectDuplicates, D = !v.sortStable && a.slice(0), a.sort(U), E) {
                            for (;b = a[e++]; ) b === a[e] && (d = c.push(e));
                            for (;d--; ) a.splice(c[d], 1);
                        }
                        return D = null, a;
                    }, x = b.getText = function(a) {
                        var b, c = "", d = 0, e = a.nodeType;
                        if (e) {
                            if (1 === e || 9 === e || 11 === e) {
                                if ("string" == typeof a.textContent) return a.textContent;
                                for (a = a.firstChild; a; a = a.nextSibling) c += x(a);
                            } else if (3 === e || 4 === e) return a.nodeValue;
                        } else for (;b = a[d++]; ) c += x(b);
                        return c;
                    }, w = b.selectors = {
                        cacheLength: 50,
                        createPseudo: d,
                        match: ob,
                        attrHandle: {},
                        find: {},
                        relative: {
                            ">": {
                                dir: "parentNode",
                                first: !0
                            },
                            " ": {
                                dir: "parentNode"
                            },
                            "+": {
                                dir: "previousSibling",
                                first: !0
                            },
                            "~": {
                                dir: "previousSibling"
                            }
                        },
                        preFilter: {
                            ATTR: function(a) {
                                return a[1] = a[1].replace(vb, wb), a[3] = (a[3] || a[4] || a[5] || "").replace(vb, wb), 
                                "~=" === a[2] && (a[3] = " " + a[3] + " "), a.slice(0, 4);
                            },
                            CHILD: function(a) {
                                return a[1] = a[1].toLowerCase(), "nth" === a[1].slice(0, 3) ? (a[3] || b.error(a[0]), 
                                a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])), a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && b.error(a[0]), 
                                a;
                            },
                            PSEUDO: function(a) {
                                var b, c = !a[6] && a[2];
                                return ob.CHILD.test(a[0]) ? null : (a[3] ? a[2] = a[4] || a[5] || "" : c && mb.test(c) && (b = z(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b), 
                                a[2] = c.slice(0, b)), a.slice(0, 3));
                            }
                        },
                        filter: {
                            TAG: function(a) {
                                var b = a.replace(vb, wb).toLowerCase();
                                return "*" === a ? function() {
                                    return !0;
                                } : function(a) {
                                    return a.nodeName && a.nodeName.toLowerCase() === b;
                                };
                            },
                            CLASS: function(a) {
                                var b = R[a + " "];
                                return b || (b = new RegExp("(^|" + db + ")" + a + "(" + db + "|$)")) && R(a, function(a) {
                                    return b.test("string" == typeof a.className && a.className || typeof a.getAttribute !== V && a.getAttribute("class") || "");
                                });
                            },
                            ATTR: function(a, c, d) {
                                return function(e) {
                                    var f = b.attr(e, a);
                                    return null == f ? "!=" === c : c ? (f += "", "=" === c ? f === d : "!=" === c ? f !== d : "^=" === c ? d && 0 === f.indexOf(d) : "*=" === c ? d && f.indexOf(d) > -1 : "$=" === c ? d && f.slice(-d.length) === d : "~=" === c ? (" " + f + " ").indexOf(d) > -1 : "|=" === c ? f === d || f.slice(0, d.length + 1) === d + "-" : !1) : !0;
                                };
                            },
                            CHILD: function(a, b, c, d, e) {
                                var f = "nth" !== a.slice(0, 3), g = "last" !== a.slice(-4), h = "of-type" === b;
                                return 1 === d && 0 === e ? function(a) {
                                    return !!a.parentNode;
                                } : function(b, c, i) {
                                    var j, k, l, m, n, o, p = f !== g ? "nextSibling" : "previousSibling", q = b.parentNode, r = h && b.nodeName.toLowerCase(), s = !i && !h;
                                    if (q) {
                                        if (f) {
                                            for (;p; ) {
                                                for (l = b; l = l[p]; ) if (h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) return !1;
                                                o = p = "only" === a && !o && "nextSibling";
                                            }
                                            return !0;
                                        }
                                        if (o = [ g ? q.firstChild : q.lastChild ], g && s) {
                                            for (k = q[N] || (q[N] = {}), j = k[a] || [], n = j[0] === P && j[1], m = j[0] === P && j[2], 
                                            l = n && q.childNodes[n]; l = ++n && l && l[p] || (m = n = 0) || o.pop(); ) if (1 === l.nodeType && ++m && l === b) {
                                                k[a] = [ P, n, m ];
                                                break;
                                            }
                                        } else if (s && (j = (b[N] || (b[N] = {}))[a]) && j[0] === P) m = j[1]; else for (;(l = ++n && l && l[p] || (m = n = 0) || o.pop()) && ((h ? l.nodeName.toLowerCase() !== r : 1 !== l.nodeType) || !++m || (s && ((l[N] || (l[N] = {}))[a] = [ P, m ]), 
                                        l !== b)); ) ;
                                        return m -= e, m === d || m % d === 0 && m / d >= 0;
                                    }
                                };
                            },
                            PSEUDO: function(a, c) {
                                var e, f = w.pseudos[a] || w.setFilters[a.toLowerCase()] || b.error("unsupported pseudo: " + a);
                                return f[N] ? f(c) : f.length > 1 ? (e = [ a, a, "", c ], w.setFilters.hasOwnProperty(a.toLowerCase()) ? d(function(a, b) {
                                    for (var d, e = f(a, c), g = e.length; g--; ) d = bb.call(a, e[g]), a[d] = !(b[d] = e[g]);
                                }) : function(a) {
                                    return f(a, 0, e);
                                }) : f;
                            }
                        },
                        pseudos: {
                            not: d(function(a) {
                                var b = [], c = [], e = A(a.replace(ib, "$1"));
                                return e[N] ? d(function(a, b, c, d) {
                                    for (var f, g = e(a, null, d, []), h = a.length; h--; ) (f = g[h]) && (a[h] = !(b[h] = f));
                                }) : function(a, d, f) {
                                    return b[0] = a, e(b, null, f, c), !c.pop();
                                };
                            }),
                            has: d(function(a) {
                                return function(c) {
                                    return b(a, c).length > 0;
                                };
                            }),
                            contains: d(function(a) {
                                return function(b) {
                                    return (b.textContent || b.innerText || x(b)).indexOf(a) > -1;
                                };
                            }),
                            lang: d(function(a) {
                                return nb.test(a || "") || b.error("unsupported lang: " + a), a = a.replace(vb, wb).toLowerCase(), 
                                function(b) {
                                    var c;
                                    do if (c = I ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang")) return c = c.toLowerCase(), 
                                    c === a || 0 === c.indexOf(a + "-"); while ((b = b.parentNode) && 1 === b.nodeType);
                                    return !1;
                                };
                            }),
                            target: function(b) {
                                var c = a.location && a.location.hash;
                                return c && c.slice(1) === b.id;
                            },
                            root: function(a) {
                                return a === H;
                            },
                            focus: function(a) {
                                return a === G.activeElement && (!G.hasFocus || G.hasFocus()) && !!(a.type || a.href || ~a.tabIndex);
                            },
                            enabled: function(a) {
                                return a.disabled === !1;
                            },
                            disabled: function(a) {
                                return a.disabled === !0;
                            },
                            checked: function(a) {
                                var b = a.nodeName.toLowerCase();
                                return "input" === b && !!a.checked || "option" === b && !!a.selected;
                            },
                            selected: function(a) {
                                return a.parentNode && a.parentNode.selectedIndex, a.selected === !0;
                            },
                            empty: function(a) {
                                for (a = a.firstChild; a; a = a.nextSibling) if (a.nodeType < 6) return !1;
                                return !0;
                            },
                            parent: function(a) {
                                return !w.pseudos.empty(a);
                            },
                            header: function(a) {
                                return qb.test(a.nodeName);
                            },
                            input: function(a) {
                                return pb.test(a.nodeName);
                            },
                            button: function(a) {
                                var b = a.nodeName.toLowerCase();
                                return "input" === b && "button" === a.type || "button" === b;
                            },
                            text: function(a) {
                                var b;
                                return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase());
                            },
                            first: j(function() {
                                return [ 0 ];
                            }),
                            last: j(function(a, b) {
                                return [ b - 1 ];
                            }),
                            eq: j(function(a, b, c) {
                                return [ 0 > c ? c + b : c ];
                            }),
                            even: j(function(a, b) {
                                for (var c = 0; b > c; c += 2) a.push(c);
                                return a;
                            }),
                            odd: j(function(a, b) {
                                for (var c = 1; b > c; c += 2) a.push(c);
                                return a;
                            }),
                            lt: j(function(a, b, c) {
                                for (var d = 0 > c ? c + b : c; --d >= 0; ) a.push(d);
                                return a;
                            }),
                            gt: j(function(a, b, c) {
                                for (var d = 0 > c ? c + b : c; ++d < b; ) a.push(d);
                                return a;
                            })
                        }
                    }, w.pseudos.nth = w.pseudos.eq;
                    for (u in {
                        radio: !0,
                        checkbox: !0,
                        file: !0,
                        password: !0,
                        image: !0
                    }) w.pseudos[u] = h(u);
                    for (u in {
                        submit: !0,
                        reset: !0
                    }) w.pseudos[u] = i(u);
                    return l.prototype = w.filters = w.pseudos, w.setFilters = new l(), z = b.tokenize = function(a, c) {
                        var d, e, f, g, h, i, j, k = S[a + " "];
                        if (k) return c ? 0 : k.slice(0);
                        for (h = a, i = [], j = w.preFilter; h; ) {
                            (!d || (e = jb.exec(h))) && (e && (h = h.slice(e[0].length) || h), i.push(f = [])), 
                            d = !1, (e = kb.exec(h)) && (d = e.shift(), f.push({
                                value: d,
                                type: e[0].replace(ib, " ")
                            }), h = h.slice(d.length));
                            for (g in w.filter) !(e = ob[g].exec(h)) || j[g] && !(e = j[g](e)) || (d = e.shift(), 
                            f.push({
                                value: d,
                                type: g,
                                matches: e
                            }), h = h.slice(d.length));
                            if (!d) break;
                        }
                        return c ? h.length : h ? b.error(a) : S(a, i).slice(0);
                    }, A = b.compile = function(a, b) {
                        var c, d = [], e = [], f = T[a + " "];
                        if (!f) {
                            for (b || (b = z(a)), c = b.length; c--; ) f = s(b[c]), f[N] ? d.push(f) : e.push(f);
                            f = T(a, t(e, d)), f.selector = a;
                        }
                        return f;
                    }, B = b.select = function(a, b, c, d) {
                        var e, f, g, h, i, j = "function" == typeof a && a, l = !d && z(a = j.selector || a);
                        if (c = c || [], 1 === l.length) {
                            if (f = l[0] = l[0].slice(0), f.length > 2 && "ID" === (g = f[0]).type && v.getById && 9 === b.nodeType && I && w.relative[f[1].type]) {
                                if (b = (w.find.ID(g.matches[0].replace(vb, wb), b) || [])[0], !b) return c;
                                j && (b = b.parentNode), a = a.slice(f.shift().value.length);
                            }
                            for (e = ob.needsContext.test(a) ? 0 : f.length; e-- && (g = f[e], !w.relative[h = g.type]); ) if ((i = w.find[h]) && (d = i(g.matches[0].replace(vb, wb), tb.test(f[0].type) && k(b.parentNode) || b))) {
                                if (f.splice(e, 1), a = d.length && m(f), !a) return _.apply(c, d), c;
                                break;
                            }
                        }
                        return (j || A(a, l))(d, b, !I, c, tb.test(a) && k(b.parentNode) || b), c;
                    }, v.sortStable = N.split("").sort(U).join("") === N, v.detectDuplicates = !!E, 
                    F(), v.sortDetached = e(function(a) {
                        return 1 & a.compareDocumentPosition(G.createElement("div"));
                    }), e(function(a) {
                        return a.innerHTML = "<a href='#'></a>", "#" === a.firstChild.getAttribute("href");
                    }) || f("type|href|height|width", function(a, b, c) {
                        return c ? void 0 : a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2);
                    }), v.attributes && e(function(a) {
                        return a.innerHTML = "<input/>", a.firstChild.setAttribute("value", ""), "" === a.firstChild.getAttribute("value");
                    }) || f("value", function(a, b, c) {
                        return c || "input" !== a.nodeName.toLowerCase() ? void 0 : a.defaultValue;
                    }), e(function(a) {
                        return null == a.getAttribute("disabled");
                    }) || f(cb, function(a, b, c) {
                        var d;
                        return c ? void 0 : a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null;
                    }), b;
                }(b);
                fb.find = kb, fb.expr = kb.selectors, fb.expr[":"] = fb.expr.pseudos, fb.unique = kb.uniqueSort, 
                fb.text = kb.getText, fb.isXMLDoc = kb.isXML, fb.contains = kb.contains;
                var lb = fb.expr.match.needsContext, mb = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, nb = /^.[^:#\[\.,]*$/;
                fb.filter = function(a, b, c) {
                    var d = b[0];
                    return c && (a = ":not(" + a + ")"), 1 === b.length && 1 === d.nodeType ? fb.find.matchesSelector(d, a) ? [ d ] : [] : fb.find.matches(a, fb.grep(b, function(a) {
                        return 1 === a.nodeType;
                    }));
                }, fb.fn.extend({
                    find: function(a) {
                        var b, c = [], d = this, e = d.length;
                        if ("string" != typeof a) return this.pushStack(fb(a).filter(function() {
                            for (b = 0; e > b; b++) if (fb.contains(d[b], this)) return !0;
                        }));
                        for (b = 0; e > b; b++) fb.find(a, d[b], c);
                        return c = this.pushStack(e > 1 ? fb.unique(c) : c), c.selector = this.selector ? this.selector + " " + a : a, 
                        c;
                    },
                    filter: function(a) {
                        return this.pushStack(e(this, a || [], !1));
                    },
                    not: function(a) {
                        return this.pushStack(e(this, a || [], !0));
                    },
                    is: function(a) {
                        return !!e(this, "string" == typeof a && lb.test(a) ? fb(a) : a || [], !1).length;
                    }
                });
                var ob, pb = b.document, qb = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, rb = fb.fn.init = function(a, b) {
                    var c, d;
                    if (!a) return this;
                    if ("string" == typeof a) {
                        if (c = "<" === a.charAt(0) && ">" === a.charAt(a.length - 1) && a.length >= 3 ? [ null, a, null ] : qb.exec(a), 
                        !c || !c[1] && b) return !b || b.jquery ? (b || ob).find(a) : this.constructor(b).find(a);
                        if (c[1]) {
                            if (b = b instanceof fb ? b[0] : b, fb.merge(this, fb.parseHTML(c[1], b && b.nodeType ? b.ownerDocument || b : pb, !0)), 
                            mb.test(c[1]) && fb.isPlainObject(b)) for (c in b) fb.isFunction(this[c]) ? this[c](b[c]) : this.attr(c, b[c]);
                            return this;
                        }
                        if (d = pb.getElementById(c[2]), d && d.parentNode) {
                            if (d.id !== c[2]) return ob.find(a);
                            this.length = 1, this[0] = d;
                        }
                        return this.context = pb, this.selector = a, this;
                    }
                    return a.nodeType ? (this.context = this[0] = a, this.length = 1, this) : fb.isFunction(a) ? "undefined" != typeof ob.ready ? ob.ready(a) : a(fb) : (void 0 !== a.selector && (this.selector = a.selector, 
                    this.context = a.context), fb.makeArray(a, this));
                };
                rb.prototype = fb.fn, ob = fb(pb);
                var sb = /^(?:parents|prev(?:Until|All))/, tb = {
                    children: !0,
                    contents: !0,
                    next: !0,
                    prev: !0
                };
                fb.extend({
                    dir: function(a, b, c) {
                        for (var d = [], e = a[b]; e && 9 !== e.nodeType && (void 0 === c || 1 !== e.nodeType || !fb(e).is(c)); ) 1 === e.nodeType && d.push(e), 
                        e = e[b];
                        return d;
                    },
                    sibling: function(a, b) {
                        for (var c = []; a; a = a.nextSibling) 1 === a.nodeType && a !== b && c.push(a);
                        return c;
                    }
                }), fb.fn.extend({
                    has: function(a) {
                        var b, c = fb(a, this), d = c.length;
                        return this.filter(function() {
                            for (b = 0; d > b; b++) if (fb.contains(this, c[b])) return !0;
                        });
                    },
                    closest: function(a, b) {
                        for (var c, d = 0, e = this.length, f = [], g = lb.test(a) || "string" != typeof a ? fb(a, b || this.context) : 0; e > d; d++) for (c = this[d]; c && c !== b; c = c.parentNode) if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && fb.find.matchesSelector(c, a))) {
                            f.push(c);
                            break;
                        }
                        return this.pushStack(f.length > 1 ? fb.unique(f) : f);
                    },
                    index: function(a) {
                        return a ? "string" == typeof a ? fb.inArray(this[0], fb(a)) : fb.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
                    },
                    add: function(a, b) {
                        return this.pushStack(fb.unique(fb.merge(this.get(), fb(a, b))));
                    },
                    addBack: function(a) {
                        return this.add(null == a ? this.prevObject : this.prevObject.filter(a));
                    }
                }), fb.each({
                    parent: function(a) {
                        var b = a.parentNode;
                        return b && 11 !== b.nodeType ? b : null;
                    },
                    parents: function(a) {
                        return fb.dir(a, "parentNode");
                    },
                    parentsUntil: function(a, b, c) {
                        return fb.dir(a, "parentNode", c);
                    },
                    next: function(a) {
                        return f(a, "nextSibling");
                    },
                    prev: function(a) {
                        return f(a, "previousSibling");
                    },
                    nextAll: function(a) {
                        return fb.dir(a, "nextSibling");
                    },
                    prevAll: function(a) {
                        return fb.dir(a, "previousSibling");
                    },
                    nextUntil: function(a, b, c) {
                        return fb.dir(a, "nextSibling", c);
                    },
                    prevUntil: function(a, b, c) {
                        return fb.dir(a, "previousSibling", c);
                    },
                    siblings: function(a) {
                        return fb.sibling((a.parentNode || {}).firstChild, a);
                    },
                    children: function(a) {
                        return fb.sibling(a.firstChild);
                    },
                    contents: function(a) {
                        return fb.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : fb.merge([], a.childNodes);
                    }
                }, function(a, b) {
                    fb.fn[a] = function(c, d) {
                        var e = fb.map(this, b, c);
                        return "Until" !== a.slice(-5) && (d = c), d && "string" == typeof d && (e = fb.filter(d, e)), 
                        this.length > 1 && (tb[a] || (e = fb.unique(e)), sb.test(a) && (e = e.reverse())), 
                        this.pushStack(e);
                    };
                });
                var ub = /\S+/g, vb = {};
                fb.Callbacks = function(a) {
                    a = "string" == typeof a ? vb[a] || g(a) : fb.extend({}, a);
                    var b, c, d, e, f, h, i = [], j = !a.once && [], k = function(g) {
                        for (c = a.memory && g, d = !0, f = h || 0, h = 0, e = i.length, b = !0; i && e > f; f++) if (i[f].apply(g[0], g[1]) === !1 && a.stopOnFalse) {
                            c = !1;
                            break;
                        }
                        b = !1, i && (j ? j.length && k(j.shift()) : c ? i = [] : l.disable());
                    }, l = {
                        add: function() {
                            if (i) {
                                var d = i.length;
                                !function f(b) {
                                    fb.each(b, function(b, c) {
                                        var d = fb.type(c);
                                        "function" === d ? a.unique && l.has(c) || i.push(c) : c && c.length && "string" !== d && f(c);
                                    });
                                }(arguments), b ? e = i.length : c && (h = d, k(c));
                            }
                            return this;
                        },
                        remove: function() {
                            return i && fb.each(arguments, function(a, c) {
                                for (var d; (d = fb.inArray(c, i, d)) > -1; ) i.splice(d, 1), b && (e >= d && e--, 
                                f >= d && f--);
                            }), this;
                        },
                        has: function(a) {
                            return a ? fb.inArray(a, i) > -1 : !(!i || !i.length);
                        },
                        empty: function() {
                            return i = [], e = 0, this;
                        },
                        disable: function() {
                            return i = j = c = void 0, this;
                        },
                        disabled: function() {
                            return !i;
                        },
                        lock: function() {
                            return j = void 0, c || l.disable(), this;
                        },
                        locked: function() {
                            return !j;
                        },
                        fireWith: function(a, c) {
                            return !i || d && !j || (c = c || [], c = [ a, c.slice ? c.slice() : c ], b ? j.push(c) : k(c)), 
                            this;
                        },
                        fire: function() {
                            return l.fireWith(this, arguments), this;
                        },
                        fired: function() {
                            return !!d;
                        }
                    };
                    return l;
                }, fb.extend({
                    Deferred: function(a) {
                        var b = [ [ "resolve", "done", fb.Callbacks("once memory"), "resolved" ], [ "reject", "fail", fb.Callbacks("once memory"), "rejected" ], [ "notify", "progress", fb.Callbacks("memory") ] ], c = "pending", d = {
                            state: function() {
                                return c;
                            },
                            always: function() {
                                return e.done(arguments).fail(arguments), this;
                            },
                            then: function() {
                                var a = arguments;
                                return fb.Deferred(function(c) {
                                    fb.each(b, function(b, f) {
                                        var g = fb.isFunction(a[b]) && a[b];
                                        e[f[1]](function() {
                                            var a = g && g.apply(this, arguments);
                                            a && fb.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[f[0] + "With"](this === d ? c.promise() : this, g ? [ a ] : arguments);
                                        });
                                    }), a = null;
                                }).promise();
                            },
                            promise: function(a) {
                                return null != a ? fb.extend(a, d) : d;
                            }
                        }, e = {};
                        return d.pipe = d.then, fb.each(b, function(a, f) {
                            var g = f[2], h = f[3];
                            d[f[1]] = g.add, h && g.add(function() {
                                c = h;
                            }, b[1 ^ a][2].disable, b[2][2].lock), e[f[0]] = function() {
                                return e[f[0] + "With"](this === e ? d : this, arguments), this;
                            }, e[f[0] + "With"] = g.fireWith;
                        }), d.promise(e), a && a.call(e, e), e;
                    },
                    when: function(a) {
                        var b, c, d, e = 0, f = Y.call(arguments), g = f.length, h = 1 !== g || a && fb.isFunction(a.promise) ? g : 0, i = 1 === h ? a : fb.Deferred(), j = function(a, c, d) {
                            return function(e) {
                                c[a] = this, d[a] = arguments.length > 1 ? Y.call(arguments) : e, d === b ? i.notifyWith(c, d) : --h || i.resolveWith(c, d);
                            };
                        };
                        if (g > 1) for (b = new Array(g), c = new Array(g), d = new Array(g); g > e; e++) f[e] && fb.isFunction(f[e].promise) ? f[e].promise().done(j(e, d, f)).fail(i.reject).progress(j(e, c, b)) : --h;
                        return h || i.resolveWith(d, f), i.promise();
                    }
                });
                var wb;
                fb.fn.ready = function(a) {
                    return fb.ready.promise().done(a), this;
                }, fb.extend({
                    isReady: !1,
                    readyWait: 1,
                    holdReady: function(a) {
                        a ? fb.readyWait++ : fb.ready(!0);
                    },
                    ready: function(a) {
                        if (a === !0 ? !--fb.readyWait : !fb.isReady) {
                            if (!pb.body) return setTimeout(fb.ready);
                            fb.isReady = !0, a !== !0 && --fb.readyWait > 0 || (wb.resolveWith(pb, [ fb ]), 
                            fb.fn.triggerHandler && (fb(pb).triggerHandler("ready"), fb(pb).off("ready")));
                        }
                    }
                }), fb.ready.promise = function(a) {
                    if (!wb) if (wb = fb.Deferred(), "complete" === pb.readyState) setTimeout(fb.ready); else if (pb.addEventListener) pb.addEventListener("DOMContentLoaded", i, !1), 
                    b.addEventListener("load", i, !1); else {
                        pb.attachEvent("onreadystatechange", i), b.attachEvent("onload", i);
                        var c = !1;
                        try {
                            c = null == b.frameElement && pb.documentElement;
                        } catch (d) {}
                        c && c.doScroll && !function e() {
                            if (!fb.isReady) {
                                try {
                                    c.doScroll("left");
                                } catch (a) {
                                    return setTimeout(e, 50);
                                }
                                h(), fb.ready();
                            }
                        }();
                    }
                    return wb.promise(a);
                };
                var xb, yb = "undefined";
                for (xb in fb(db)) break;
                db.ownLast = "0" !== xb, db.inlineBlockNeedsLayout = !1, fb(function() {
                    var a, b, c, d;
                    c = pb.getElementsByTagName("body")[0], c && c.style && (b = pb.createElement("div"), 
                    d = pb.createElement("div"), d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", 
                    c.appendChild(d).appendChild(b), typeof b.style.zoom !== yb && (b.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1", 
                    db.inlineBlockNeedsLayout = a = 3 === b.offsetWidth, a && (c.style.zoom = 1)), c.removeChild(d));
                }), function() {
                    var a = pb.createElement("div");
                    if (null == db.deleteExpando) {
                        db.deleteExpando = !0;
                        try {
                            delete a.test;
                        } catch (b) {
                            db.deleteExpando = !1;
                        }
                    }
                    a = null;
                }(), fb.acceptData = function(a) {
                    var b = fb.noData[(a.nodeName + " ").toLowerCase()], c = +a.nodeType || 1;
                    return 1 !== c && 9 !== c ? !1 : !b || b !== !0 && a.getAttribute("classid") === b;
                };
                var zb = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, Ab = /([A-Z])/g;
                fb.extend({
                    cache: {},
                    noData: {
                        "applet ": !0,
                        "embed ": !0,
                        "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
                    },
                    hasData: function(a) {
                        return a = a.nodeType ? fb.cache[a[fb.expando]] : a[fb.expando], !!a && !k(a);
                    },
                    data: function(a, b, c) {
                        return l(a, b, c);
                    },
                    removeData: function(a, b) {
                        return m(a, b);
                    },
                    _data: function(a, b, c) {
                        return l(a, b, c, !0);
                    },
                    _removeData: function(a, b) {
                        return m(a, b, !0);
                    }
                }), fb.fn.extend({
                    data: function(a, b) {
                        var c, d, e, f = this[0], g = f && f.attributes;
                        if (void 0 === a) {
                            if (this.length && (e = fb.data(f), 1 === f.nodeType && !fb._data(f, "parsedAttrs"))) {
                                for (c = g.length; c--; ) g[c] && (d = g[c].name, 0 === d.indexOf("data-") && (d = fb.camelCase(d.slice(5)), 
                                j(f, d, e[d])));
                                fb._data(f, "parsedAttrs", !0);
                            }
                            return e;
                        }
                        return "object" == typeof a ? this.each(function() {
                            fb.data(this, a);
                        }) : arguments.length > 1 ? this.each(function() {
                            fb.data(this, a, b);
                        }) : f ? j(f, a, fb.data(f, a)) : void 0;
                    },
                    removeData: function(a) {
                        return this.each(function() {
                            fb.removeData(this, a);
                        });
                    }
                }), fb.extend({
                    queue: function(a, b, c) {
                        var d;
                        return a ? (b = (b || "fx") + "queue", d = fb._data(a, b), c && (!d || fb.isArray(c) ? d = fb._data(a, b, fb.makeArray(c)) : d.push(c)), 
                        d || []) : void 0;
                    },
                    dequeue: function(a, b) {
                        b = b || "fx";
                        var c = fb.queue(a, b), d = c.length, e = c.shift(), f = fb._queueHooks(a, b), g = function() {
                            fb.dequeue(a, b);
                        };
                        "inprogress" === e && (e = c.shift(), d--), e && ("fx" === b && c.unshift("inprogress"), 
                        delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire();
                    },
                    _queueHooks: function(a, b) {
                        var c = b + "queueHooks";
                        return fb._data(a, c) || fb._data(a, c, {
                            empty: fb.Callbacks("once memory").add(function() {
                                fb._removeData(a, b + "queue"), fb._removeData(a, c);
                            })
                        });
                    }
                }), fb.fn.extend({
                    queue: function(a, b) {
                        var c = 2;
                        return "string" != typeof a && (b = a, a = "fx", c--), arguments.length < c ? fb.queue(this[0], a) : void 0 === b ? this : this.each(function() {
                            var c = fb.queue(this, a, b);
                            fb._queueHooks(this, a), "fx" === a && "inprogress" !== c[0] && fb.dequeue(this, a);
                        });
                    },
                    dequeue: function(a) {
                        return this.each(function() {
                            fb.dequeue(this, a);
                        });
                    },
                    clearQueue: function(a) {
                        return this.queue(a || "fx", []);
                    },
                    promise: function(a, b) {
                        var c, d = 1, e = fb.Deferred(), f = this, g = this.length, h = function() {
                            --d || e.resolveWith(f, [ f ]);
                        };
                        for ("string" != typeof a && (b = a, a = void 0), a = a || "fx"; g--; ) c = fb._data(f[g], a + "queueHooks"), 
                        c && c.empty && (d++, c.empty.add(h));
                        return h(), e.promise(b);
                    }
                });
                var Bb = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, Cb = [ "Top", "Right", "Bottom", "Left" ], Db = function(a, b) {
                    return a = b || a, "none" === fb.css(a, "display") || !fb.contains(a.ownerDocument, a);
                }, Eb = fb.access = function(a, b, c, d, e, f, g) {
                    var h = 0, i = a.length, j = null == c;
                    if ("object" === fb.type(c)) {
                        e = !0;
                        for (h in c) fb.access(a, b, h, c[h], !0, f, g);
                    } else if (void 0 !== d && (e = !0, fb.isFunction(d) || (g = !0), j && (g ? (b.call(a, d), 
                    b = null) : (j = b, b = function(a, b, c) {
                        return j.call(fb(a), c);
                    })), b)) for (;i > h; h++) b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)));
                    return e ? a : j ? b.call(a) : i ? b(a[0], c) : f;
                }, Fb = /^(?:checkbox|radio)$/i;
                !function() {
                    var a = pb.createElement("input"), b = pb.createElement("div"), c = pb.createDocumentFragment();
                    if (b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", 
                    db.leadingWhitespace = 3 === b.firstChild.nodeType, db.tbody = !b.getElementsByTagName("tbody").length, 
                    db.htmlSerialize = !!b.getElementsByTagName("link").length, db.html5Clone = "<:nav></:nav>" !== pb.createElement("nav").cloneNode(!0).outerHTML, 
                    a.type = "checkbox", a.checked = !0, c.appendChild(a), db.appendChecked = a.checked, 
                    b.innerHTML = "<textarea>x</textarea>", db.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue, 
                    c.appendChild(b), b.innerHTML = "<input type='radio' checked='checked' name='t'/>", 
                    db.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked, db.noCloneEvent = !0, 
                    b.attachEvent && (b.attachEvent("onclick", function() {
                        db.noCloneEvent = !1;
                    }), b.cloneNode(!0).click()), null == db.deleteExpando) {
                        db.deleteExpando = !0;
                        try {
                            delete b.test;
                        } catch (d) {
                            db.deleteExpando = !1;
                        }
                    }
                }(), function() {
                    var a, c, d = pb.createElement("div");
                    for (a in {
                        submit: !0,
                        change: !0,
                        focusin: !0
                    }) c = "on" + a, (db[a + "Bubbles"] = c in b) || (d.setAttribute(c, "t"), db[a + "Bubbles"] = d.attributes[c].expando === !1);
                    d = null;
                }();
                var Gb = /^(?:input|select|textarea)$/i, Hb = /^key/, Ib = /^(?:mouse|pointer|contextmenu)|click/, Jb = /^(?:focusinfocus|focusoutblur)$/, Kb = /^([^.]*)(?:\.(.+)|)$/;
                fb.event = {
                    global: {},
                    add: function(a, b, c, d, e) {
                        var f, g, h, i, j, k, l, m, n, o, p, q = fb._data(a);
                        if (q) {
                            for (c.handler && (i = c, c = i.handler, e = i.selector), c.guid || (c.guid = fb.guid++), 
                            (g = q.events) || (g = q.events = {}), (k = q.handle) || (k = q.handle = function(a) {
                                return typeof fb === yb || a && fb.event.triggered === a.type ? void 0 : fb.event.dispatch.apply(k.elem, arguments);
                            }, k.elem = a), b = (b || "").match(ub) || [ "" ], h = b.length; h--; ) f = Kb.exec(b[h]) || [], 
                            n = p = f[1], o = (f[2] || "").split(".").sort(), n && (j = fb.event.special[n] || {}, 
                            n = (e ? j.delegateType : j.bindType) || n, j = fb.event.special[n] || {}, l = fb.extend({
                                type: n,
                                origType: p,
                                data: d,
                                handler: c,
                                guid: c.guid,
                                selector: e,
                                needsContext: e && fb.expr.match.needsContext.test(e),
                                namespace: o.join(".")
                            }, i), (m = g[n]) || (m = g[n] = [], m.delegateCount = 0, j.setup && j.setup.call(a, d, o, k) !== !1 || (a.addEventListener ? a.addEventListener(n, k, !1) : a.attachEvent && a.attachEvent("on" + n, k))), 
                            j.add && (j.add.call(a, l), l.handler.guid || (l.handler.guid = c.guid)), e ? m.splice(m.delegateCount++, 0, l) : m.push(l), 
                            fb.event.global[n] = !0);
                            a = null;
                        }
                    },
                    remove: function(a, b, c, d, e) {
                        var f, g, h, i, j, k, l, m, n, o, p, q = fb.hasData(a) && fb._data(a);
                        if (q && (k = q.events)) {
                            for (b = (b || "").match(ub) || [ "" ], j = b.length; j--; ) if (h = Kb.exec(b[j]) || [], 
                            n = p = h[1], o = (h[2] || "").split(".").sort(), n) {
                                for (l = fb.event.special[n] || {}, n = (d ? l.delegateType : l.bindType) || n, 
                                m = k[n] || [], h = h[2] && new RegExp("(^|\\.)" + o.join("\\.(?:.*\\.|)") + "(\\.|$)"), 
                                i = f = m.length; f--; ) g = m[f], !e && p !== g.origType || c && c.guid !== g.guid || h && !h.test(g.namespace) || d && d !== g.selector && ("**" !== d || !g.selector) || (m.splice(f, 1), 
                                g.selector && m.delegateCount--, l.remove && l.remove.call(a, g));
                                i && !m.length && (l.teardown && l.teardown.call(a, o, q.handle) !== !1 || fb.removeEvent(a, n, q.handle), 
                                delete k[n]);
                            } else for (n in k) fb.event.remove(a, n + b[j], c, d, !0);
                            fb.isEmptyObject(k) && (delete q.handle, fb._removeData(a, "events"));
                        }
                    },
                    trigger: function(a, c, d, e) {
                        var f, g, h, i, j, k, l, m = [ d || pb ], n = cb.call(a, "type") ? a.type : a, o = cb.call(a, "namespace") ? a.namespace.split(".") : [];
                        if (h = k = d = d || pb, 3 !== d.nodeType && 8 !== d.nodeType && !Jb.test(n + fb.event.triggered) && (n.indexOf(".") >= 0 && (o = n.split("."), 
                        n = o.shift(), o.sort()), g = n.indexOf(":") < 0 && "on" + n, a = a[fb.expando] ? a : new fb.Event(n, "object" == typeof a && a), 
                        a.isTrigger = e ? 2 : 3, a.namespace = o.join("."), a.namespace_re = a.namespace ? new RegExp("(^|\\.)" + o.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, 
                        a.result = void 0, a.target || (a.target = d), c = null == c ? [ a ] : fb.makeArray(c, [ a ]), 
                        j = fb.event.special[n] || {}, e || !j.trigger || j.trigger.apply(d, c) !== !1)) {
                            if (!e && !j.noBubble && !fb.isWindow(d)) {
                                for (i = j.delegateType || n, Jb.test(i + n) || (h = h.parentNode); h; h = h.parentNode) m.push(h), 
                                k = h;
                                k === (d.ownerDocument || pb) && m.push(k.defaultView || k.parentWindow || b);
                            }
                            for (l = 0; (h = m[l++]) && !a.isPropagationStopped(); ) a.type = l > 1 ? i : j.bindType || n, 
                            f = (fb._data(h, "events") || {})[a.type] && fb._data(h, "handle"), f && f.apply(h, c), 
                            f = g && h[g], f && f.apply && fb.acceptData(h) && (a.result = f.apply(h, c), a.result === !1 && a.preventDefault());
                            if (a.type = n, !e && !a.isDefaultPrevented() && (!j._default || j._default.apply(m.pop(), c) === !1) && fb.acceptData(d) && g && d[n] && !fb.isWindow(d)) {
                                k = d[g], k && (d[g] = null), fb.event.triggered = n;
                                try {
                                    d[n]();
                                } catch (p) {}
                                fb.event.triggered = void 0, k && (d[g] = k);
                            }
                            return a.result;
                        }
                    },
                    dispatch: function(a) {
                        a = fb.event.fix(a);
                        var b, c, d, e, f, g = [], h = Y.call(arguments), i = (fb._data(this, "events") || {})[a.type] || [], j = fb.event.special[a.type] || {};
                        if (h[0] = a, a.delegateTarget = this, !j.preDispatch || j.preDispatch.call(this, a) !== !1) {
                            for (g = fb.event.handlers.call(this, a, i), b = 0; (e = g[b++]) && !a.isPropagationStopped(); ) for (a.currentTarget = e.elem, 
                            f = 0; (d = e.handlers[f++]) && !a.isImmediatePropagationStopped(); ) (!a.namespace_re || a.namespace_re.test(d.namespace)) && (a.handleObj = d, 
                            a.data = d.data, c = ((fb.event.special[d.origType] || {}).handle || d.handler).apply(e.elem, h), 
                            void 0 !== c && (a.result = c) === !1 && (a.preventDefault(), a.stopPropagation()));
                            return j.postDispatch && j.postDispatch.call(this, a), a.result;
                        }
                    },
                    handlers: function(a, b) {
                        var c, d, e, f, g = [], h = b.delegateCount, i = a.target;
                        if (h && i.nodeType && (!a.button || "click" !== a.type)) for (;i != this; i = i.parentNode || this) if (1 === i.nodeType && (i.disabled !== !0 || "click" !== a.type)) {
                            for (e = [], f = 0; h > f; f++) d = b[f], c = d.selector + " ", void 0 === e[c] && (e[c] = d.needsContext ? fb(c, this).index(i) >= 0 : fb.find(c, this, null, [ i ]).length), 
                            e[c] && e.push(d);
                            e.length && g.push({
                                elem: i,
                                handlers: e
                            });
                        }
                        return h < b.length && g.push({
                            elem: this,
                            handlers: b.slice(h)
                        }), g;
                    },
                    fix: function(a) {
                        if (a[fb.expando]) return a;
                        var b, c, d, e = a.type, f = a, g = this.fixHooks[e];
                        for (g || (this.fixHooks[e] = g = Ib.test(e) ? this.mouseHooks : Hb.test(e) ? this.keyHooks : {}), 
                        d = g.props ? this.props.concat(g.props) : this.props, a = new fb.Event(f), b = d.length; b--; ) c = d[b], 
                        a[c] = f[c];
                        return a.target || (a.target = f.srcElement || pb), 3 === a.target.nodeType && (a.target = a.target.parentNode), 
                        a.metaKey = !!a.metaKey, g.filter ? g.filter(a, f) : a;
                    },
                    props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
                    fixHooks: {},
                    keyHooks: {
                        props: "char charCode key keyCode".split(" "),
                        filter: function(a, b) {
                            return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode), 
                            a;
                        }
                    },
                    mouseHooks: {
                        props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                        filter: function(a, b) {
                            var c, d, e, f = b.button, g = b.fromElement;
                            return null == a.pageX && null != b.clientX && (d = a.target.ownerDocument || pb, 
                            e = d.documentElement, c = d.body, a.pageX = b.clientX + (e && e.scrollLeft || c && c.scrollLeft || 0) - (e && e.clientLeft || c && c.clientLeft || 0), 
                            a.pageY = b.clientY + (e && e.scrollTop || c && c.scrollTop || 0) - (e && e.clientTop || c && c.clientTop || 0)), 
                            !a.relatedTarget && g && (a.relatedTarget = g === a.target ? b.toElement : g), a.which || void 0 === f || (a.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0), 
                            a;
                        }
                    },
                    special: {
                        load: {
                            noBubble: !0
                        },
                        focus: {
                            trigger: function() {
                                if (this !== p() && this.focus) try {
                                    return this.focus(), !1;
                                } catch (a) {}
                            },
                            delegateType: "focusin"
                        },
                        blur: {
                            trigger: function() {
                                return this === p() && this.blur ? (this.blur(), !1) : void 0;
                            },
                            delegateType: "focusout"
                        },
                        click: {
                            trigger: function() {
                                return fb.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), 
                                !1) : void 0;
                            },
                            _default: function(a) {
                                return fb.nodeName(a.target, "a");
                            }
                        },
                        beforeunload: {
                            postDispatch: function(a) {
                                void 0 !== a.result && a.originalEvent && (a.originalEvent.returnValue = a.result);
                            }
                        }
                    },
                    simulate: function(a, b, c, d) {
                        var e = fb.extend(new fb.Event(), c, {
                            type: a,
                            isSimulated: !0,
                            originalEvent: {}
                        });
                        d ? fb.event.trigger(e, null, b) : fb.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault();
                    }
                }, fb.removeEvent = pb.removeEventListener ? function(a, b, c) {
                    a.removeEventListener && a.removeEventListener(b, c, !1);
                } : function(a, b, c) {
                    var d = "on" + b;
                    a.detachEvent && (typeof a[d] === yb && (a[d] = null), a.detachEvent(d, c));
                }, fb.Event = function(a, b) {
                    return this instanceof fb.Event ? (a && a.type ? (this.originalEvent = a, this.type = a.type, 
                    this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented && a.returnValue === !1 ? n : o) : this.type = a, 
                    b && fb.extend(this, b), this.timeStamp = a && a.timeStamp || fb.now(), void (this[fb.expando] = !0)) : new fb.Event(a, b);
                }, fb.Event.prototype = {
                    isDefaultPrevented: o,
                    isPropagationStopped: o,
                    isImmediatePropagationStopped: o,
                    preventDefault: function() {
                        var a = this.originalEvent;
                        this.isDefaultPrevented = n, a && (a.preventDefault ? a.preventDefault() : a.returnValue = !1);
                    },
                    stopPropagation: function() {
                        var a = this.originalEvent;
                        this.isPropagationStopped = n, a && (a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0);
                    },
                    stopImmediatePropagation: function() {
                        var a = this.originalEvent;
                        this.isImmediatePropagationStopped = n, a && a.stopImmediatePropagation && a.stopImmediatePropagation(), 
                        this.stopPropagation();
                    }
                }, fb.each({
                    mouseenter: "mouseover",
                    mouseleave: "mouseout",
                    pointerenter: "pointerover",
                    pointerleave: "pointerout"
                }, function(a, b) {
                    fb.event.special[a] = {
                        delegateType: b,
                        bindType: b,
                        handle: function(a) {
                            var c, d = this, e = a.relatedTarget, f = a.handleObj;
                            return (!e || e !== d && !fb.contains(d, e)) && (a.type = f.origType, c = f.handler.apply(this, arguments), 
                            a.type = b), c;
                        }
                    };
                }), db.submitBubbles || (fb.event.special.submit = {
                    setup: function() {
                        return fb.nodeName(this, "form") ? !1 : void fb.event.add(this, "click._submit keypress._submit", function(a) {
                            var b = a.target, c = fb.nodeName(b, "input") || fb.nodeName(b, "button") ? b.form : void 0;
                            c && !fb._data(c, "submitBubbles") && (fb.event.add(c, "submit._submit", function(a) {
                                a._submit_bubble = !0;
                            }), fb._data(c, "submitBubbles", !0));
                        });
                    },
                    postDispatch: function(a) {
                        a._submit_bubble && (delete a._submit_bubble, this.parentNode && !a.isTrigger && fb.event.simulate("submit", this.parentNode, a, !0));
                    },
                    teardown: function() {
                        return fb.nodeName(this, "form") ? !1 : void fb.event.remove(this, "._submit");
                    }
                }), db.changeBubbles || (fb.event.special.change = {
                    setup: function() {
                        return Gb.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (fb.event.add(this, "propertychange._change", function(a) {
                            "checked" === a.originalEvent.propertyName && (this._just_changed = !0);
                        }), fb.event.add(this, "click._change", function(a) {
                            this._just_changed && !a.isTrigger && (this._just_changed = !1), fb.event.simulate("change", this, a, !0);
                        })), !1) : void fb.event.add(this, "beforeactivate._change", function(a) {
                            var b = a.target;
                            Gb.test(b.nodeName) && !fb._data(b, "changeBubbles") && (fb.event.add(b, "change._change", function(a) {
                                !this.parentNode || a.isSimulated || a.isTrigger || fb.event.simulate("change", this.parentNode, a, !0);
                            }), fb._data(b, "changeBubbles", !0));
                        });
                    },
                    handle: function(a) {
                        var b = a.target;
                        return this !== b || a.isSimulated || a.isTrigger || "radio" !== b.type && "checkbox" !== b.type ? a.handleObj.handler.apply(this, arguments) : void 0;
                    },
                    teardown: function() {
                        return fb.event.remove(this, "._change"), !Gb.test(this.nodeName);
                    }
                }), db.focusinBubbles || fb.each({
                    focus: "focusin",
                    blur: "focusout"
                }, function(a, b) {
                    var c = function(a) {
                        fb.event.simulate(b, a.target, fb.event.fix(a), !0);
                    };
                    fb.event.special[b] = {
                        setup: function() {
                            var d = this.ownerDocument || this, e = fb._data(d, b);
                            e || d.addEventListener(a, c, !0), fb._data(d, b, (e || 0) + 1);
                        },
                        teardown: function() {
                            var d = this.ownerDocument || this, e = fb._data(d, b) - 1;
                            e ? fb._data(d, b, e) : (d.removeEventListener(a, c, !0), fb._removeData(d, b));
                        }
                    };
                }), fb.fn.extend({
                    on: function(a, b, c, d, e) {
                        var f, g;
                        if ("object" == typeof a) {
                            "string" != typeof b && (c = c || b, b = void 0);
                            for (f in a) this.on(f, b, c, a[f], e);
                            return this;
                        }
                        if (null == c && null == d ? (d = b, c = b = void 0) : null == d && ("string" == typeof b ? (d = c, 
                        c = void 0) : (d = c, c = b, b = void 0)), d === !1) d = o; else if (!d) return this;
                        return 1 === e && (g = d, d = function(a) {
                            return fb().off(a), g.apply(this, arguments);
                        }, d.guid = g.guid || (g.guid = fb.guid++)), this.each(function() {
                            fb.event.add(this, a, d, c, b);
                        });
                    },
                    one: function(a, b, c, d) {
                        return this.on(a, b, c, d, 1);
                    },
                    off: function(a, b, c) {
                        var d, e;
                        if (a && a.preventDefault && a.handleObj) return d = a.handleObj, fb(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler), 
                        this;
                        if ("object" == typeof a) {
                            for (e in a) this.off(e, b, a[e]);
                            return this;
                        }
                        return (b === !1 || "function" == typeof b) && (c = b, b = void 0), c === !1 && (c = o), 
                        this.each(function() {
                            fb.event.remove(this, a, c, b);
                        });
                    },
                    trigger: function(a, b) {
                        return this.each(function() {
                            fb.event.trigger(a, b, this);
                        });
                    },
                    triggerHandler: function(a, b) {
                        var c = this[0];
                        return c ? fb.event.trigger(a, b, c, !0) : void 0;
                    }
                });
                var Lb = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", Mb = / jQuery\d+="(?:null|\d+)"/g, Nb = new RegExp("<(?:" + Lb + ")[\\s/>]", "i"), Ob = /^\s+/, Pb = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, Qb = /<([\w:]+)/, Rb = /<tbody/i, Sb = /<|&#?\w+;/, Tb = /<(?:script|style|link)/i, Ub = /checked\s*(?:[^=]|=\s*.checked.)/i, Vb = /^$|\/(?:java|ecma)script/i, Wb = /^true\/(.*)/, Xb = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, Yb = {
                    option: [ 1, "<select multiple='multiple'>", "</select>" ],
                    legend: [ 1, "<fieldset>", "</fieldset>" ],
                    area: [ 1, "<map>", "</map>" ],
                    param: [ 1, "<object>", "</object>" ],
                    thead: [ 1, "<table>", "</table>" ],
                    tr: [ 2, "<table><tbody>", "</tbody></table>" ],
                    col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
                    td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
                    _default: db.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>" ]
                }, Zb = q(pb), $b = Zb.appendChild(pb.createElement("div"));
                Yb.optgroup = Yb.option, Yb.tbody = Yb.tfoot = Yb.colgroup = Yb.caption = Yb.thead, 
                Yb.th = Yb.td, fb.extend({
                    clone: function(a, b, c) {
                        var d, e, f, g, h, i = fb.contains(a.ownerDocument, a);
                        if (db.html5Clone || fb.isXMLDoc(a) || !Nb.test("<" + a.nodeName + ">") ? f = a.cloneNode(!0) : ($b.innerHTML = a.outerHTML, 
                        $b.removeChild(f = $b.firstChild)), !(db.noCloneEvent && db.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || fb.isXMLDoc(a))) for (d = r(f), 
                        h = r(a), g = 0; null != (e = h[g]); ++g) d[g] && y(e, d[g]);
                        if (b) if (c) for (h = h || r(a), d = d || r(f), g = 0; null != (e = h[g]); g++) x(e, d[g]); else x(a, f);
                        return d = r(f, "script"), d.length > 0 && w(d, !i && r(a, "script")), d = h = e = null, 
                        f;
                    },
                    buildFragment: function(a, b, c, d) {
                        for (var e, f, g, h, i, j, k, l = a.length, m = q(b), n = [], o = 0; l > o; o++) if (f = a[o], 
                        f || 0 === f) if ("object" === fb.type(f)) fb.merge(n, f.nodeType ? [ f ] : f); else if (Sb.test(f)) {
                            for (h = h || m.appendChild(b.createElement("div")), i = (Qb.exec(f) || [ "", "" ])[1].toLowerCase(), 
                            k = Yb[i] || Yb._default, h.innerHTML = k[1] + f.replace(Pb, "<$1></$2>") + k[2], 
                            e = k[0]; e--; ) h = h.lastChild;
                            if (!db.leadingWhitespace && Ob.test(f) && n.push(b.createTextNode(Ob.exec(f)[0])), 
                            !db.tbody) for (f = "table" !== i || Rb.test(f) ? "<table>" !== k[1] || Rb.test(f) ? 0 : h : h.firstChild, 
                            e = f && f.childNodes.length; e--; ) fb.nodeName(j = f.childNodes[e], "tbody") && !j.childNodes.length && f.removeChild(j);
                            for (fb.merge(n, h.childNodes), h.textContent = ""; h.firstChild; ) h.removeChild(h.firstChild);
                            h = m.lastChild;
                        } else n.push(b.createTextNode(f));
                        for (h && m.removeChild(h), db.appendChecked || fb.grep(r(n, "input"), s), o = 0; f = n[o++]; ) if ((!d || -1 === fb.inArray(f, d)) && (g = fb.contains(f.ownerDocument, f), 
                        h = r(m.appendChild(f), "script"), g && w(h), c)) for (e = 0; f = h[e++]; ) Vb.test(f.type || "") && c.push(f);
                        return h = null, m;
                    },
                    cleanData: function(a, b) {
                        for (var c, d, e, f, g = 0, h = fb.expando, i = fb.cache, j = db.deleteExpando, k = fb.event.special; null != (c = a[g]); g++) if ((b || fb.acceptData(c)) && (e = c[h], 
                        f = e && i[e])) {
                            if (f.events) for (d in f.events) k[d] ? fb.event.remove(c, d) : fb.removeEvent(c, d, f.handle);
                            i[e] && (delete i[e], j ? delete c[h] : typeof c.removeAttribute !== yb ? c.removeAttribute(h) : c[h] = null, 
                            X.push(e));
                        }
                    }
                }), fb.fn.extend({
                    text: function(a) {
                        return Eb(this, function(a) {
                            return void 0 === a ? fb.text(this) : this.empty().append((this[0] && this[0].ownerDocument || pb).createTextNode(a));
                        }, null, a, arguments.length);
                    },
                    append: function() {
                        return this.domManip(arguments, function(a) {
                            if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                                var b = t(this, a);
                                b.appendChild(a);
                            }
                        });
                    },
                    prepend: function() {
                        return this.domManip(arguments, function(a) {
                            if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                                var b = t(this, a);
                                b.insertBefore(a, b.firstChild);
                            }
                        });
                    },
                    before: function() {
                        return this.domManip(arguments, function(a) {
                            this.parentNode && this.parentNode.insertBefore(a, this);
                        });
                    },
                    after: function() {
                        return this.domManip(arguments, function(a) {
                            this.parentNode && this.parentNode.insertBefore(a, this.nextSibling);
                        });
                    },
                    remove: function(a, b) {
                        for (var c, d = a ? fb.filter(a, this) : this, e = 0; null != (c = d[e]); e++) b || 1 !== c.nodeType || fb.cleanData(r(c)), 
                        c.parentNode && (b && fb.contains(c.ownerDocument, c) && w(r(c, "script")), c.parentNode.removeChild(c));
                        return this;
                    },
                    empty: function() {
                        for (var a, b = 0; null != (a = this[b]); b++) {
                            for (1 === a.nodeType && fb.cleanData(r(a, !1)); a.firstChild; ) a.removeChild(a.firstChild);
                            a.options && fb.nodeName(a, "select") && (a.options.length = 0);
                        }
                        return this;
                    },
                    clone: function(a, b) {
                        return a = null == a ? !1 : a, b = null == b ? a : b, this.map(function() {
                            return fb.clone(this, a, b);
                        });
                    },
                    html: function(a) {
                        return Eb(this, function(a) {
                            var b = this[0] || {}, c = 0, d = this.length;
                            if (void 0 === a) return 1 === b.nodeType ? b.innerHTML.replace(Mb, "") : void 0;
                            if (!("string" != typeof a || Tb.test(a) || !db.htmlSerialize && Nb.test(a) || !db.leadingWhitespace && Ob.test(a) || Yb[(Qb.exec(a) || [ "", "" ])[1].toLowerCase()])) {
                                a = a.replace(Pb, "<$1></$2>");
                                try {
                                    for (;d > c; c++) b = this[c] || {}, 1 === b.nodeType && (fb.cleanData(r(b, !1)), 
                                    b.innerHTML = a);
                                    b = 0;
                                } catch (e) {}
                            }
                            b && this.empty().append(a);
                        }, null, a, arguments.length);
                    },
                    replaceWith: function() {
                        var a = arguments[0];
                        return this.domManip(arguments, function(b) {
                            a = this.parentNode, fb.cleanData(r(this)), a && a.replaceChild(b, this);
                        }), a && (a.length || a.nodeType) ? this : this.remove();
                    },
                    detach: function(a) {
                        return this.remove(a, !0);
                    },
                    domManip: function(a, b) {
                        a = Z.apply([], a);
                        var c, d, e, f, g, h, i = 0, j = this.length, k = this, l = j - 1, m = a[0], n = fb.isFunction(m);
                        if (n || j > 1 && "string" == typeof m && !db.checkClone && Ub.test(m)) return this.each(function(c) {
                            var d = k.eq(c);
                            n && (a[0] = m.call(this, c, d.html())), d.domManip(a, b);
                        });
                        if (j && (h = fb.buildFragment(a, this[0].ownerDocument, !1, this), c = h.firstChild, 
                        1 === h.childNodes.length && (h = c), c)) {
                            for (f = fb.map(r(h, "script"), u), e = f.length; j > i; i++) d = h, i !== l && (d = fb.clone(d, !0, !0), 
                            e && fb.merge(f, r(d, "script"))), b.call(this[i], d, i);
                            if (e) for (g = f[f.length - 1].ownerDocument, fb.map(f, v), i = 0; e > i; i++) d = f[i], 
                            Vb.test(d.type || "") && !fb._data(d, "globalEval") && fb.contains(g, d) && (d.src ? fb._evalUrl && fb._evalUrl(d.src) : fb.globalEval((d.text || d.textContent || d.innerHTML || "").replace(Xb, "")));
                            h = c = null;
                        }
                        return this;
                    }
                }), fb.each({
                    appendTo: "append",
                    prependTo: "prepend",
                    insertBefore: "before",
                    insertAfter: "after",
                    replaceAll: "replaceWith"
                }, function(a, b) {
                    fb.fn[a] = function(a) {
                        for (var c, d = 0, e = [], f = fb(a), g = f.length - 1; g >= d; d++) c = d === g ? this : this.clone(!0), 
                        fb(f[d])[b](c), $.apply(e, c.get());
                        return this.pushStack(e);
                    };
                });
                var _b, ac = {};
                !function() {
                    var a;
                    db.shrinkWrapBlocks = function() {
                        if (null != a) return a;
                        a = !1;
                        var b, c, d;
                        return c = pb.getElementsByTagName("body")[0], c && c.style ? (b = pb.createElement("div"), 
                        d = pb.createElement("div"), d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", 
                        c.appendChild(d).appendChild(b), typeof b.style.zoom !== yb && (b.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1", 
                        b.appendChild(pb.createElement("div")).style.width = "5px", a = 3 !== b.offsetWidth), 
                        c.removeChild(d), a) : void 0;
                    };
                }();
                var bc, cc, dc = /^margin/, ec = new RegExp("^(" + Bb + ")(?!px)[a-z%]+$", "i"), fc = /^(top|right|bottom|left)$/;
                b.getComputedStyle ? (bc = function(a) {
                    return a.ownerDocument.defaultView.getComputedStyle(a, null);
                }, cc = function(a, b, c) {
                    var d, e, f, g, h = a.style;
                    return c = c || bc(a), g = c ? c.getPropertyValue(b) || c[b] : void 0, c && ("" !== g || fb.contains(a.ownerDocument, a) || (g = fb.style(a, b)), 
                    ec.test(g) && dc.test(b) && (d = h.width, e = h.minWidth, f = h.maxWidth, h.minWidth = h.maxWidth = h.width = g, 
                    g = c.width, h.width = d, h.minWidth = e, h.maxWidth = f)), void 0 === g ? g : g + "";
                }) : pb.documentElement.currentStyle && (bc = function(a) {
                    return a.currentStyle;
                }, cc = function(a, b, c) {
                    var d, e, f, g, h = a.style;
                    return c = c || bc(a), g = c ? c[b] : void 0, null == g && h && h[b] && (g = h[b]), 
                    ec.test(g) && !fc.test(b) && (d = h.left, e = a.runtimeStyle, f = e && e.left, f && (e.left = a.currentStyle.left), 
                    h.left = "fontSize" === b ? "1em" : g, g = h.pixelLeft + "px", h.left = d, f && (e.left = f)), 
                    void 0 === g ? g : g + "" || "auto";
                }), function() {
                    function a() {
                        var a, c, d, e;
                        c = pb.getElementsByTagName("body")[0], c && c.style && (a = pb.createElement("div"), 
                        d = pb.createElement("div"), d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", 
                        c.appendChild(d).appendChild(a), a.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", 
                        f = g = !1, i = !0, b.getComputedStyle && (f = "1%" !== (b.getComputedStyle(a, null) || {}).top, 
                        g = "4px" === (b.getComputedStyle(a, null) || {
                            width: "4px"
                        }).width, e = a.appendChild(pb.createElement("div")), e.style.cssText = a.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", 
                        e.style.marginRight = e.style.width = "0", a.style.width = "1px", i = !parseFloat((b.getComputedStyle(e, null) || {}).marginRight)), 
                        a.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", e = a.getElementsByTagName("td"), 
                        e[0].style.cssText = "margin:0;border:0;padding:0;display:none", h = 0 === e[0].offsetHeight, 
                        h && (e[0].style.display = "", e[1].style.display = "none", h = 0 === e[0].offsetHeight), 
                        c.removeChild(d));
                    }
                    var c, d, e, f, g, h, i;
                    c = pb.createElement("div"), c.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", 
                    e = c.getElementsByTagName("a")[0], d = e && e.style, d && (d.cssText = "float:left;opacity:.5", 
                    db.opacity = "0.5" === d.opacity, db.cssFloat = !!d.cssFloat, c.style.backgroundClip = "content-box", 
                    c.cloneNode(!0).style.backgroundClip = "", db.clearCloneStyle = "content-box" === c.style.backgroundClip, 
                    db.boxSizing = "" === d.boxSizing || "" === d.MozBoxSizing || "" === d.WebkitBoxSizing, 
                    fb.extend(db, {
                        reliableHiddenOffsets: function() {
                            return null == h && a(), h;
                        },
                        boxSizingReliable: function() {
                            return null == g && a(), g;
                        },
                        pixelPosition: function() {
                            return null == f && a(), f;
                        },
                        reliableMarginRight: function() {
                            return null == i && a(), i;
                        }
                    }));
                }(), fb.swap = function(a, b, c, d) {
                    var e, f, g = {};
                    for (f in b) g[f] = a.style[f], a.style[f] = b[f];
                    e = c.apply(a, d || []);
                    for (f in b) a.style[f] = g[f];
                    return e;
                };
                var gc = /alpha\([^)]*\)/i, hc = /opacity\s*=\s*([^)]*)/, ic = /^(none|table(?!-c[ea]).+)/, jc = new RegExp("^(" + Bb + ")(.*)$", "i"), kc = new RegExp("^([+-])=(" + Bb + ")", "i"), lc = {
                    position: "absolute",
                    visibility: "hidden",
                    display: "block"
                }, mc = {
                    letterSpacing: "0",
                    fontWeight: "400"
                }, nc = [ "Webkit", "O", "Moz", "ms" ];
                fb.extend({
                    cssHooks: {
                        opacity: {
                            get: function(a, b) {
                                if (b) {
                                    var c = cc(a, "opacity");
                                    return "" === c ? "1" : c;
                                }
                            }
                        }
                    },
                    cssNumber: {
                        columnCount: !0,
                        fillOpacity: !0,
                        flexGrow: !0,
                        flexShrink: !0,
                        fontWeight: !0,
                        lineHeight: !0,
                        opacity: !0,
                        order: !0,
                        orphans: !0,
                        widows: !0,
                        zIndex: !0,
                        zoom: !0
                    },
                    cssProps: {
                        "float": db.cssFloat ? "cssFloat" : "styleFloat"
                    },
                    style: function(a, b, c, d) {
                        if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
                            var e, f, g, h = fb.camelCase(b), i = a.style;
                            if (b = fb.cssProps[h] || (fb.cssProps[h] = C(i, h)), g = fb.cssHooks[b] || fb.cssHooks[h], 
                            void 0 === c) return g && "get" in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b];
                            if (f = typeof c, "string" === f && (e = kc.exec(c)) && (c = (e[1] + 1) * e[2] + parseFloat(fb.css(a, b)), 
                            f = "number"), null != c && c === c && ("number" !== f || fb.cssNumber[h] || (c += "px"), 
                            db.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (i[b] = "inherit"), 
                            !(g && "set" in g && void 0 === (c = g.set(a, c, d))))) try {
                                i[b] = c;
                            } catch (j) {}
                        }
                    },
                    css: function(a, b, c, d) {
                        var e, f, g, h = fb.camelCase(b);
                        return b = fb.cssProps[h] || (fb.cssProps[h] = C(a.style, h)), g = fb.cssHooks[b] || fb.cssHooks[h], 
                        g && "get" in g && (f = g.get(a, !0, c)), void 0 === f && (f = cc(a, b, d)), "normal" === f && b in mc && (f = mc[b]), 
                        "" === c || c ? (e = parseFloat(f), c === !0 || fb.isNumeric(e) ? e || 0 : f) : f;
                    }
                }), fb.each([ "height", "width" ], function(a, b) {
                    fb.cssHooks[b] = {
                        get: function(a, c, d) {
                            return c ? ic.test(fb.css(a, "display")) && 0 === a.offsetWidth ? fb.swap(a, lc, function() {
                                return G(a, b, d);
                            }) : G(a, b, d) : void 0;
                        },
                        set: function(a, c, d) {
                            var e = d && bc(a);
                            return E(a, c, d ? F(a, b, d, db.boxSizing && "border-box" === fb.css(a, "boxSizing", !1, e), e) : 0);
                        }
                    };
                }), db.opacity || (fb.cssHooks.opacity = {
                    get: function(a, b) {
                        return hc.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : b ? "1" : "";
                    },
                    set: function(a, b) {
                        var c = a.style, d = a.currentStyle, e = fb.isNumeric(b) ? "alpha(opacity=" + 100 * b + ")" : "", f = d && d.filter || c.filter || "";
                        c.zoom = 1, (b >= 1 || "" === b) && "" === fb.trim(f.replace(gc, "")) && c.removeAttribute && (c.removeAttribute("filter"), 
                        "" === b || d && !d.filter) || (c.filter = gc.test(f) ? f.replace(gc, e) : f + " " + e);
                    }
                }), fb.cssHooks.marginRight = B(db.reliableMarginRight, function(a, b) {
                    return b ? fb.swap(a, {
                        display: "inline-block"
                    }, cc, [ a, "marginRight" ]) : void 0;
                }), fb.each({
                    margin: "",
                    padding: "",
                    border: "Width"
                }, function(a, b) {
                    fb.cssHooks[a + b] = {
                        expand: function(c) {
                            for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [ c ]; 4 > d; d++) e[a + Cb[d] + b] = f[d] || f[d - 2] || f[0];
                            return e;
                        }
                    }, dc.test(a) || (fb.cssHooks[a + b].set = E);
                }), fb.fn.extend({
                    css: function(a, b) {
                        return Eb(this, function(a, b, c) {
                            var d, e, f = {}, g = 0;
                            if (fb.isArray(b)) {
                                for (d = bc(a), e = b.length; e > g; g++) f[b[g]] = fb.css(a, b[g], !1, d);
                                return f;
                            }
                            return void 0 !== c ? fb.style(a, b, c) : fb.css(a, b);
                        }, a, b, arguments.length > 1);
                    },
                    show: function() {
                        return D(this, !0);
                    },
                    hide: function() {
                        return D(this);
                    },
                    toggle: function(a) {
                        return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function() {
                            Db(this) ? fb(this).show() : fb(this).hide();
                        });
                    }
                }), fb.Tween = H, H.prototype = {
                    constructor: H,
                    init: function(a, b, c, d, e, f) {
                        this.elem = a, this.prop = c, this.easing = e || "swing", this.options = b, this.start = this.now = this.cur(), 
                        this.end = d, this.unit = f || (fb.cssNumber[c] ? "" : "px");
                    },
                    cur: function() {
                        var a = H.propHooks[this.prop];
                        return a && a.get ? a.get(this) : H.propHooks._default.get(this);
                    },
                    run: function(a) {
                        var b, c = H.propHooks[this.prop];
                        return this.pos = b = this.options.duration ? fb.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : a, 
                        this.now = (this.end - this.start) * b + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), 
                        c && c.set ? c.set(this) : H.propHooks._default.set(this), this;
                    }
                }, H.prototype.init.prototype = H.prototype, H.propHooks = {
                    _default: {
                        get: function(a) {
                            var b;
                            return null == a.elem[a.prop] || a.elem.style && null != a.elem.style[a.prop] ? (b = fb.css(a.elem, a.prop, ""), 
                            b && "auto" !== b ? b : 0) : a.elem[a.prop];
                        },
                        set: function(a) {
                            fb.fx.step[a.prop] ? fb.fx.step[a.prop](a) : a.elem.style && (null != a.elem.style[fb.cssProps[a.prop]] || fb.cssHooks[a.prop]) ? fb.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now;
                        }
                    }
                }, H.propHooks.scrollTop = H.propHooks.scrollLeft = {
                    set: function(a) {
                        a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now);
                    }
                }, fb.easing = {
                    linear: function(a) {
                        return a;
                    },
                    swing: function(a) {
                        return .5 - Math.cos(a * Math.PI) / 2;
                    }
                }, fb.fx = H.prototype.init, fb.fx.step = {};
                var oc, pc, qc = /^(?:toggle|show|hide)$/, rc = new RegExp("^(?:([+-])=|)(" + Bb + ")([a-z%]*)$", "i"), sc = /queueHooks$/, tc = [ L ], uc = {
                    "*": [ function(a, b) {
                        var c = this.createTween(a, b), d = c.cur(), e = rc.exec(b), f = e && e[3] || (fb.cssNumber[a] ? "" : "px"), g = (fb.cssNumber[a] || "px" !== f && +d) && rc.exec(fb.css(c.elem, a)), h = 1, i = 20;
                        if (g && g[3] !== f) {
                            f = f || g[3], e = e || [], g = +d || 1;
                            do h = h || ".5", g /= h, fb.style(c.elem, a, g + f); while (h !== (h = c.cur() / d) && 1 !== h && --i);
                        }
                        return e && (g = c.start = +g || +d || 0, c.unit = f, c.end = e[1] ? g + (e[1] + 1) * e[2] : +e[2]), 
                        c;
                    } ]
                };
                fb.Animation = fb.extend(N, {
                    tweener: function(a, b) {
                        fb.isFunction(a) ? (b = a, a = [ "*" ]) : a = a.split(" ");
                        for (var c, d = 0, e = a.length; e > d; d++) c = a[d], uc[c] = uc[c] || [], uc[c].unshift(b);
                    },
                    prefilter: function(a, b) {
                        b ? tc.unshift(a) : tc.push(a);
                    }
                }), fb.speed = function(a, b, c) {
                    var d = a && "object" == typeof a ? fb.extend({}, a) : {
                        complete: c || !c && b || fb.isFunction(a) && a,
                        duration: a,
                        easing: c && b || b && !fb.isFunction(b) && b
                    };
                    return d.duration = fb.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in fb.fx.speeds ? fb.fx.speeds[d.duration] : fb.fx.speeds._default, 
                    (null == d.queue || d.queue === !0) && (d.queue = "fx"), d.old = d.complete, d.complete = function() {
                        fb.isFunction(d.old) && d.old.call(this), d.queue && fb.dequeue(this, d.queue);
                    }, d;
                }, fb.fn.extend({
                    fadeTo: function(a, b, c, d) {
                        return this.filter(Db).css("opacity", 0).show().end().animate({
                            opacity: b
                        }, a, c, d);
                    },
                    animate: function(a, b, c, d) {
                        var e = fb.isEmptyObject(a), f = fb.speed(b, c, d), g = function() {
                            var b = N(this, fb.extend({}, a), f);
                            (e || fb._data(this, "finish")) && b.stop(!0);
                        };
                        return g.finish = g, e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g);
                    },
                    stop: function(a, b, c) {
                        var d = function(a) {
                            var b = a.stop;
                            delete a.stop, b(c);
                        };
                        return "string" != typeof a && (c = b, b = a, a = void 0), b && a !== !1 && this.queue(a || "fx", []), 
                        this.each(function() {
                            var b = !0, e = null != a && a + "queueHooks", f = fb.timers, g = fb._data(this);
                            if (e) g[e] && g[e].stop && d(g[e]); else for (e in g) g[e] && g[e].stop && sc.test(e) && d(g[e]);
                            for (e = f.length; e--; ) f[e].elem !== this || null != a && f[e].queue !== a || (f[e].anim.stop(c), 
                            b = !1, f.splice(e, 1));
                            (b || !c) && fb.dequeue(this, a);
                        });
                    },
                    finish: function(a) {
                        return a !== !1 && (a = a || "fx"), this.each(function() {
                            var b, c = fb._data(this), d = c[a + "queue"], e = c[a + "queueHooks"], f = fb.timers, g = d ? d.length : 0;
                            for (c.finish = !0, fb.queue(this, a, []), e && e.stop && e.stop.call(this, !0), 
                            b = f.length; b--; ) f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0), 
                            f.splice(b, 1));
                            for (b = 0; g > b; b++) d[b] && d[b].finish && d[b].finish.call(this);
                            delete c.finish;
                        });
                    }
                }), fb.each([ "toggle", "show", "hide" ], function(a, b) {
                    var c = fb.fn[b];
                    fb.fn[b] = function(a, d, e) {
                        return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(J(b, !0), a, d, e);
                    };
                }), fb.each({
                    slideDown: J("show"),
                    slideUp: J("hide"),
                    slideToggle: J("toggle"),
                    fadeIn: {
                        opacity: "show"
                    },
                    fadeOut: {
                        opacity: "hide"
                    },
                    fadeToggle: {
                        opacity: "toggle"
                    }
                }, function(a, b) {
                    fb.fn[a] = function(a, c, d) {
                        return this.animate(b, a, c, d);
                    };
                }), fb.timers = [], fb.fx.tick = function() {
                    var a, b = fb.timers, c = 0;
                    for (oc = fb.now(); c < b.length; c++) a = b[c], a() || b[c] !== a || b.splice(c--, 1);
                    b.length || fb.fx.stop(), oc = void 0;
                }, fb.fx.timer = function(a) {
                    fb.timers.push(a), a() ? fb.fx.start() : fb.timers.pop();
                }, fb.fx.interval = 13, fb.fx.start = function() {
                    pc || (pc = setInterval(fb.fx.tick, fb.fx.interval));
                }, fb.fx.stop = function() {
                    clearInterval(pc), pc = null;
                }, fb.fx.speeds = {
                    slow: 600,
                    fast: 200,
                    _default: 400
                }, fb.fn.delay = function(a, b) {
                    return a = fb.fx ? fb.fx.speeds[a] || a : a, b = b || "fx", this.queue(b, function(b, c) {
                        var d = setTimeout(b, a);
                        c.stop = function() {
                            clearTimeout(d);
                        };
                    });
                }, function() {
                    var a, b, c, d, e;
                    b = pb.createElement("div"), b.setAttribute("className", "t"), b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", 
                    d = b.getElementsByTagName("a")[0], c = pb.createElement("select"), e = c.appendChild(pb.createElement("option")), 
                    a = b.getElementsByTagName("input")[0], d.style.cssText = "top:1px", db.getSetAttribute = "t" !== b.className, 
                    db.style = /top/.test(d.getAttribute("style")), db.hrefNormalized = "/a" === d.getAttribute("href"), 
                    db.checkOn = !!a.value, db.optSelected = e.selected, db.enctype = !!pb.createElement("form").enctype, 
                    c.disabled = !0, db.optDisabled = !e.disabled, a = pb.createElement("input"), a.setAttribute("value", ""), 
                    db.input = "" === a.getAttribute("value"), a.value = "t", a.setAttribute("type", "radio"), 
                    db.radioValue = "t" === a.value;
                }();
                var vc = /\r/g;
                fb.fn.extend({
                    val: function(a) {
                        var b, c, d, e = this[0];
                        {
                            if (arguments.length) return d = fb.isFunction(a), this.each(function(c) {
                                var e;
                                1 === this.nodeType && (e = d ? a.call(this, c, fb(this).val()) : a, null == e ? e = "" : "number" == typeof e ? e += "" : fb.isArray(e) && (e = fb.map(e, function(a) {
                                    return null == a ? "" : a + "";
                                })), b = fb.valHooks[this.type] || fb.valHooks[this.nodeName.toLowerCase()], b && "set" in b && void 0 !== b.set(this, e, "value") || (this.value = e));
                            });
                            if (e) return b = fb.valHooks[e.type] || fb.valHooks[e.nodeName.toLowerCase()], 
                            b && "get" in b && void 0 !== (c = b.get(e, "value")) ? c : (c = e.value, "string" == typeof c ? c.replace(vc, "") : null == c ? "" : c);
                        }
                    }
                }), fb.extend({
                    valHooks: {
                        option: {
                            get: function(a) {
                                var b = fb.find.attr(a, "value");
                                return null != b ? b : fb.trim(fb.text(a));
                            }
                        },
                        select: {
                            get: function(a) {
                                for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || 0 > e, g = f ? null : [], h = f ? e + 1 : d.length, i = 0 > e ? h : f ? e : 0; h > i; i++) if (c = d[i], 
                                !(!c.selected && i !== e || (db.optDisabled ? c.disabled : null !== c.getAttribute("disabled")) || c.parentNode.disabled && fb.nodeName(c.parentNode, "optgroup"))) {
                                    if (b = fb(c).val(), f) return b;
                                    g.push(b);
                                }
                                return g;
                            },
                            set: function(a, b) {
                                for (var c, d, e = a.options, f = fb.makeArray(b), g = e.length; g--; ) if (d = e[g], 
                                fb.inArray(fb.valHooks.option.get(d), f) >= 0) try {
                                    d.selected = c = !0;
                                } catch (h) {
                                    d.scrollHeight;
                                } else d.selected = !1;
                                return c || (a.selectedIndex = -1), e;
                            }
                        }
                    }
                }), fb.each([ "radio", "checkbox" ], function() {
                    fb.valHooks[this] = {
                        set: function(a, b) {
                            return fb.isArray(b) ? a.checked = fb.inArray(fb(a).val(), b) >= 0 : void 0;
                        }
                    }, db.checkOn || (fb.valHooks[this].get = function(a) {
                        return null === a.getAttribute("value") ? "on" : a.value;
                    });
                });
                var wc, xc, yc = fb.expr.attrHandle, zc = /^(?:checked|selected)$/i, Ac = db.getSetAttribute, Bc = db.input;
                fb.fn.extend({
                    attr: function(a, b) {
                        return Eb(this, fb.attr, a, b, arguments.length > 1);
                    },
                    removeAttr: function(a) {
                        return this.each(function() {
                            fb.removeAttr(this, a);
                        });
                    }
                }), fb.extend({
                    attr: function(a, b, c) {
                        var d, e, f = a.nodeType;
                        if (a && 3 !== f && 8 !== f && 2 !== f) return typeof a.getAttribute === yb ? fb.prop(a, b, c) : (1 === f && fb.isXMLDoc(a) || (b = b.toLowerCase(), 
                        d = fb.attrHooks[b] || (fb.expr.match.bool.test(b) ? xc : wc)), void 0 === c ? d && "get" in d && null !== (e = d.get(a, b)) ? e : (e = fb.find.attr(a, b), 
                        null == e ? void 0 : e) : null !== c ? d && "set" in d && void 0 !== (e = d.set(a, c, b)) ? e : (a.setAttribute(b, c + ""), 
                        c) : void fb.removeAttr(a, b));
                    },
                    removeAttr: function(a, b) {
                        var c, d, e = 0, f = b && b.match(ub);
                        if (f && 1 === a.nodeType) for (;c = f[e++]; ) d = fb.propFix[c] || c, fb.expr.match.bool.test(c) ? Bc && Ac || !zc.test(c) ? a[d] = !1 : a[fb.camelCase("default-" + c)] = a[d] = !1 : fb.attr(a, c, ""), 
                        a.removeAttribute(Ac ? c : d);
                    },
                    attrHooks: {
                        type: {
                            set: function(a, b) {
                                if (!db.radioValue && "radio" === b && fb.nodeName(a, "input")) {
                                    var c = a.value;
                                    return a.setAttribute("type", b), c && (a.value = c), b;
                                }
                            }
                        }
                    }
                }), xc = {
                    set: function(a, b, c) {
                        return b === !1 ? fb.removeAttr(a, c) : Bc && Ac || !zc.test(c) ? a.setAttribute(!Ac && fb.propFix[c] || c, c) : a[fb.camelCase("default-" + c)] = a[c] = !0, 
                        c;
                    }
                }, fb.each(fb.expr.match.bool.source.match(/\w+/g), function(a, b) {
                    var c = yc[b] || fb.find.attr;
                    yc[b] = Bc && Ac || !zc.test(b) ? function(a, b, d) {
                        var e, f;
                        return d || (f = yc[b], yc[b] = e, e = null != c(a, b, d) ? b.toLowerCase() : null, 
                        yc[b] = f), e;
                    } : function(a, b, c) {
                        return c ? void 0 : a[fb.camelCase("default-" + b)] ? b.toLowerCase() : null;
                    };
                }), Bc && Ac || (fb.attrHooks.value = {
                    set: function(a, b, c) {
                        return fb.nodeName(a, "input") ? void (a.defaultValue = b) : wc && wc.set(a, b, c);
                    }
                }), Ac || (wc = {
                    set: function(a, b, c) {
                        var d = a.getAttributeNode(c);
                        return d || a.setAttributeNode(d = a.ownerDocument.createAttribute(c)), d.value = b += "", 
                        "value" === c || b === a.getAttribute(c) ? b : void 0;
                    }
                }, yc.id = yc.name = yc.coords = function(a, b, c) {
                    var d;
                    return c ? void 0 : (d = a.getAttributeNode(b)) && "" !== d.value ? d.value : null;
                }, fb.valHooks.button = {
                    get: function(a, b) {
                        var c = a.getAttributeNode(b);
                        return c && c.specified ? c.value : void 0;
                    },
                    set: wc.set
                }, fb.attrHooks.contenteditable = {
                    set: function(a, b, c) {
                        wc.set(a, "" === b ? !1 : b, c);
                    }
                }, fb.each([ "width", "height" ], function(a, b) {
                    fb.attrHooks[b] = {
                        set: function(a, c) {
                            return "" === c ? (a.setAttribute(b, "auto"), c) : void 0;
                        }
                    };
                })), db.style || (fb.attrHooks.style = {
                    get: function(a) {
                        return a.style.cssText || void 0;
                    },
                    set: function(a, b) {
                        return a.style.cssText = b + "";
                    }
                });
                var Cc = /^(?:input|select|textarea|button|object)$/i, Dc = /^(?:a|area)$/i;
                fb.fn.extend({
                    prop: function(a, b) {
                        return Eb(this, fb.prop, a, b, arguments.length > 1);
                    },
                    removeProp: function(a) {
                        return a = fb.propFix[a] || a, this.each(function() {
                            try {
                                this[a] = void 0, delete this[a];
                            } catch (b) {}
                        });
                    }
                }), fb.extend({
                    propFix: {
                        "for": "htmlFor",
                        "class": "className"
                    },
                    prop: function(a, b, c) {
                        var d, e, f, g = a.nodeType;
                        if (a && 3 !== g && 8 !== g && 2 !== g) return f = 1 !== g || !fb.isXMLDoc(a), f && (b = fb.propFix[b] || b, 
                        e = fb.propHooks[b]), void 0 !== c ? e && "set" in e && void 0 !== (d = e.set(a, c, b)) ? d : a[b] = c : e && "get" in e && null !== (d = e.get(a, b)) ? d : a[b];
                    },
                    propHooks: {
                        tabIndex: {
                            get: function(a) {
                                var b = fb.find.attr(a, "tabindex");
                                return b ? parseInt(b, 10) : Cc.test(a.nodeName) || Dc.test(a.nodeName) && a.href ? 0 : -1;
                            }
                        }
                    }
                }), db.hrefNormalized || fb.each([ "href", "src" ], function(a, b) {
                    fb.propHooks[b] = {
                        get: function(a) {
                            return a.getAttribute(b, 4);
                        }
                    };
                }), db.optSelected || (fb.propHooks.selected = {
                    get: function(a) {
                        var b = a.parentNode;
                        return b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex), null;
                    }
                }), fb.each([ "tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable" ], function() {
                    fb.propFix[this.toLowerCase()] = this;
                }), db.enctype || (fb.propFix.enctype = "encoding");
                var Ec = /[\t\r\n\f]/g;
                fb.fn.extend({
                    addClass: function(a) {
                        var b, c, d, e, f, g, h = 0, i = this.length, j = "string" == typeof a && a;
                        if (fb.isFunction(a)) return this.each(function(b) {
                            fb(this).addClass(a.call(this, b, this.className));
                        });
                        if (j) for (b = (a || "").match(ub) || []; i > h; h++) if (c = this[h], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(Ec, " ") : " ")) {
                            for (f = 0; e = b[f++]; ) d.indexOf(" " + e + " ") < 0 && (d += e + " ");
                            g = fb.trim(d), c.className !== g && (c.className = g);
                        }
                        return this;
                    },
                    removeClass: function(a) {
                        var b, c, d, e, f, g, h = 0, i = this.length, j = 0 === arguments.length || "string" == typeof a && a;
                        if (fb.isFunction(a)) return this.each(function(b) {
                            fb(this).removeClass(a.call(this, b, this.className));
                        });
                        if (j) for (b = (a || "").match(ub) || []; i > h; h++) if (c = this[h], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(Ec, " ") : "")) {
                            for (f = 0; e = b[f++]; ) for (;d.indexOf(" " + e + " ") >= 0; ) d = d.replace(" " + e + " ", " ");
                            g = a ? fb.trim(d) : "", c.className !== g && (c.className = g);
                        }
                        return this;
                    },
                    toggleClass: function(a, b) {
                        var c = typeof a;
                        return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : this.each(fb.isFunction(a) ? function(c) {
                            fb(this).toggleClass(a.call(this, c, this.className, b), b);
                        } : function() {
                            if ("string" === c) for (var b, d = 0, e = fb(this), f = a.match(ub) || []; b = f[d++]; ) e.hasClass(b) ? e.removeClass(b) : e.addClass(b); else (c === yb || "boolean" === c) && (this.className && fb._data(this, "__className__", this.className), 
                            this.className = this.className || a === !1 ? "" : fb._data(this, "__className__") || "");
                        });
                    },
                    hasClass: function(a) {
                        for (var b = " " + a + " ", c = 0, d = this.length; d > c; c++) if (1 === this[c].nodeType && (" " + this[c].className + " ").replace(Ec, " ").indexOf(b) >= 0) return !0;
                        return !1;
                    }
                }), fb.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, b) {
                    fb.fn[b] = function(a, c) {
                        return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b);
                    };
                }), fb.fn.extend({
                    hover: function(a, b) {
                        return this.mouseenter(a).mouseleave(b || a);
                    },
                    bind: function(a, b, c) {
                        return this.on(a, null, b, c);
                    },
                    unbind: function(a, b) {
                        return this.off(a, null, b);
                    },
                    delegate: function(a, b, c, d) {
                        return this.on(b, a, c, d);
                    },
                    undelegate: function(a, b, c) {
                        return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c);
                    }
                });
                var Fc = fb.now(), Gc = /\?/, Hc = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
                fb.parseJSON = function(a) {
                    if (b.JSON && b.JSON.parse) return b.JSON.parse(a + "");
                    var c, d = null, e = fb.trim(a + "");
                    return e && !fb.trim(e.replace(Hc, function(a, b, e, f) {
                        return c && b && (d = 0), 0 === d ? a : (c = e || b, d += !f - !e, "");
                    })) ? Function("return " + e)() : fb.error("Invalid JSON: " + a);
                }, fb.parseXML = function(a) {
                    var c, d;
                    if (!a || "string" != typeof a) return null;
                    try {
                        b.DOMParser ? (d = new DOMParser(), c = d.parseFromString(a, "text/xml")) : (c = new ActiveXObject("Microsoft.XMLDOM"), 
                        c.async = "false", c.loadXML(a));
                    } catch (e) {
                        c = void 0;
                    }
                    return c && c.documentElement && !c.getElementsByTagName("parsererror").length || fb.error("Invalid XML: " + a), 
                    c;
                };
                var Ic, Jc, Kc = /#.*$/, Lc = /([?&])_=[^&]*/, Mc = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, Nc = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, Oc = /^(?:GET|HEAD)$/, Pc = /^\/\//, Qc = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, Rc = {}, Sc = {}, Tc = "*/".concat("*");
                try {
                    Jc = location.href;
                } catch (Uc) {
                    Jc = pb.createElement("a"), Jc.href = "", Jc = Jc.href;
                }
                Ic = Qc.exec(Jc.toLowerCase()) || [], fb.extend({
                    active: 0,
                    lastModified: {},
                    etag: {},
                    ajaxSettings: {
                        url: Jc,
                        type: "GET",
                        isLocal: Nc.test(Ic[1]),
                        global: !0,
                        processData: !0,
                        async: !0,
                        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                        accepts: {
                            "*": Tc,
                            text: "text/plain",
                            html: "text/html",
                            xml: "application/xml, text/xml",
                            json: "application/json, text/javascript"
                        },
                        contents: {
                            xml: /xml/,
                            html: /html/,
                            json: /json/
                        },
                        responseFields: {
                            xml: "responseXML",
                            text: "responseText",
                            json: "responseJSON"
                        },
                        converters: {
                            "* text": String,
                            "text html": !0,
                            "text json": fb.parseJSON,
                            "text xml": fb.parseXML
                        },
                        flatOptions: {
                            url: !0,
                            context: !0
                        }
                    },
                    ajaxSetup: function(a, b) {
                        return b ? Q(Q(a, fb.ajaxSettings), b) : Q(fb.ajaxSettings, a);
                    },
                    ajaxPrefilter: O(Rc),
                    ajaxTransport: O(Sc),
                    ajax: function(a, b) {
                        function c(a, b, c, d) {
                            var e, k, r, s, u, w = b;
                            2 !== t && (t = 2, h && clearTimeout(h), j = void 0, g = d || "", v.readyState = a > 0 ? 4 : 0, 
                            e = a >= 200 && 300 > a || 304 === a, c && (s = R(l, v, c)), s = S(l, s, v, e), 
                            e ? (l.ifModified && (u = v.getResponseHeader("Last-Modified"), u && (fb.lastModified[f] = u), 
                            u = v.getResponseHeader("etag"), u && (fb.etag[f] = u)), 204 === a || "HEAD" === l.type ? w = "nocontent" : 304 === a ? w = "notmodified" : (w = s.state, 
                            k = s.data, r = s.error, e = !r)) : (r = w, (a || !w) && (w = "error", 0 > a && (a = 0))), 
                            v.status = a, v.statusText = (b || w) + "", e ? o.resolveWith(m, [ k, w, v ]) : o.rejectWith(m, [ v, w, r ]), 
                            v.statusCode(q), q = void 0, i && n.trigger(e ? "ajaxSuccess" : "ajaxError", [ v, l, e ? k : r ]), 
                            p.fireWith(m, [ v, w ]), i && (n.trigger("ajaxComplete", [ v, l ]), --fb.active || fb.event.trigger("ajaxStop")));
                        }
                        "object" == typeof a && (b = a, a = void 0), b = b || {};
                        var d, e, f, g, h, i, j, k, l = fb.ajaxSetup({}, b), m = l.context || l, n = l.context && (m.nodeType || m.jquery) ? fb(m) : fb.event, o = fb.Deferred(), p = fb.Callbacks("once memory"), q = l.statusCode || {}, r = {}, s = {}, t = 0, u = "canceled", v = {
                            readyState: 0,
                            getResponseHeader: function(a) {
                                var b;
                                if (2 === t) {
                                    if (!k) for (k = {}; b = Mc.exec(g); ) k[b[1].toLowerCase()] = b[2];
                                    b = k[a.toLowerCase()];
                                }
                                return null == b ? null : b;
                            },
                            getAllResponseHeaders: function() {
                                return 2 === t ? g : null;
                            },
                            setRequestHeader: function(a, b) {
                                var c = a.toLowerCase();
                                return t || (a = s[c] = s[c] || a, r[a] = b), this;
                            },
                            overrideMimeType: function(a) {
                                return t || (l.mimeType = a), this;
                            },
                            statusCode: function(a) {
                                var b;
                                if (a) if (2 > t) for (b in a) q[b] = [ q[b], a[b] ]; else v.always(a[v.status]);
                                return this;
                            },
                            abort: function(a) {
                                var b = a || u;
                                return j && j.abort(b), c(0, b), this;
                            }
                        };
                        if (o.promise(v).complete = p.add, v.success = v.done, v.error = v.fail, l.url = ((a || l.url || Jc) + "").replace(Kc, "").replace(Pc, Ic[1] + "//"), 
                        l.type = b.method || b.type || l.method || l.type, l.dataTypes = fb.trim(l.dataType || "*").toLowerCase().match(ub) || [ "" ], 
                        null == l.crossDomain && (d = Qc.exec(l.url.toLowerCase()), l.crossDomain = !(!d || d[1] === Ic[1] && d[2] === Ic[2] && (d[3] || ("http:" === d[1] ? "80" : "443")) === (Ic[3] || ("http:" === Ic[1] ? "80" : "443")))), 
                        l.data && l.processData && "string" != typeof l.data && (l.data = fb.param(l.data, l.traditional)), 
                        P(Rc, l, b, v), 2 === t) return v;
                        i = l.global, i && 0 === fb.active++ && fb.event.trigger("ajaxStart"), l.type = l.type.toUpperCase(), 
                        l.hasContent = !Oc.test(l.type), f = l.url, l.hasContent || (l.data && (f = l.url += (Gc.test(f) ? "&" : "?") + l.data, 
                        delete l.data), l.cache === !1 && (l.url = Lc.test(f) ? f.replace(Lc, "$1_=" + Fc++) : f + (Gc.test(f) ? "&" : "?") + "_=" + Fc++)), 
                        l.ifModified && (fb.lastModified[f] && v.setRequestHeader("If-Modified-Since", fb.lastModified[f]), 
                        fb.etag[f] && v.setRequestHeader("If-None-Match", fb.etag[f])), (l.data && l.hasContent && l.contentType !== !1 || b.contentType) && v.setRequestHeader("Content-Type", l.contentType), 
                        v.setRequestHeader("Accept", l.dataTypes[0] && l.accepts[l.dataTypes[0]] ? l.accepts[l.dataTypes[0]] + ("*" !== l.dataTypes[0] ? ", " + Tc + "; q=0.01" : "") : l.accepts["*"]);
                        for (e in l.headers) v.setRequestHeader(e, l.headers[e]);
                        if (l.beforeSend && (l.beforeSend.call(m, v, l) === !1 || 2 === t)) return v.abort();
                        u = "abort";
                        for (e in {
                            success: 1,
                            error: 1,
                            complete: 1
                        }) v[e](l[e]);
                        if (j = P(Sc, l, b, v)) {
                            v.readyState = 1, i && n.trigger("ajaxSend", [ v, l ]), l.async && l.timeout > 0 && (h = setTimeout(function() {
                                v.abort("timeout");
                            }, l.timeout));
                            try {
                                t = 1, j.send(r, c);
                            } catch (w) {
                                if (!(2 > t)) throw w;
                                c(-1, w);
                            }
                        } else c(-1, "No Transport");
                        return v;
                    },
                    getJSON: function(a, b, c) {
                        return fb.get(a, b, c, "json");
                    },
                    getScript: function(a, b) {
                        return fb.get(a, void 0, b, "script");
                    }
                }), fb.each([ "get", "post" ], function(a, b) {
                    fb[b] = function(a, c, d, e) {
                        return fb.isFunction(c) && (e = e || d, d = c, c = void 0), fb.ajax({
                            url: a,
                            type: b,
                            dataType: e,
                            data: c,
                            success: d
                        });
                    };
                }), fb.each([ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function(a, b) {
                    fb.fn[b] = function(a) {
                        return this.on(b, a);
                    };
                }), fb._evalUrl = function(a) {
                    return fb.ajax({
                        url: a,
                        type: "GET",
                        dataType: "script",
                        async: !1,
                        global: !1,
                        "throws": !0
                    });
                }, fb.fn.extend({
                    wrapAll: function(a) {
                        if (fb.isFunction(a)) return this.each(function(b) {
                            fb(this).wrapAll(a.call(this, b));
                        });
                        if (this[0]) {
                            var b = fb(a, this[0].ownerDocument).eq(0).clone(!0);
                            this[0].parentNode && b.insertBefore(this[0]), b.map(function() {
                                for (var a = this; a.firstChild && 1 === a.firstChild.nodeType; ) a = a.firstChild;
                                return a;
                            }).append(this);
                        }
                        return this;
                    },
                    wrapInner: function(a) {
                        return this.each(fb.isFunction(a) ? function(b) {
                            fb(this).wrapInner(a.call(this, b));
                        } : function() {
                            var b = fb(this), c = b.contents();
                            c.length ? c.wrapAll(a) : b.append(a);
                        });
                    },
                    wrap: function(a) {
                        var b = fb.isFunction(a);
                        return this.each(function(c) {
                            fb(this).wrapAll(b ? a.call(this, c) : a);
                        });
                    },
                    unwrap: function() {
                        return this.parent().each(function() {
                            fb.nodeName(this, "body") || fb(this).replaceWith(this.childNodes);
                        }).end();
                    }
                }), fb.expr.filters.hidden = function(a) {
                    return a.offsetWidth <= 0 && a.offsetHeight <= 0 || !db.reliableHiddenOffsets() && "none" === (a.style && a.style.display || fb.css(a, "display"));
                }, fb.expr.filters.visible = function(a) {
                    return !fb.expr.filters.hidden(a);
                };
                var Vc = /%20/g, Wc = /\[\]$/, Xc = /\r?\n/g, Yc = /^(?:submit|button|image|reset|file)$/i, Zc = /^(?:input|select|textarea|keygen)/i;
                fb.param = function(a, b) {
                    var c, d = [], e = function(a, b) {
                        b = fb.isFunction(b) ? b() : null == b ? "" : b, d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b);
                    };
                    if (void 0 === b && (b = fb.ajaxSettings && fb.ajaxSettings.traditional), fb.isArray(a) || a.jquery && !fb.isPlainObject(a)) fb.each(a, function() {
                        e(this.name, this.value);
                    }); else for (c in a) T(c, a[c], b, e);
                    return d.join("&").replace(Vc, "+");
                }, fb.fn.extend({
                    serialize: function() {
                        return fb.param(this.serializeArray());
                    },
                    serializeArray: function() {
                        return this.map(function() {
                            var a = fb.prop(this, "elements");
                            return a ? fb.makeArray(a) : this;
                        }).filter(function() {
                            var a = this.type;
                            return this.name && !fb(this).is(":disabled") && Zc.test(this.nodeName) && !Yc.test(a) && (this.checked || !Fb.test(a));
                        }).map(function(a, b) {
                            var c = fb(this).val();
                            return null == c ? null : fb.isArray(c) ? fb.map(c, function(a) {
                                return {
                                    name: b.name,
                                    value: a.replace(Xc, "\r\n")
                                };
                            }) : {
                                name: b.name,
                                value: c.replace(Xc, "\r\n")
                            };
                        }).get();
                    }
                }), fb.ajaxSettings.xhr = void 0 !== b.ActiveXObject ? function() {
                    return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && U() || V();
                } : U;
                var $c = 0, _c = {}, ad = fb.ajaxSettings.xhr();
                b.ActiveXObject && fb(b).on("unload", function() {
                    for (var a in _c) _c[a](void 0, !0);
                }), db.cors = !!ad && "withCredentials" in ad, ad = db.ajax = !!ad, ad && fb.ajaxTransport(function(a) {
                    if (!a.crossDomain || db.cors) {
                        var b;
                        return {
                            send: function(c, d) {
                                var e, f = a.xhr(), g = ++$c;
                                if (f.open(a.type, a.url, a.async, a.username, a.password), a.xhrFields) for (e in a.xhrFields) f[e] = a.xhrFields[e];
                                a.mimeType && f.overrideMimeType && f.overrideMimeType(a.mimeType), a.crossDomain || c["X-Requested-With"] || (c["X-Requested-With"] = "XMLHttpRequest");
                                for (e in c) void 0 !== c[e] && f.setRequestHeader(e, c[e] + "");
                                f.send(a.hasContent && a.data || null), b = function(c, e) {
                                    var h, i, j;
                                    if (b && (e || 4 === f.readyState)) if (delete _c[g], b = void 0, f.onreadystatechange = fb.noop, 
                                    e) 4 !== f.readyState && f.abort(); else {
                                        j = {}, h = f.status, "string" == typeof f.responseText && (j.text = f.responseText);
                                        try {
                                            i = f.statusText;
                                        } catch (k) {
                                            i = "";
                                        }
                                        h || !a.isLocal || a.crossDomain ? 1223 === h && (h = 204) : h = j.text ? 200 : 404;
                                    }
                                    j && d(h, i, j, f.getAllResponseHeaders());
                                }, a.async ? 4 === f.readyState ? setTimeout(b) : f.onreadystatechange = _c[g] = b : b();
                            },
                            abort: function() {
                                b && b(void 0, !0);
                            }
                        };
                    }
                }), fb.ajaxSetup({
                    accepts: {
                        script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
                    },
                    contents: {
                        script: /(?:java|ecma)script/
                    },
                    converters: {
                        "text script": function(a) {
                            return fb.globalEval(a), a;
                        }
                    }
                }), fb.ajaxPrefilter("script", function(a) {
                    void 0 === a.cache && (a.cache = !1), a.crossDomain && (a.type = "GET", a.global = !1);
                }), fb.ajaxTransport("script", function(a) {
                    if (a.crossDomain) {
                        var b, c = pb.head || fb("head")[0] || pb.documentElement;
                        return {
                            send: function(d, e) {
                                b = pb.createElement("script"), b.async = !0, a.scriptCharset && (b.charset = a.scriptCharset), 
                                b.src = a.url, b.onload = b.onreadystatechange = function(a, c) {
                                    (c || !b.readyState || /loaded|complete/.test(b.readyState)) && (b.onload = b.onreadystatechange = null, 
                                    b.parentNode && b.parentNode.removeChild(b), b = null, c || e(200, "success"));
                                }, c.insertBefore(b, c.firstChild);
                            },
                            abort: function() {
                                b && b.onload(void 0, !0);
                            }
                        };
                    }
                });
                var bd = [], cd = /(=)\?(?=&|$)|\?\?/;
                fb.ajaxSetup({
                    jsonp: "callback",
                    jsonpCallback: function() {
                        var a = bd.pop() || fb.expando + "_" + Fc++;
                        return this[a] = !0, a;
                    }
                }), fb.ajaxPrefilter("json jsonp", function(a, c, d) {
                    var e, f, g, h = a.jsonp !== !1 && (cd.test(a.url) ? "url" : "string" == typeof a.data && !(a.contentType || "").indexOf("application/x-www-form-urlencoded") && cd.test(a.data) && "data");
                    return h || "jsonp" === a.dataTypes[0] ? (e = a.jsonpCallback = fb.isFunction(a.jsonpCallback) ? a.jsonpCallback() : a.jsonpCallback, 
                    h ? a[h] = a[h].replace(cd, "$1" + e) : a.jsonp !== !1 && (a.url += (Gc.test(a.url) ? "&" : "?") + a.jsonp + "=" + e), 
                    a.converters["script json"] = function() {
                        return g || fb.error(e + " was not called"), g[0];
                    }, a.dataTypes[0] = "json", f = b[e], b[e] = function() {
                        g = arguments;
                    }, d.always(function() {
                        b[e] = f, a[e] && (a.jsonpCallback = c.jsonpCallback, bd.push(e)), g && fb.isFunction(f) && f(g[0]), 
                        g = f = void 0;
                    }), "script") : void 0;
                }), fb.parseHTML = function(a, b, c) {
                    if (!a || "string" != typeof a) return null;
                    "boolean" == typeof b && (c = b, b = !1), b = b || pb;
                    var d = mb.exec(a), e = !c && [];
                    return d ? [ b.createElement(d[1]) ] : (d = fb.buildFragment([ a ], b, e), e && e.length && fb(e).remove(), 
                    fb.merge([], d.childNodes));
                };
                var dd = fb.fn.load;
                fb.fn.load = function(a, b, c) {
                    if ("string" != typeof a && dd) return dd.apply(this, arguments);
                    var d, e, f, g = this, h = a.indexOf(" ");
                    return h >= 0 && (d = fb.trim(a.slice(h, a.length)), a = a.slice(0, h)), fb.isFunction(b) ? (c = b, 
                    b = void 0) : b && "object" == typeof b && (f = "POST"), g.length > 0 && fb.ajax({
                        url: a,
                        type: f,
                        dataType: "html",
                        data: b
                    }).done(function(a) {
                        e = arguments, g.html(d ? fb("<div>").append(fb.parseHTML(a)).find(d) : a);
                    }).complete(c && function(a, b) {
                        g.each(c, e || [ a.responseText, b, a ]);
                    }), this;
                }, fb.expr.filters.animated = function(a) {
                    return fb.grep(fb.timers, function(b) {
                        return a === b.elem;
                    }).length;
                };
                var ed = b.document.documentElement;
                fb.offset = {
                    setOffset: function(a, b, c) {
                        var d, e, f, g, h, i, j, k = fb.css(a, "position"), l = fb(a), m = {};
                        "static" === k && (a.style.position = "relative"), h = l.offset(), f = fb.css(a, "top"), 
                        i = fb.css(a, "left"), j = ("absolute" === k || "fixed" === k) && fb.inArray("auto", [ f, i ]) > -1, 
                        j ? (d = l.position(), g = d.top, e = d.left) : (g = parseFloat(f) || 0, e = parseFloat(i) || 0), 
                        fb.isFunction(b) && (b = b.call(a, c, h)), null != b.top && (m.top = b.top - h.top + g), 
                        null != b.left && (m.left = b.left - h.left + e), "using" in b ? b.using.call(a, m) : l.css(m);
                    }
                }, fb.fn.extend({
                    offset: function(a) {
                        if (arguments.length) return void 0 === a ? this : this.each(function(b) {
                            fb.offset.setOffset(this, a, b);
                        });
                        var b, c, d = {
                            top: 0,
                            left: 0
                        }, e = this[0], f = e && e.ownerDocument;
                        if (f) return b = f.documentElement, fb.contains(b, e) ? (typeof e.getBoundingClientRect !== yb && (d = e.getBoundingClientRect()), 
                        c = W(f), {
                            top: d.top + (c.pageYOffset || b.scrollTop) - (b.clientTop || 0),
                            left: d.left + (c.pageXOffset || b.scrollLeft) - (b.clientLeft || 0)
                        }) : d;
                    },
                    position: function() {
                        if (this[0]) {
                            var a, b, c = {
                                top: 0,
                                left: 0
                            }, d = this[0];
                            return "fixed" === fb.css(d, "position") ? b = d.getBoundingClientRect() : (a = this.offsetParent(), 
                            b = this.offset(), fb.nodeName(a[0], "html") || (c = a.offset()), c.top += fb.css(a[0], "borderTopWidth", !0), 
                            c.left += fb.css(a[0], "borderLeftWidth", !0)), {
                                top: b.top - c.top - fb.css(d, "marginTop", !0),
                                left: b.left - c.left - fb.css(d, "marginLeft", !0)
                            };
                        }
                    },
                    offsetParent: function() {
                        return this.map(function() {
                            for (var a = this.offsetParent || ed; a && !fb.nodeName(a, "html") && "static" === fb.css(a, "position"); ) a = a.offsetParent;
                            return a || ed;
                        });
                    }
                }), fb.each({
                    scrollLeft: "pageXOffset",
                    scrollTop: "pageYOffset"
                }, function(a, b) {
                    var c = /Y/.test(b);
                    fb.fn[a] = function(d) {
                        return Eb(this, function(a, d, e) {
                            var f = W(a);
                            return void 0 === e ? f ? b in f ? f[b] : f.document.documentElement[d] : a[d] : void (f ? f.scrollTo(c ? fb(f).scrollLeft() : e, c ? e : fb(f).scrollTop()) : a[d] = e);
                        }, a, d, arguments.length, null);
                    };
                }), fb.each([ "top", "left" ], function(a, b) {
                    fb.cssHooks[b] = B(db.pixelPosition, function(a, c) {
                        return c ? (c = cc(a, b), ec.test(c) ? fb(a).position()[b] + "px" : c) : void 0;
                    });
                }), fb.each({
                    Height: "height",
                    Width: "width"
                }, function(a, b) {
                    fb.each({
                        padding: "inner" + a,
                        content: b,
                        "": "outer" + a
                    }, function(c, d) {
                        fb.fn[d] = function(d, e) {
                            var f = arguments.length && (c || "boolean" != typeof d), g = c || (d === !0 || e === !0 ? "margin" : "border");
                            return Eb(this, function(b, c, d) {
                                var e;
                                return fb.isWindow(b) ? b.document.documentElement["client" + a] : 9 === b.nodeType ? (e = b.documentElement, 
                                Math.max(b.body["scroll" + a], e["scroll" + a], b.body["offset" + a], e["offset" + a], e["client" + a])) : void 0 === d ? fb.css(b, c, g) : fb.style(b, c, d, g);
                            }, b, f ? d : void 0, f, null);
                        };
                    });
                }), fb.fn.size = function() {
                    return this.length;
                }, fb.fn.andSelf = fb.fn.addBack, "function" == typeof a && a.amd && a("jquery", [], function() {
                    return fb;
                });
                var fd = b.jQuery, gd = b.$;
                return fb.noConflict = function(a) {
                    return b.$ === fb && (b.$ = gd), a && b.jQuery === fb && (b.jQuery = fd), fb;
                }, typeof c === yb && (b.jQuery = b.$ = fb), fb;
            });
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
        "/Users/dave/dev/projects/myna-js/src/main/client/myna-ui.coffee": [ function(a, b) {
            var c, d, e, f = function(a, b) {
                return function() {
                    return a.apply(b, arguments);
                };
            }, g = {}.hasOwnProperty, h = function(a, b) {
                function c() {
                    this.constructor = a;
                }
                for (var d in b) g.call(b, d) && (a[d] = b[d]);
                return c.prototype = b.prototype, a.prototype = new c(), a.__super__ = b.prototype, 
                a;
            };
            c = a("./default"), e = a("../engine/myna-ui"), b.exports = d = function(a) {
                function b(a, c) {
                    null == a && (a = []), null == c && (c = {}), this.view = f(this.view, this), this.suggest = f(this.suggest, this), 
                    b.__super__.constructor.call(this, a, c), this._undoFuncs = {}, this._changesKey = "myna.web.changes";
                }
                return h(b, a), b.prototype.suggest = function(a) {
                    return b.__super__.suggest.call(this, expt).then(function(b) {
                        return this._apply(a, b);
                    });
                }, b.prototype.view = function(a, c) {
                    return b.__super__.view.call(this, expt, c).then(function(b) {
                        return this._apply(a, b);
                    });
                }, b.prototype._apply = function(a, b) {
                    var c, d;
                    return c = settings.get(b.settings, this._changesKey, []), "function" == typeof (d = this._undoFuncs)[a] && d[a](), 
                    this._undoFuncs[a] = e.apply(c, function(c) {
                        return function() {
                            return c.reward(a, b);
                        };
                    }(this)), b;
                }, b;
            }(c);
        }, {
            "../engine/myna-ui": "/Users/dave/dev/projects/myna-js/src/main/engine/myna-ui.coffee",
            "./default": "/Users/dave/dev/projects/myna-js/src/main/client/default.coffee"
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
        "/Users/dave/dev/projects/myna-js/src/main/engine/myna-ui.coffee": [ function(a, b) {
            var c, d, e, f, g;
            c = a("jquery"), d = function(a, b) {
                var c, d, e;
                for (null == b && (b = window.location), d = 0, e = a.length; e > d; d++) if (c = a[d], 
                g(b, c.location)) return !0;
                return !1;
            }, e = function(a, b, c, d) {
                var e, h, i, j;
                for (null == c && (c = window.document), null == d && (d = window.location), h = [], 
                i = 0, j = a.length; j > i; i++) e = a[i], g(d, e.location) && h.unshift(f(e, c));
                return function() {
                    var a, b, c;
                    for (b = 0, c = h.length; c > b; b++) (a = h[b])();
                };
            }, f = function(a, b) {
                var d, e;
                switch (null == b && (b = window.document), a.typename) {
                  case "hide":
                    return e = c(b).find(a.selector), e.hide(), function() {
                        return e.show();
                    };

                  case "text":
                    return e = c(b).find(a.selector), d = e.text(), e.text(a.text), function() {
                        return e.text(d);
                    };

                  case "html":
                    return e = c(b).find(a.selector), d = e.html(), e.html(a.html), function() {
                        return e.html(d);
                    };

                  case "css":
                    return e = c(b).find(a.selector), d = e.css(), e.css(a.css), function() {
                        return e.css(d);
                    };

                  case "attr":
                    return e = c(b).find(a.selector), d = e.attr(a.name), e.attr(a.name, a.value), function() {
                        return e.attr(a.name, d);
                    };

                  case "eventgoal":
                    return c(b).on(a.event, a.selector, goalHandler), function() {
                        return c(b).off(a.event, a.selector, goalHandler);
                    };

                  case "loadgoal":
                    return c(window).on("load", goalHandler), function() {
                        return c(window).off("load", goalHandler);
                    };

                  default:
                    throw new Error("Invalid change type: " + options);
                }
            }, g = function(a, b) {
                return !((b.scheme ? a.scheme !== b.scheme : 0) || (b.hostname ? a.hostname !== b.hostname : 0) || (b.port ? a.port !== b.port : 0) || (b.pathname ? a.pathname !== b.pathname : 0));
            }, b.exports = {
                applicable: d,
                apply: e
            };
        }, {
            jquery: "/Users/dave/dev/projects/myna-js/node_modules/jquery/dist/jquery.js"
        } ],
        "/Users/dave/dev/projects/myna-js/src/main/myna-auto.coffee": [ function(a, b) {
            var c, d, e, f, g, h, i, j, k, l;
            e = a("./common/hash"), c = a("./client/myna-ui"), d = a("./bootstrap"), f = function(a) {
                return k() ? j() : h(a);
            }, g = function(a, b) {
                return null == b && (b = 0), k() ? j() : i(a, b);
            }, l = d.create(function(a, b) {
                return new c(a, b);
            }), h = l._initLocal, i = l._initRemote, k = function() {
                return !!e.params.mynaui;
            }, j = function() {
                var a;
                return a = document.createElement(script), a.setAttribute("src", "myna-ui.js"), 
                document.appendChild(a);
            }, b.exports = {
                initLocal: f,
                initRemote: g
            };
        }, {
            "./bootstrap": "/Users/dave/dev/projects/myna-js/src/main/bootstrap.coffee",
            "./client/myna-ui": "/Users/dave/dev/projects/myna-js/src/main/client/myna-ui.coffee",
            "./common/hash": "/Users/dave/dev/projects/myna-js/src/main/common/hash.coffee"
        } ]
    }, {}, [ "/Users/dave/dev/projects/myna-js/src/main/myna-auto.coffee" ])("/Users/dave/dev/projects/myna-js/src/main/myna-auto.coffee");
});