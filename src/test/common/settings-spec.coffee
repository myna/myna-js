settings = require '../../main/common/settings'
Path     = require '../../main/common/settings/path'

describe "Path.constructor", ->
  it "should parse the empty string", ->
    expect(new Path("").nodes).toEqual([])

  it "should parse strings with valid JS identifiers", ->
    expect(new Path("a.b.c").nodes).toEqual([ "a", "b", "c" ])
    expect(new Path(".a.b.c").nodes).toEqual([ "a", "b", "c" ])

  it "should parse strings with valid numeric indices", ->
    expect(new Path("[1]").nodes).toEqual([ 1 ])
    expect(new Path("a[1]").nodes).toEqual([ "a", 1 ])
    expect(new Path("[1][2]").nodes).toEqual([ 1, 2 ])

  it "should parse strings with valid single quoted string indices", ->
    expect(new Path("['a']").nodes).toEqual([ "a" ])
    expect(new Path("a['b']").nodes).toEqual([ "a", "b" ])
    expect(new Path("['a']['b']").nodes).toEqual([ "a", "b" ])

  it "should parse strings with valid double quoted string indices", ->
    expect(new Path('["a"]').nodes).toEqual([ "a" ])
    expect(new Path('a["b"]').nodes).toEqual([ "a", "b" ])
    expect(new Path('["a"]["b"]').nodes).toEqual([ "a", "b" ])

  it "should parse complex paths", ->
    expect(new Path('a[1].b[2].c[3]').nodes).toEqual([ "a", 1, "b", 2, "c", 3 ])
    expect(new Path('a["b"].c[\'d\']').nodes).toEqual([ "a", "b", "c", "d" ])

  it "should cope with quotes and backslashes in strings", ->
    expect(new Path('["\\"bam\\" said the lady"]').nodes).toEqual [ '"bam" said the lady' ]
    expect(new Path("['\\'bam\\' said the lady']").nodes).toEqual [ "'bam' said the lady" ]
    expect(new Path("['single quote \\' double quote \\\" backslash \\\\']").nodes).toEqual [ 'single quote \' double quote " backslash \\' ]

describe "Path.get", ->
  it "should return appropriate values", ->
    expect(new Path("").get(a: b: c: 1)).toEqual(a: b: c: 1)
    expect(new Path("a").get(a: b: c: 1)).toEqual(b: c: 1)
    expect(new Path("a.b").get(a: b: c: 1)).toEqual(c: 1)
    expect(new Path("a.b.c").get(a: b: c: 1)).toEqual(1)
    expect(new Path("a.b.c.d").get(a: b: c: 1)).toEqual(undefined)
    expect(new Path("a.b.d").get(a: b: c: 1)).toEqual(undefined)
    expect(new Path("d").get(a: b: c: 1)).toEqual(undefined)

describe "Path.set", ->
  it "should return appropriate values", ->
    expect(new Path("").set(a: b: c: 1, "foo")).toEqual "foo"
    expect(new Path("a").set(a: b: c: 1, "foo")).toEqual { a: "foo" }
    expect(new Path("a.b").set(a: b: c: 1, "foo")).toEqual { a: b: "foo" }
    expect(new Path("a.b.c").set(a: b: c: 1, "foo")).toEqual { a: b: c: "foo" }
    expect(new Path("a.b.c.d").set(a: b: c: 1, "foo")).toEqual { a: b: c: d: "foo" }
    expect(new Path("a.b.d").set(a: b: c: 1, "foo")).toEqual { a: b: { c: 1, d: "foo" } }
    expect(new Path("d").set(a: b: c: 1, "foo")).toEqual { a: { b: c: 1 }, d: "foo" }

  it "should return appropriate values when passed null", ->
    expect(new Path("").set(a: b: c: 1, null)).toEqual undefined
    expect(new Path("a").set(a: b: c: 1, null)).toEqual { }
    expect(new Path("a.b").set(a: b: c: 1, null)).toEqual { a: {} }
    expect(new Path("a.b.c").set(a: b: c: 1, null)).toEqual { a: b: {} }
    expect(new Path("a.b.c.d").set(a: b: c: 1, null)).toEqual { a: b: c: 1 }
    expect(new Path("a.b.d").set(a: b: c: 1, null)).toEqual { a: b: c: 1 }
    expect(new Path("d").set(a: b: c: 1, null)).toEqual { a: b: c: 1 }

