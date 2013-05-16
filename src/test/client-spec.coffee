describe "Client.constructor", ->
  it "should accept custom options", ->
    actual = new Myna.Client
      apiRoot:     "http://api.mynaweb.com"
      apiKey:      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      experiments: []
