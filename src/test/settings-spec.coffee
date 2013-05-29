describe "Myna.Settings.parse", ->
  it "should produce a Path", ->
    expect(Myna.Settings.parse("a.b.c").path()).toEqual("a.b.c")

  it "should produce an empty Path", ->
    expect(Myna.Settings.parse("").path()).toEqual("")

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

  it "should call unset when the value is null", ->
    expect((new Myna.Settings a: b: c: 1).set("a.b", null).data).toEqual({ a: {} })

describe "Myna.Settings.set(object)", ->
  it "should set a new value", ->
    expect((new Myna.Settings a: 1).set(b: 2).data).toEqual({ a: 1, b: 2 })

  it "should overwrite an existing value", ->
    expect((new Myna.Settings a: 1).set(a: 2).data).toEqual({ a: 2 })

  it "should overwrite part of an existing value", ->
    expect((new Myna.Settings a: b: c: 1).set("a.b": 2).data).toEqual({ a: b: 2 })

  it "should set multiple values", ->
    expect((new Myna.Settings a: b: c: 1).set({ "a.b": 2, d: 3 }).data).toEqual({ a: { b: 2 }, d: 3 })

  it "should call unset when a value is null", ->
    expect((new Myna.Settings a: b: c: 1).set({ "a.b": null, d: 3 }).data).toEqual({ a: {}, d: 3 })

describe "Myna.Settings.unset(key, value)", ->
  it "should unset a value", ->
    expect((new Myna.Settings { a: 1, b: 2 }).unset("b").data).toEqual({ a: 1 })

  it "should unset only the relevant portion of a path", ->
    expect((new Myna.Settings { a: { b: 1, c: 2 } }).unset("a.b").data).toEqual({ a: c: 2 })
    expect((new Myna.Settings { a: b: 1 }).unset("a.b").data).toEqual({ a: {} })

describe "Path.prefixes(key)", ->
  it "should return the prefixes of a path", ->
    expect(Myna.Settings.parse("a.b.c").prefixes()).toEqual([ "a", "a.b", "a.b.c" ])

  it "should return one prefix if the path has one component", ->
    expect(Myna.Settings.parse("a").prefixes()).toEqual([ "a" ])

  it "should return no prefixes if the path is empty", ->
    expect(Myna.Settings.parse("").prefixes()).toEqual([])
