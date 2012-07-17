describe("Config.extend", function() {

  it("should overwrite defaults with user provided values", function() {
    var original = new Config("uuid");
    var config   = original.extend({baseurl: "https://www.example.com"})

    expect(original.baseurl).toBe("http://api.mynaweb.com")
    expect(config.baseurl).toBe("https://www.example.com")
  })

})
