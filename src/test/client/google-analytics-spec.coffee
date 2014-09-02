settings        = require '../../main/common/settings'
Client          = require '../../main/client'
Experiment      = require '../../main/client/experiment'
GoogleAnalytics = require '../../main/client/google-analytics'
base            = require '../spec-base'

expt = new Experiment
  uuid:     "45923780-80ed-47c6-aa46-15e2ae7a0e8c"
  id:       "id"
  settings: myna: web: sticky: false
  variants: [
    { id: "variant1", weight: 0.5 }
    { id: "variant2", weight: 0.5 }
  ]

client = new Client
  apiKey:   "092c90f6-a8f2-11e2-a2b9-7c6d628b25f7"
  apiRoot:  base.testApiRoot
  experiments: [ expt ]

ga = new GoogleAnalytics client

initialized = (fn) ->
  return ->
    window._gaq = []
    expt.off()
    expt.unstick()
    ga.off()
    ga.listenTo(expt)
    settings.set(client.settings, "myna.web.googleAnalytics", null)
    fn()

describe "GoogleAnalytics.record", ->
  it "should record view events", initialized ->
    variant  = null
    success  = false
    error    = false

    base.withSuggestion expt, (v) ->
      variant = v

    waitsFor -> variant

    runs ->
      expect(_gaq).toEqual [
        ["_trackEvent", "myna", "id-view", variant.id, null, false]
      ]

  it "should record reward events", initialized ->
    variant  = null
    success  = false
    error    = false

    base.withSuggestion expt, (v) ->
      base.withReward expt, 1.0, ->
        variant = v

    waitsFor -> variant

    runs ->
      expect(_gaq).toEqual [
        ["_trackEvent", "myna", "id-view", variant.id, null, false]
        ["_trackEvent", "myna", "id-reward", variant.id, 100, true]
      ]

  it "should do nothing if disabled", initialized ->
    variant  = null
    success  = false
    error    = false

    settings.set(expt.settings, "myna.web.googleAnalytics.enabled", false)

    base.withSuggestion expt, (v) ->
      base.withReward expt, 1.0, ->
        variant = v

    waitsFor -> variant

    runs ->
      expect(_gaq).toEqual []

  it "should allow the user to customise event names and reward multiplier", initialized ->
    variant  = null
    success  = false
    error    = false

    settings.set(expt.settings, "myna.web.googleAnalytics", {
      viewEvent        : "foo"
      rewardEvent      : "bar"
      rewardMultiplier : 250
    })

    settings.set(client.settings, "myna.web.googleAnalytics.rewardEvent", "bar")

    base.withSuggestion expt, (v) ->
      base.withReward expt, 0.79999999999, -> # the final reward should be rounded
        variant = v

    waitsFor -> variant

    runs ->
      expect(_gaq).toEqual [
        ["_trackEvent", "myna", "foo", variant.id, null, false]
        ["_trackEvent", "myna", "bar", variant.id, 200, true] # 0.8 * 250
      ]
