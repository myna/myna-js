createExpt = =>
  new Myna.Experiment
    uuid:       "45923780-80ed-47c6-aa46-15e2ae7a0e8c"
    id:         "id"
    accountId:  "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
    name:       "myexpt"
    visibility: "draft"
    created:    new Date(Date.UTC(2013, 1, 2, 3, 4, 5, 6))
    settings:   "myna.js.sticky": true
    variants: [
      { id: "a", settings: { buttons: "red"   }, weight: 0.2 }
      { id: "b", settings: { buttons: "green" }, weight: 0.4 }
      { id: "c", settings: { buttons: "blue"  }, weight: 0.6 }
    ]

describe "Myna.Experiment.get", ->
  expt = createExpt()

  it "should retrieve fields set directly on Experiment", ->
    expect(expt.get("uuid")).toEqual("45923780-80ed-47c6-aa46-15e2ae7a0e8c")
    expect(expt.get("id")).toEqual("id")
    expect(expt.get("accountId")).toEqual("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")
    expect(expt.get("name")).toEqual("myexpt")
    expect(expt.get("visibility")).toEqual("draft")

  it "should retrieve settings", ->
    expect(expt.get("settings.myna.js.sticky")).toEqual(true)

  it "should return null if a setting is missing", ->
    expect(expt.get("settings.myna.js.stocky")).toEqual(null)

describe "Myna.Experiment.set", ->
  expt = createExpt()

  capture = (keys, fn) ->
    events = []
    handler = (args...) -> events.push(args)
    expt.on(keys, handler)
    fn()
    expt.off(keys, handler)
    events

  it "should update fields set directly on Experiment", ->
    for field in [ "uuid", "id", "accountId", "name", "visibility", "created" ]
      expect(expt.set(field, field.toUpperCase()).get(field)).toEqual(field.toUpperCase())

  it "should update settings", ->
    expect(expt.set("settings.a.b.c", 123).settings.get("a.b.c")).toEqual(123)

  it "should delete settings if the value is null", ->
    expect(expt.set("settings.a.b.c", null).settings.get("a.b")).toEqual({})

  it "should trigger a generic change event", ->
    expect(capture("change", -> expt.set("uuid", "uuid2"))).toEqual [
      [ expt ]
    ]

  it "should trigger a field-specific change event", ->
    expect(capture("change:uuid", -> expt.set("uuid", "uuid3"))).toEqual [
      [ expt, "uuid3" ]
    ]

  it "should trigger change events on all setting prefixes", ->
    actual = capture("change change:settings change:settings.a change:settings.a.b change:settings.a.b.c", -> expt.set("settings.a.b.c", 321))
    # Remove experiment arguments to make the test output easier to read:
    expect(for item in actual then item.slice(1)).toEqual [
      [ 321 ]
      [ c: 321 ]
      [ b: c: 321 ]
      [ { myna: { js: sticky: true }, a: { b: c: 321 } } ]
      [ ]
    ]

describe "Myna.Experiment.toJSON", ->
  expt = createExpt()

  it "should return JSON", ->
    expect(expt.toJSON()).toBeDeeplyEqualTo
      typename   : "experiment"
      uuid       : "45923780-80ed-47c6-aa46-15e2ae7a0e8c"
      id         : "id"
      accountId  : "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      name       : "myexpt"
      visibility : "draft"
      created    : "2013-02-02T03:04:05.006Z"
      settings   :
        "": null
        myna: js: sticky: true
      variants:
        a:
          typename    : "variant"
          id          : "a"
          name        : undefined
          views       : undefined
          totalReward : undefined
          weight      : 0.2
          settings    :
            ""      : null
            buttons : "red"
        b:
          typename    : "variant"
          id          : "b"
          name        : undefined
          views       : undefined
          totalReward : undefined
          weight      : 0.4
          settings    :
            ""      : null
            buttons : "green"
        c:
          typename    : "variant"
          id          : "c"
          name        : undefined
          views       : undefined
          totalReward : undefined
          weight      : 0.6
          settings    :
            ""      : null
            buttons : "blue"
