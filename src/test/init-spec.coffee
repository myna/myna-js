log        = require '../main/log'
Client     = require '../main/client'
Experiment = require '../main/experiment'
Variant    = require '../main/variant'
Myna       = require '../main/myna-js'

deployment =
  apiKey: "092c90f6-a8f2-11e2-a2b9-7c6d628b25f7"
  apiRoot: "//api.mynaweb.com"
  experiments: [
    {
      id: "experiment1"
      subtype: "summary"
      typename: "experiment"
      uuid: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      variants: [
        {
          id: "variant1"
          name: "variant-1"
          typename: "variant"
          weight: 0.46534653465346537
        }
        {
          id: "variant2"
          name: "variant-2"
          typename: "variant"
          weight: 0.5346534653465347
        }
      ]
    }
    {
      id: "experiment2",
      subtype: "summary",
      typename: "experiment",
      uuid: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      variants: [
        {
          id: "variant1",
          name: "variant-1",
          typename: "variant",
          weight: 0.47029702970297027
        }
        {
          id: "variant2",
          name: "variant-2",
          typename: "variant",
          weight: 0.5297029702970297
        }
      ]
    }
  ]
  latest: "//api.mynaweb.com/v2/deployment/89872696-bc27-4dd3-8015-820cfbbefb64/myna.json"
  typename: "deployment"
  uuid: "89872696-bc27-4dd3-8015-820cfbbefb64"


describe "Myna.init", ->
  it "should create a client", ->
    client = null
    deployment.success = (c) -> client = c
    deployment.error = (exn) -> client = exn

    runs ->
      Myna.init(deployment)

    waitsFor -> client != null

    runs ->
      expect(client).toBeInstanceOf(Client)

      expect(client.experiments.experiment1).toBeInstanceOf(Experiment)
      expect(client.experiments.experiment2).toBeInstanceOf(Experiment)

      expect(client.experiments.experiment1.variants.variant1).toBeInstanceOf(Variant)
      expect(client.experiments.experiment1.variants.variant2).toBeInstanceOf(Variant)
      expect(client.experiments.experiment2.variants.variant1).toBeInstanceOf(Variant)
      expect(client.experiments.experiment2.variants.variant2).toBeInstanceOf(Variant)

describe "Myna.initRemote", ->
  it "should create a client", ->
    client = null

    runs ->
      Myna.initRemote
        apiKey:  "092c90f6-a8f2-11e2-a2b9-7c6d628b25f7"
        url:     "http://deploy.mynaweb.com/2482b9f5-bd7c-1f8b-5c4a-3b2bf51ed06a/myna.json"
        success: (c) -> client = c
        failure: (exn) -> client = false

    waitsFor -> client != null

    runs ->
      expect(client).toBeInstanceOf(Client)

      for id, expt of client.experiments
        log.debug(" - ", id, expt)

      expect(client.experiments.test).toBeInstanceOf(Experiment)

      expect(client.experiments.test.variants.variant1).toBeInstanceOf(Variant)
      expect(client.experiments.test.variants.variant2).toBeInstanceOf(Variant)

describe "Myna.initLocal", ->
  it "should raise an exception on error", ->
    init = ->
      Myna.initLocal()

    expect(init).toThrow()

  it "should return a client on success", ->
    client = Myna.initLocal(deployment)

    expect(client).toBeInstanceOf(Client)
    expect(client.experiments.experiment1).toBeInstanceOf(Experiment)
    expect(client.experiments.experiment2).toBeInstanceOf(Experiment)

    expect(client.experiments.experiment1.variants.variant1).toBeInstanceOf(Variant)
    expect(client.experiments.experiment1.variants.variant2).toBeInstanceOf(Variant)
    expect(client.experiments.experiment2.variants.variant1).toBeInstanceOf(Variant)
    expect(client.experiments.experiment2.variants.variant2).toBeInstanceOf(Variant)
