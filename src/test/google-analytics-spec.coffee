expt = window.expt = new Myna.Experiment
  uuid:     "45923780-80ed-47c6-aa46-15e2ae7a0e8c"
  id:       "id"
  settings: "myna.js.sticky": false
  variants: [
    { id: "variant1", weight: 0.5 }
    { id: "variant2", weight: 0.5 }
  ]

client = new Myna.Client
  apiKey:   "092c90f6-a8f2-11e2-a2b9-7c6d628b25f7"
  apiRoot:  testApiRoot
  experiments: [ expt ]

ga = new Myna.GoogleAnalytics client

initialized = (fn) ->
  return ->
    window._gaq = []
    expt.off()
    expt.unstick()
    ga.off()
    ga.listenTo(expt)
    client.settings.set("myna.googleAnalytics", null)
    fn()

describe "Myna.GoogleAnalytics.record", ->
  it "should record view events", initialized ->
    variant  = null
    success  = false
    error    = false

    withSuggestion expt, (v) ->
      variant = v

    waitsFor -> variant

    runs ->
      expect(_gaq).toEqual [
        ["_trackEvent", "myna", "id-view", variant.id]
      ]

  it "should record reward events", initialized ->
    variant  = null
    success  = false
    error    = false

    withSuggestion expt, (v) ->
      withReward expt, 1.0, ->
        variant = v

    waitsFor -> variant

    runs ->
      expect(_gaq).toEqual [
        ["_trackEvent", "myna", "id-view", variant.id]
        ["_trackEvent", "myna", "id-reward", variant.id, 100]
      ]

  it "should do nothing if disabled", initialized ->
    variant  = null
    success  = false
    error    = false

    expt.settings.set("myna.web.googleAnalytics.enabled", false)

    withSuggestion expt, (v) ->
      withReward expt, 1.0, ->
        variant = v

    waitsFor -> variant

    runs ->
      expect(_gaq).toEqual []

  it "should allow the user to customise event names and reward multiplier", initialized ->
    variant  = null
    success  = false
    error    = false

    expt.settings.set "myna.web.googleAnalytics",
      viewEvent: "foo"
      rewardEvent: "bar"
      rewardMultiplier: 250

    client.settings.set("myna.web.googleAnalytics.rewardEvent", "bar")

    withSuggestion expt, (v) ->
      withReward expt, 0.79999999999, -> # the final reward should be rounded
        variant = v

    waitsFor -> variant

    runs ->
      expect(_gaq).toEqual [
        ["_trackEvent", "myna", "foo", variant.id]
        ["_trackEvent", "myna", "bar", variant.id, 200] # 0.8 * 250
      ]
