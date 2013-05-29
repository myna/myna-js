createVariant = ->
  new Myna.Variant
    id          : "a"
    name        : "my variant"
    views       : 2
    totalReward : 1.0
    weight      : 0.5
    settings    : a: b: c: 123

describe "Myna.Variant.get", ->
  variant = createVariant()

  it "should retrieve fields set directly on Variant", ->
    expect(variant.get("id")).toEqual("a")
    expect(variant.get("name")).toEqual("my variant")
    expect(variant.get("views")).toEqual(2)
    expect(variant.get("totalReward")).toEqual(1.0)
    expect(variant.get("weight")).toEqual(0.5)

  it "should retrieve settings", ->
    expect(variant.get("settings.a.b.c")).toEqual(123)

  it "should return null if a setting is missing", ->
    expect(variant.get("settings.a.b.d")).toEqual(null)

describe "Myna.Variant.set", ->
  variant = createVariant()

  capture = (keys, fn) ->
    events = []
    handler = (args...) -> events.push(args)
    variant.on(keys, handler)
    fn()
    variant.off(keys, handler)
    events

  it "should update fields set directly on Variant", ->
    for field in [ "id", "name", "views", "totalReward", "weight" ]
      expect(variant.set(field, field.toUpperCase()).get(field)).toEqual(field.toUpperCase())

  it "should update settings", ->
    expect(variant.set("settings.foo.bar", "baz").settings.get("foo.bar")).toEqual("baz")

  it "should delete settings if the value is null", ->
    expect(variant.set("settings.a.b.c", null).settings.get("a.b")).toEqual({})

  it "should trigger a generic change event", ->
    expect(capture("change", -> variant.set("id", "id2"))).toEqual [
      [ variant ]
    ]

  it "should trigger a field-specific change event", ->
    expect(capture("change:id", -> variant.set("id", "id3"))).toEqual [
      [ variant, "id3" ]
    ]

  it "should trigger change events on all setting prefixes", ->
    actual = capture("change change:settings change:settings.a change:settings.a.b change:settings.a.b.c", -> variant.set("settings.a.b.c", 321))
    # Remove experiment arguments to make the test output easier to read:
    expect(for item in actual then item.slice(1)).toEqual [
      [ 321 ]
      [ c: 321 ]
      [ b: c: 321 ]
      [ { foo: { bar: "baz" }, a: { b: c: 321 } } ]
      [ ]
    ]

describe "Myna.Variant.toJSON", ->
  variant = createVariant()

  it "should return JSON", ->
    expect(variant.toJSON()).toBeDeeplyEqualTo
      typename    : "variant"
      id          : "a"
      name        : "my variant"
      views       : 2
      totalReward : 1.0
      weight      : 0.5
      settings    :
        ""     : null
        a: b: c: 123
