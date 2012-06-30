describe("Cookie", function(){

  it(".create should create a cookie as requested", function() {
    Cookie.erase("test")
    expect(Cookie.read("test")).toEqual([])
    Cookie.create("test", "foo", 1)
    expect(Cookie.read("test")).toEqual(["foo"])
  })
})
