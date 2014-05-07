describe "Myna.init", ->
  it "should create a client", ->
    client = Myna.init
      apiKey:   "092c90f6-a8f2-11e2-a2b9-7c6d628b25f7"
      apiRoot:  testApiRoot
      experiments: [
        {
          uuid:     "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
          id:       "a"
          settings: "myna.web.sticky": false
          variants: [
            { id: 'variant1', weight: 0.4 }
            { id: 'variant2', weight: 0.6 }
          ]
        }
        {
          uuid:     "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
          id:       "b"
          settings: "myna.web.sticky": true
          variants: [
            { id: 'foo', weight: 0.2 }
            { id: 'bar', weight: 0.8 }
          ]
        }
      ]

    expect(client).toBeInstanceOf(Myna.Client)

    expect(client.experiments.a).toBeInstanceOf(Myna.Experiment)
    expect(client.experiments.b).toBeInstanceOf(Myna.Experiment)

    expect(client.experiments.a.variants.variant1).toBeInstanceOf(Myna.Variant)
    expect(client.experiments.a.variants.variant2).toBeInstanceOf(Myna.Variant)
    expect(client.experiments.b.variants.foo).toBeInstanceOf(Myna.Variant)
    expect(client.experiments.b.variants.bar).toBeInstanceOf(Myna.Variant)

describe "Myna.initRemote", ->
  it "should create a client", ->
    client = null

    runs ->
      Myna.initRemote
        apiKey:  "092c90f6-a8f2-11e2-a2b9-7c6d628b25f7"
        apiRoot: testApiRoot
        success: (c) -> client = c

    waitsFor -> client

    runs ->
      expect(client).toBeInstanceOf(Myna.Client)

      for id, expt of client.experiments
        Myna.log(" - ", id, expt)

      expect(client.experiments.test).toBeInstanceOf(Myna.Experiment)

      expect(client.experiments.test.variants.variant1).toBeInstanceOf(Myna.Variant)
      expect(client.experiments.test.variants.variant2).toBeInstanceOf(Myna.Variant)

describe "Myna.initLocal", ->
  it "should call error callback on error", ->
    failed = false

    Myna.initLocal
      apiKey:  "092c90f6-a8f2-11e2-a2b9-7c6d628b25f7"
      apiRoot: testApiRoot
      experiments: [1, 2, 3]
      success: () ->
        failed = false
      error: () ->
        failed = true

    expect(failed).toEqual("foo")

  it "should return a client on success", ->
    options =
      apiKey: "a88dfb8d-9f1e-4720-9652-f90ee84bebc5"
      apiRoot: "//api.mynaweb.com"
      experiments: [
        {
            "id": "cb170706-c23e-484a-a466-a0e96274e720",
            "subtype": "summary",
            "typename": "experiment",
            "uuid": "cb170706-c23e-484a-a466-a0e96274e720",
            "variants": [
                {
                    "id": "alt-1",
                    "name": "alt-1",
                    "typename": "variant",
                    "weight": 0.46534653465346537
                },
                {
                    "id": "alt-2",
                    "name": "alt-2",
                    "typename": "variant",
                    "weight": 0.5346534653465347
                }
            ]
        },
        {
            "id": "a5058261-2113-4175-a207-14312877ea32",
            "subtype": "summary",
            "typename": "experiment",
            "uuid": "a5058261-2113-4175-a207-14312877ea32",
            "variants": [
                {
                    "id": "alt1",
                    "name": "alt1",
                    "typename": "variant",
                    "weight": 0.47029702970297027
                },
                {
                    "id": "alt2",
                    "name": "alt2",
                    "typename": "variant",
                    "weight": 0.5297029702970297
                }
            ]
        }
    ],
    "latest": "//api.mynaweb.com/v2/deployment/89872263-bc27-4dd3-8015-820cfbbefb64/myna.json",
    "typename": "deployment",
    "uuid": "89872263-bc27-4dd3-8015-820cfbbefb64"
