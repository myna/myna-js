describe "Myna.Settings.Path.constructor", ->
  it "should parse the empty string", ->
    expect(new Myna.Settings.Path("").nodes).toEqual([])

  it "should parse strings with valid JS identifiers", ->
    expect(new Myna.Settings.Path("a.b.c").nodes).toEqual([ "a", "b", "c" ])
    expect(new Myna.Settings.Path(".a.b.c").nodes).toEqual([ "a", "b", "c" ])

  it "should parse strings with valid numeric indices", ->
    expect(new Myna.Settings.Path("[1]").nodes).toEqual([ 1 ])
    expect(new Myna.Settings.Path("a[1]").nodes).toEqual([ "a", 1 ])
    expect(new Myna.Settings.Path("[1][2]").nodes).toEqual([ 1, 2 ])

  it "should parse strings with valid single quoted string indices", ->
    expect(new Myna.Settings.Path("['a']").nodes).toEqual([ "a" ])
    expect(new Myna.Settings.Path("a['b']").nodes).toEqual([ "a", "b" ])
    expect(new Myna.Settings.Path("['a']['b']").nodes).toEqual([ "a", "b" ])

  it "should parse strings with valid double quoted string indices", ->
    expect(new Myna.Settings.Path('["a"]').nodes).toEqual([ "a" ])
    expect(new Myna.Settings.Path('a["b"]').nodes).toEqual([ "a", "b" ])
    expect(new Myna.Settings.Path('["a"]["b"]').nodes).toEqual([ "a", "b" ])

  it "should parse complex paths", ->
    expect(new Myna.Settings.Path('a[1].b[2].c[3]').nodes).toEqual([ "a", 1, "b", 2, "c", 3 ])
    expect(new Myna.Settings.Path('a["b"].c[\'d\']').nodes).toEqual([ "a", "b", "c", "d" ])

  it "should cope with quotes and backslashes in strings", ->
    expect(new Myna.Settings.Path('["\\"bam\\" said the lady"]').nodes).toEqual [ '"bam" said the lady' ]
    expect(new Myna.Settings.Path("['\\'bam\\' said the lady']").nodes).toEqual [ "'bam' said the lady" ]
    expect(new Myna.Settings.Path("['single quote \\' double quote \\\" backslash \\\\']").nodes).toEqual [ 'single quote \' double quote " backslash \\' ]


describe "Myna.Settings.Path.get", ->
  it "should return appropriate values", ->
    expect(new Myna.Settings.Path("").get(a: b: c: 1)).toEqual(a: b: c: 1)
    expect(new Myna.Settings.Path("a").get(a: b: c: 1)).toEqual(b: c: 1)
    expect(new Myna.Settings.Path("a.b").get(a: b: c: 1)).toEqual(c: 1)
    expect(new Myna.Settings.Path("a.b.c").get(a: b: c: 1)).toEqual(1)
    expect(new Myna.Settings.Path("a.b.c.d").get(a: b: c: 1)).toEqual(null)
    expect(new Myna.Settings.Path("a.b.d").get(a: b: c: 1)).toEqual(null)
    expect(new Myna.Settings.Path("d").get(a: b: c: 1)).toEqual(null)

describe "Myna.Settings.Path.set", ->
  it "should return appropriate values", ->
    expect(new Myna.Settings.Path("").set(a: b: c: 1, "foo")).toEqual "foo"
    expect(new Myna.Settings.Path("a").set(a: b: c: 1, "foo")).toEqual { a: "foo" }
    expect(new Myna.Settings.Path("a.b").set(a: b: c: 1, "foo")).toEqual { a: b: "foo" }
    expect(new Myna.Settings.Path("a.b.c").set(a: b: c: 1, "foo")).toEqual { a: b: c: "foo" }
    expect(new Myna.Settings.Path("a.b.c.d").set(a: b: c: 1, "foo")).toEqual { a: b: c: d: "foo" }
    expect(new Myna.Settings.Path("a.b.d").set(a: b: c: 1, "foo")).toEqual { a: b: { c: 1, d: "foo" } }
    expect(new Myna.Settings.Path("d").set(a: b: c: 1, "foo")).toEqual { a: { b: c: 1 }, d: "foo" }

  it "should return appropriate valueswhen passed null", ->
    expect(new Myna.Settings.Path("").set(a: b: c: 1, null)).toEqual undefined
    expect(new Myna.Settings.Path("a").set(a: b: c: 1, null)).toEqual { }
    expect(new Myna.Settings.Path("a.b").set(a: b: c: 1, null)).toEqual { a: {} }
    expect(new Myna.Settings.Path("a.b.c").set(a: b: c: 1, null)).toEqual { a: b: {} }
    expect(new Myna.Settings.Path("a.b.c.d").set(a: b: c: 1, null)).toEqual { a: b: c: 1 }
    expect(new Myna.Settings.Path("a.b.d").set(a: b: c: 1, null)).toEqual { a: b: c: 1 }
    expect(new Myna.Settings.Path("d").set(a: b: c: 1, null)).toEqual { a: b: c: 1 }

describe "Myna.Settings.Path.unset", ->
  it "should return appropriate values", ->
    expect(new Myna.Settings.Path("").unset(a: b: c: 1)).toEqual undefined
    expect(new Myna.Settings.Path("a").unset(a: b: c: 1)).toEqual { }
    expect(new Myna.Settings.Path("a.b").unset(a: b: c: 1)).toEqual { a: {} }
    expect(new Myna.Settings.Path("a.b.c").unset(a: b: c: 1)).toEqual { a: b: {} }
    expect(new Myna.Settings.Path("a.b.c.d").unset(a: b: c: 1)).toEqual { a: b: c: 1 }
    expect(new Myna.Settings.Path("a.b.d").unset(a: b: c: 1)).toEqual { a: b: c: 1 }
    expect(new Myna.Settings.Path("d").unset(a: b: c: 1)).toEqual { a: b: c: 1 }

describe "Myna.Settings.Path.toString", ->
  it "should return appropriate values", ->
    expect(new Myna.Settings.Path("").toString()).toEqual("")
    expect(new Myna.Settings.Path("a").toString()).toEqual("a")
    expect(new Myna.Settings.Path("a.b").toString()).toEqual("a.b")
    expect(new Myna.Settings.Path("[1][2]").toString()).toEqual("[1][2]")
    expect(new Myna.Settings.Path('["\\"bam\\" said the lady"]').toString()).toEqual('["\\"bam\\" said the lady"]')
    expect(new Myna.Settings.Path("['\\'bam\\' said the lady']").toString()).toEqual('["\\\'bam\\\' said the lady"]')
    expect(new Myna.Settings.Path("['a'][\"b\"]").toString()).toEqual("a.b")
    expect(new Myna.Settings.Path("['single quote \\' double quote \\\" backslash \\\\']").toString()).toEqual('["single quote \\\' double quote \\\" backslash \\\\"]')

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
