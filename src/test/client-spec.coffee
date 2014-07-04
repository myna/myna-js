Client = require '../app/client'

describe "Client.constructor", ->
  it "should accept custom options", ->
    actual = new Client
      apiRoot:     testApiRoot
      apiKey:      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      experiments: []
