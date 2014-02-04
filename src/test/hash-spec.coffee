describe "Myna.parseHashParams", ->
  it "should parse a blank hash", ->
    expect(Myna.parseHashParams(null)).toEqual {}
    expect(Myna.parseHashParams("")).toEqual {}
    expect(Myna.parseHashParams("#")).toEqual {}

  it "should parse key value pairs", ->
    expect(Myna.parseHashParams("a=b")).toEqual { a: "b" }
    expect(Myna.parseHashParams("#c=d")).toEqual { c: "d" }
    expect(Myna.parseHashParams("a=b&c=d")).toEqual { a: "b", c: "d" }

  it "should parse keys without values", ->
    expect(Myna.parseHashParams("a")).toEqual { a: "a" }
    expect(Myna.parseHashParams("#c")).toEqual { c: "c" }
    expect(Myna.parseHashParams("a&c")).toEqual { a: "a", c: "c" }

  it "should decode escaped characters", ->
    expect(Myna.parseHashParams(
      "a#{encodeURIComponent("=")}b#{encodeURIComponent("&")}c#{encodeURIComponent("=")}d"
    )).toEqual { "a=b&c=d": "a=b&c=d" }
    expect(Myna.parseHashParams(
      "a#{encodeURIComponent("=")}b&c#{encodeURIComponent("=")}d"
    )).toEqual { "a=b" : "a=b", "c=d": "c=d" }
    expect(Myna.parseHashParams(
      "a#{encodeURIComponent("=")}b=c#{encodeURIComponent("=")}d"
    )).toEqual { "a=b" : "c=d" }
