describe "Variant.constructor", ->
  it "should accept custom options", ->
    variant = new Myna.Variant "name",
      settings: a: b: c: 1
      weight: 0.5
    expect(variant.name).toEqual("name")
    expect(variant.settings.data).toEqual(a: b: c: 1)
    expect(variant.weight).toEqual(0.5)

  it "should fail if no weight provided", ->
    expect(-> new Myna.Variant "name").toThrow()

  it "should provide sensible defaults", ->
    variant = new Myna.Variant "name", weight: 0.3
    expect(variant.name).toEqual("name")
    expect(variant.settings.data).toEqual({})
    expect(variant.weight).toEqual(0.3)
