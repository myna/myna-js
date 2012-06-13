describe("extend", function(){

  it("should add all keys from src if dest is empty", function() {
    var src = {
      foo: 1,
      bar: 2,
      baz: 4
    }

    var dest = extend({}, src);

    expect(dest).toEqual(src);
  })

  it("should add keys that aren't present in dest", function() {
    var dest = { foo: 3 }
    var src = {
      foo: 1,
      bar: 2,
      baz: 4
    }

    var newDest = extend(dest, src);

    expect(newDest).toEqual({ foo: 3, bar: 2, baz: 4 });
  })

  it("should mutate destination", function() {
    var dest = { foo: 3 }
    var src = {
      foo: 1,
      bar: 2,
      baz: 4
    }

    extend(dest, src);

    expect(dest).toEqual({ foo: 3, bar: 2, baz: 4 });
  })
})
