Settings = require '../main/settings'

describe "Settings.Path.constructor", ->
  it "should parse the empty string", ->
    expect(new Settings.Path("").nodes).toEqual([])

  it "should parse strings with valid JS identifiers", ->
    expect(new Settings.Path("a.b.c").nodes).toEqual([ "a", "b", "c" ])
    expect(new Settings.Path(".a.b.c").nodes).toEqual([ "a", "b", "c" ])

  it "should parse strings with valid numeric indices", ->
    expect(new Settings.Path("[1]").nodes).toEqual([ 1 ])
    expect(new Settings.Path("a[1]").nodes).toEqual([ "a", 1 ])
    expect(new Settings.Path("[1][2]").nodes).toEqual([ 1, 2 ])

  it "should parse strings with valid single quoted string indices", ->
    expect(new Settings.Path("['a']").nodes).toEqual([ "a" ])
    expect(new Settings.Path("a['b']").nodes).toEqual([ "a", "b" ])
    expect(new Settings.Path("['a']['b']").nodes).toEqual([ "a", "b" ])

  it "should parse strings with valid double quoted string indices", ->
    expect(new Settings.Path('["a"]').nodes).toEqual([ "a" ])
    expect(new Settings.Path('a["b"]').nodes).toEqual([ "a", "b" ])
    expect(new Settings.Path('["a"]["b"]').nodes).toEqual([ "a", "b" ])

  it "should parse complex paths", ->
    expect(new Settings.Path('a[1].b[2].c[3]').nodes).toEqual([ "a", 1, "b", 2, "c", 3 ])
    expect(new Settings.Path('a["b"].c[\'d\']').nodes).toEqual([ "a", "b", "c", "d" ])

  it "should cope with quotes and backslashes in strings", ->
    expect(new Settings.Path('["\\"bam\\" said the lady"]').nodes).toEqual [ '"bam" said the lady' ]
    expect(new Settings.Path("['\\'bam\\' said the lady']").nodes).toEqual [ "'bam' said the lady" ]
    expect(new Settings.Path("['single quote \\' double quote \\\" backslash \\\\']").nodes).toEqual [ 'single quote \' double quote " backslash \\' ]


describe "Settings.Path.get", ->
  it "should return appropriate values", ->
    expect(new Settings.Path("").get(a: b: c: 1)).toEqual(a: b: c: 1)
    expect(new Settings.Path("a").get(a: b: c: 1)).toEqual(b: c: 1)
    expect(new Settings.Path("a.b").get(a: b: c: 1)).toEqual(c: 1)
    expect(new Settings.Path("a.b.c").get(a: b: c: 1)).toEqual(1)
    expect(new Settings.Path("a.b.c.d").get(a: b: c: 1)).toEqual(null)
    expect(new Settings.Path("a.b.d").get(a: b: c: 1)).toEqual(null)
    expect(new Settings.Path("d").get(a: b: c: 1)).toEqual(null)

describe "Settings.Path.set", ->
  it "should return appropriate values", ->
    expect(new Settings.Path("").set(a: b: c: 1, "foo")).toEqual "foo"
    expect(new Settings.Path("a").set(a: b: c: 1, "foo")).toEqual { a: "foo" }
    expect(new Settings.Path("a.b").set(a: b: c: 1, "foo")).toEqual { a: b: "foo" }
    expect(new Settings.Path("a.b.c").set(a: b: c: 1, "foo")).toEqual { a: b: c: "foo" }
    expect(new Settings.Path("a.b.c.d").set(a: b: c: 1, "foo")).toEqual { a: b: c: d: "foo" }
    expect(new Settings.Path("a.b.d").set(a: b: c: 1, "foo")).toEqual { a: b: { c: 1, d: "foo" } }
    expect(new Settings.Path("d").set(a: b: c: 1, "foo")).toEqual { a: { b: c: 1 }, d: "foo" }

  it "should return appropriate valueswhen passed null", ->
    expect(new Settings.Path("").set(a: b: c: 1, null)).toEqual undefined
    expect(new Settings.Path("a").set(a: b: c: 1, null)).toEqual { }
    expect(new Settings.Path("a.b").set(a: b: c: 1, null)).toEqual { a: {} }
    expect(new Settings.Path("a.b.c").set(a: b: c: 1, null)).toEqual { a: b: {} }
    expect(new Settings.Path("a.b.c.d").set(a: b: c: 1, null)).toEqual { a: b: c: 1 }
    expect(new Settings.Path("a.b.d").set(a: b: c: 1, null)).toEqual { a: b: c: 1 }
    expect(new Settings.Path("d").set(a: b: c: 1, null)).toEqual { a: b: c: 1 }

