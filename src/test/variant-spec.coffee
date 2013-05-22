describe "Myna.Variant.constructor", ->
  it "should accept custom options", ->
    variant = new Myna.Variant
      id: "id"
      settings: a: b: c: 1
      weight: 0.5
    expect(variant.id).toEqual("id")
    expect(variant.settings.data).toEqual(a: b: c: 1)
    expect(variant.weight).toEqual(0.5)

  it "should fail if no weight provided", ->
    expect(-> new Myna.Variant id: "id").toThrow()

  it "should provide sensible defaults", ->
    variant = new Myna.Variant
      id: "id"
      weight: 0.3
    expect(variant.id).toEqual("id")
    expect(variant.settings.data).toEqual({})
    expect(variant.weight).toEqual(0.3)
