Client = require '../../main/client'
base   = require '../spec-base'

describe "Client.constructor", ->
  it "should accept custom options", ->
    actual = new Client
      apiRoot:     base.testApiRoot
      apiKey:      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      experiments: []