describe "Path.unset", ->
  it "should return appropriate values", ->
    expect(new Path("").unset(a: b: c: 1)).toEqual undefined
    expect(new Path("a").unset(a: b: c: 1)).toEqual { }
    expect(new Path("a.b").unset(a: b: c: 1)).toEqual { a: {} }
    expect(new Path("a.b.c").unset(a: b: c: 1)).toEqual { a: b: {} }
    expect(new Path("a.b.c.d").unset(a: b: c: 1)).toEqual { a: b: c: 1 }
    expect(new Path("a.b.d").unset(a: b: c: 1)).toEqual { a: b: c: 1 }
    expect(new Path("d").unset(a: b: c: 1)).toEqual { a: b: c: 1 }

describe "Path.toString", ->
  it "should return appropriate values", ->
    expect(new Path("").toString()).toEqual("")
    expect(new Path("a").toString()).toEqual("a")
    expect(new Path("a.b").toString()).toEqual("a.b")
    expect(new Path("[1][2]").toString()).toEqual("[1][2]")
    expect(new Path('["\\"bam\\" said the lady"]').toString()).toEqual('["\\"bam\\" said the lady"]')
    expect(new Path("['\\'bam\\' said the lady']").toString()).toEqual('["\\\'bam\\\' said the lady"]')
    expect(new Path("['a'][\"b\"]").toString()).toEqual("a.b")
    expect(new Path("['single quote \\' double quote \\\" backslash \\\\']").toString()).toEqual('["single quote \\\' double quote \\\" backslash \\\\"]')

describe "create", ->
  it "should create a new settings object", ->
    data = settings.create { a: 1, b: 2, c: 3 }
    expect(data).toEqual { a: 1, b: 2, c: 3 }

  it "should support nested objects", ->
    data = settings.create a: b: c: 123
    expect(data).toEqual a: b: c: 123

  it "should support path-style keys", ->
    data = settings.create
      "a.b.c": 123
      "d.e.f": 234

    expect(data).toEqual
      a: b: c: 123
      d: e: f: 234

  it "should create a settings object with the right keys", ->
    data = settings.create
      a: b: c: 123
      "d.e": { f: 234, g: 345 }
      "d.e.f.h": 456

    expect(data).toEqual
      a: b: c: 123
      d: e:
        f: h: 456
        g: 345

describe "get", ->
  it "should return a leaf value", ->
    expect(settings.get({ a: b: c: 123 }, "a.b.c")).toEqual(123)

  it "should return a non-leaf value", ->
    expect(settings.get({ a: b: c: 123 }, "a")).toEqual(b: c: 123)

  it "should return undefined for a missing value", ->
    expect(settings.get({ a: b: c: 123 }, "a.c.e")).toEqual(undefined)

  it "should default to the provided value if necessary", ->
    expect(settings.get({ a: b: c: 123 }, "a.b.c", 234)).toEqual(123)
    expect(settings.get({ a: b: c: 123 }, "a.c.e", 234)).toEqual(234)

describe "set(data, key, value)", ->
  it "should set a new value", ->
    expect(settings.set({ a: 1 }, "b", 2)).toEqual({ a: 1, b: 2 })

  it "should overwrite an existing value", ->
    expect(settings.set({ a: 1 }, "a", 2)).toEqual({ a: 2 })

  it "should overwrite part of an existing value", ->
    expect(settings.set({ a: b: c: 1 }, "a.b", 2)).toEqual({ a: b: 2 })

describe "set(data, updates)", ->
  it "should set a new value", ->
    expect(settings.set({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 })

  it "should overwrite an existing value", ->
    expect(settings.set({ a: 1 }, { a: 2 })).toEqual({ a: 2 })

  it "should overwrite part of an existing value", ->
    expect(settings.set({ a: b: c: 1 }, { "a.b": 2 })).toEqual({ a: b: 2 })

  it "should set multiple values", ->
    expect(settings.set({ a: b: c: 1 }, { "a.b": 2, d: 3 })).toEqual({ a: { b: 2 }, d: 3 })
