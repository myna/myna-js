describe "Client.constructor", ->
  it "should accept custom options", ->
    actual = new Myna.Client
      apiRoot:     testApiRoot
      apiKey:      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      experiments: []
