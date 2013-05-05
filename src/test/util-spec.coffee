describe "extend", ->
  it "should add all keys from src if dest is empty", ->
    src = { foo: 1, bar: 2, baz: 4 }
    dest = extend({}, src)
    expect(dest).toEqual(src)

  it "should add keys that aren't present in dest", ->
    dest = { foo: 3 }
    src = { foo: 1, bar: 2, baz: 4 }
    newDest = extend(dest, src)
    expect(newDest).toEqual({ foo: 3, bar: 2, baz: 4 })

  it "should mutate destination", ->
    dest = { foo: 3 }
    src = { foo: 1, bar: 2, baz: 4 }
    extend(dest, src)
    expect(dest).toEqual({ foo: 3, bar: 2, baz: 4 })
