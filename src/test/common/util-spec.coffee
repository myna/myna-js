util = require '../../main/common/util'

describe "util.isObject", ->
  it "should identify objects", ->
    expect(util.isObject({})).toEqual(true)
    expect(util.isObject({ a: 1 })).toEqual(true)

  it "should identify arrays", ->
    expect(util.isObject([])).toEqual(true)
    expect(util.isObject([ 1, 2 ])).toEqual(true)

  it "should identify strings", ->
    expect(util.isObject("")).toEqual(false)

  it "should identify numbers", ->
    expect(util.isObject(1.0)).toEqual(false)
    expect(util.isObject(0.0 / 0.0)).toEqual(false)

  it "should identify booleans", ->
    expect(util.isObject(true)).toEqual(false)
    expect(util.isObject(false)).toEqual(false)

  it "should identify null / undefined", ->
    expect(util.isObject(null)).toEqual(false)
    expect(util.isObject(undefined)).toEqual(false)

describe "util.isEmptyObject", ->
  it "should identify empty objects", ->
    expect(util.isEmptyObject({})).toEqual(true)
    expect(util.isEmptyObject({ a: 1 })).toEqual(false)

  it "should handle prototype chains correctly", ->
    a = { x: 1 }
    b = Object.create(a)
    expect(a.x).toEqual(1)
    expect(b.x).toEqual(1)
    expect(util.isEmptyObject(a)).toEqual(false)
    expect(util.isEmptyObject(b)).toEqual(true)

describe "util.extend", ->
  it "should add keys to an object", ->
    expect(util.extend({ a: 1 }, { b: 2 }, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 })

  it "should overwrite keys in earlier arguments", ->
    expect(util.extend({ a: 1 }, { a: 2 }, { a: 3 })).toEqual({ a: 3 })

  it "mutate the first argument but leave other arguments intact", ->
    foo = { a: 1 }
    bar = { a: 2 }
    baz = { a: 3 }
    util.extend(foo, bar, baz)
    expect(foo).toEqual({ a: 3 })
    expect(bar).toEqual({ a: 2 })
    expect(baz).toEqual({ a: 3 })

describe "util.deleteKeys", ->
  it "should delete keys from an object", ->
    expect(util.deleteKeys({ a: 1, b: 2, c: 3 }, "a", "c")).toEqual({ b: 2 })

  it "should leave the argument object intact", ->
    foo = { a: 1, b: 2, c: 3 }
    bar = util.deleteKeys(foo, "a", "c")
    expect(bar).toEqual({ b: 2 })

describe "util.dateToString", ->
  it "should output the same as Date.prototype.toISOString", ->
    date = new Date()
    expect(util.dateToString(date)).toEqual(date.toISOString())

  it "should work on a date outside DST", ->
    date = new Date(2013, 0, 1, 2, 3, 4, 5)
    expect(util.dateToString(date)).toEqual("2013-01-01T02:03:04.005Z")

  it "should work on a date inside DST", ->
    date = new Date(2013, 5, 1, 2, 3, 4, 5)
    expect(util.dateToString(date)).toEqual("2013-06-01T01:03:04.005Z")