describe "Settings.Path.unset", ->
  it "should return appropriate values", ->
    expect(new Settings.Path("").unset(a: b: c: 1)).toEqual undefined
    expect(new Settings.Path("a").unset(a: b: c: 1)).toEqual { }
    expect(new Settings.Path("a.b").unset(a: b: c: 1)).toEqual { a: {} }
    expect(new Settings.Path("a.b.c").unset(a: b: c: 1)).toEqual { a: b: {} }
    expect(new Settings.Path("a.b.c.d").unset(a: b: c: 1)).toEqual { a: b: c: 1 }
    expect(new Settings.Path("a.b.d").unset(a: b: c: 1)).toEqual { a: b: c: 1 }
    expect(new Settings.Path("d").unset(a: b: c: 1)).toEqual { a: b: c: 1 }

describe "Settings.Path.toString", ->
  it "should return appropriate values", ->
    expect(new Settings.Path("").toString()).toEqual("")
    expect(new Settings.Path("a").toString()).toEqual("a")
    expect(new Settings.Path("a.b").toString()).toEqual("a.b")
    expect(new Settings.Path("[1][2]").toString()).toEqual("[1][2]")
    expect(new Settings.Path('["\\"bam\\" said the lady"]').toString()).toEqual('["\\"bam\\" said the lady"]')
    expect(new Settings.Path("['\\'bam\\' said the lady']").toString()).toEqual('["\\\'bam\\\' said the lady"]')
    expect(new Settings.Path("['a'][\"b\"]").toString()).toEqual("a.b")
    expect(new Settings.Path("['single quote \\' double quote \\\" backslash \\\\']").toString()).toEqual('["single quote \\\' double quote \\\" backslash \\\\"]')

describe "Settings.constructor", ->
  it "should create a new settings object", ->
    settings = new Settings { a: 1, b: 2, c: 3 }
    expect(settings.data).toEqual { a: 1, b: 2, c: 3 }

  it "should support nested objects", ->
    settings = new Settings a: b: c: 123
    expect(settings.data).toEqual a: b: c: 123

  it "should support path-style keys", ->
    settings = new Settings
      "a.b.c": 123
      "d.e.f": 234

    expect(settings.data).toEqual
      a: b: c: 123
      d: e: f: 234

  it "should create a settings object with the right keys", ->
    settings = new Settings
      a: b: c: 123
      "d.e": { f: 234, g: 345 }
      "d.e.f.h": 456

    expect(settings.data).toEqual
      a: b: c: 123
      d: e:
        f: h: 456
        g: 345

describe "Settings.get", ->
  it "should return a leaf value", ->
    expect((new Settings a: b: c: 123).get("a.b.c")).toEqual(123)

  it "should return a non-leaf value", ->
    expect((new Settings a: b: c: 123).get("a")).toEqual(b: c: 123)

  it "should return null for a missing value", ->
    expect((new Settings a: b: c: 123).get("a.c.e")).toEqual(null)

  it "should default to the provided value if necessary", ->
    expect((new Settings a: b: c: 123).get("a.b.c", 234)).toEqual(123)
    expect((new Settings a: b: c: 123).get("a.c.e", 234)).toEqual(234)

describe "Settings.set(key, value)", ->
  it "should set a new value", ->
    expect((new Settings a: 1).set("b", 2).data).toEqual({ a: 1, b: 2 })

  it "should overwrite an existing value", ->
    expect((new Settings a: 1).set("a", 2).data).toEqual({ a: 2 })

  it "should overwrite part of an existing value", ->
    expect((new Settings a: b: c: 1).set("a.b", 2).data).toEqual({ a: b: 2 })

describe "Settings.set(object)", ->
  it "should set a new value", ->
    expect((new Settings a: 1).set(b: 2).data).toEqual({ a: 1, b: 2 })

  it "should overwrite an existing value", ->
    expect((new Settings a: 1).set(a: 2).data).toEqual({ a: 2 })

  it "should overwrite part of an existing value", ->
    expect((new Settings a: b: c: 1).set("a.b": 2).data).toEqual({ a: b: 2 })

  it "should set multiple values", ->
    expect((new Settings a: b: c: 1).set({ "a.b": 2, d: 3 }).data).toEqual({ a: { b: 2 }, d: 3 })
