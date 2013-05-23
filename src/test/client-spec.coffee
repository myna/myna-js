describe "Client.constructor", ->
  it "should accept custom options", ->
    actual = new Myna.Client
      apiRoot:     "http://localhost:8080"
      apiKey:      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      experiments: []
