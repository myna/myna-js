describe "Config.extend", () ->
  it "should overwrite defaults with user provided values", () ->
    original = new Config("uuid")
    config = original.extend { baseurl: "https://www.example.com" }
    expect(original.baseurl).toBe("http://api.mynaweb.com")
    expect(config.baseurl).toBe("https://www.example.com")
