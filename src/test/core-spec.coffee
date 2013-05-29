describe "Myna.trim", ->
  it "should trim a string", ->
    expect(Myna.trim("a")).toEqual("a")
    expect(Myna.trim("a ")).toEqual("a")
    expect(Myna.trim(" a")).toEqual("a")
    expect(Myna.trim("\t\r\n a \t\r\n")).toEqual("a")

describe "Myna.extend", ->
  it "should add keys to an object", ->
    expect(Myna.extend({ a: 1 }, { b: 2 }, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 })

  it "should overwrite keys in earlier arguments", ->
    expect(Myna.extend({ a: 1 }, { a: 2 }, { a: 3 })).toEqual({ a: 3 })

  it "mutate the first argument but leave other arguments intact", ->
    foo = { a: 1 }
    bar = { a: 2 }
    baz = { a: 3 }
    Myna.extend(foo, bar, baz)
    expect(foo).toEqual({ a: 3 })
    expect(bar).toEqual({ a: 2 })
    expect(baz).toEqual({ a: 3 })

describe "Myna.deleteKeys", ->
  it "should delete keys from an object", ->
    expect(Myna.deleteKeys({ a: 1, b: 2, c: 3 }, "a", "c")).toEqual({ b: 2 })

  it "should leave the argument object intact", ->
    foo = { a: 1, b: 2, c: 3 }
    bar = Myna.deleteKeys(foo, "a", "c")
    expect(bar).toEqual({ b: 2 })

describe "Myna.{dateToString, stringToDate}", ->
  it "should behave the same as native Date functions", ->
    date = new Date()
    expect(Myna.dateToString(date)).toEqual(date.toISOString())

  it "should work on a date outside DST", ->
    str  = "2013-01-01T02:03:04.005Z"
    date = new Date(2013, 0, 1, 2, 3, 4, 5)
    expect(Myna.dateToString(date)).toEqual(str)
    expect(Myna.stringToDate(str)).toEqual(date)
    expect(Myna.dateToString(Myna.stringToDate(str))).toEqual(str)
    expect(Myna.stringToDate(Myna.dateToString(date))).toEqual(date)

  it "should work on a date inside DST", ->
    str  = "2013-06-01T01:03:04.005Z"
    date = new Date(2013, 5, 1, 2, 3, 4, 5)
    expect(Myna.dateToString(date)).toEqual(str)
    expect(Myna.stringToDate(str)).toEqual(date)
    # expect(Myna.dateToString(Myna.stringToDate(str))).toEqual(str)
    # expect(Myna.stringToDate(Myna.dateToString(date))).toEqual(date)

  it "should work on today's date", ->
    date = new Date()
    expect(Myna.stringToDate(Myna.dateToString(date))).toEqual(date)
