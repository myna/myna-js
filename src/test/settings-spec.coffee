describe "Myna.Settings.constructor", ->
  it "should create a new settings object", ->
    settings = new Myna.Settings { a: 1, b: 2, c: 3 }
    expect(settings.data).toEqual { a: 1, b: 2, c: 3 }

  it "should support nested objects", ->
    settings = new Myna.Settings a: b: c: 123
    expect(settings.data).toEqual a: b: c: 123

  it "should support path-style keys", ->
    settings = new Myna.Settings
      "a.b.c": 123
      "d.e.f": 234

    expect(settings.data).toEqual
      a: b: c: 123
      d: e: f: 234

  it "should create a settings object with the right keys", ->
    settings = new Myna.Settings
      a: b: c: 123
      "d.e": { f: 234, g: 345 }
      "d.e.f.h": 456

    expect(settings.data).toEqual
      a: b: c: 123
      d: e:
        f: h: 456
        g: 345

describe "Myna.Settings.get", ->
  it "should return a leaf value", ->
    expect((new Myna.Settings a: b: c: 123).get("a.b.c")).toEqual(123)

  it "should return a non-leaf value", ->
    expect((new Myna.Settings a: b: c: 123).get("a")).toEqual(b: c: 123)

  it "should return null for a missing value", ->
    expect((new Myna.Settings a: b: c: 123).get("a.c.e")).toEqual(null)

  it "should default to the provided value if necessary", ->
    expect((new Myna.Settings a: b: c: 123).get("a.b.c", 234)).toEqual(123)
    expect((new Myna.Settings a: b: c: 123).get("a.c.e", 234)).toEqual(234)

describe "Myna.Settings.set(key, value)", ->
  it "should set a new value", ->
    expect((new Myna.Settings a: 1).set("b", 2).data).toEqual({ a: 1, b: 2 })

  it "should overwrite an existing value", ->
    expect((new Myna.Settings a: 1).set("a", 2).data).toEqual({ a: 2 })

  it "should overwrite part of an existing value", ->
    expect((new Myna.Settings a: b: c: 1).set("a.b", 2).data).toEqual({ a: b: 2 })

describe "Myna.Settings.set(object)", ->
  it "should set a new value", ->
    expect((new Myna.Settings a: 1).set(b: 2).data).toEqual({ a: 1, b: 2 })

  it "should overwrite an existing value", ->
    expect((new Myna.Settings a: 1).set(a: 2).data).toEqual({ a: 2 })

  it "should overwrite part of an existing value", ->
    expect((new Myna.Settings a: b: c: 1).set("a.b": 2).data).toEqual({ a: b: 2 })

  it "should set multiple values", ->
    expect((new Myna.Settings a: b: c: 1).set({ "a.b": 2, d: 3 }).data).toEqual({ a: { b: 2 }, d: 3 })
