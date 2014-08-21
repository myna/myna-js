hash = require '../main/hash'

describe "hash.parse", ->
  it "should parse a blank hash", ->
    expect(hash.parse(null)).toEqual {}
    expect(hash.parse("")).toEqual {}
    expect(hash.parse("#")).toEqual {}

  it "should parse key value pairs", ->
    expect(hash.parse("a=b")).toEqual { a: "b" }
    expect(hash.parse("#c=d")).toEqual { c: "d" }
    expect(hash.parse("a=b&c=d")).toEqual { a: "b", c: "d" }

  it "should parse keys without values", ->
    expect(hash.parse("a")).toEqual { a: "a" }
    expect(hash.parse("#c")).toEqual { c: "c" }
    expect(hash.parse("a&c")).toEqual { a: "a", c: "c" }

  it "should decode escaped characters", ->
    expect(hash.parse(
      "a#{encodeURIComponent("=")}b#{encodeURIComponent("&")}c#{encodeURIComponent("=")}d"
    )).toEqual { "a=b&c=d": "a=b&c=d" }
    expect(hash.parse(
      "a#{encodeURIComponent("=")}b&c#{encodeURIComponent("=")}d"
    )).toEqual { "a=b" : "a=b", "c=d": "c=d" }
    expect(hash.parse(
      "a#{encodeURIComponent("=")}b=c#{encodeURIComponent("=")}d"
    )).toEqual { "a=b" : "c=d" }
