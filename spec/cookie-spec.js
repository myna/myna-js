describe("Cookie", function(){

  it(".create should create a cookie as requested", function() {
    Cookie.erase("test")
    expect(Cookie.read("test")).toEqual(undefined)
    Cookie.create("test", "foo", 1)
    expect(Cookie.read("test")).toEqual("foo")
  })

  it("should only return cookies that exactly match the given name", function() {
    Cookie.erase("test")
    Cookie.create("test", "foo", 1)

    expect(Cookie.read("test")).toEqual("foo")
    expect(Cookie.read("t")).toEqual(undefined)
  })
})
