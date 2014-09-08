settings        = require '../../main/common/settings'
DefaultClient   = require '../../main/client/default'
base            = require '../spec-base'

describe 'GaRecorder', ->
  beforeEach ->
    @expt = {
      uuid:     "45923780-80ed-47c6-aa46-15e2ae7a0e8c"
      id:       "id"
      settings: "myna.web.sticky": false
      variants: [
        { id: "variant1", weight: 0.5 }
        { id: "variant2", weight: 0.5 }
      ]
    }

    @client = new DefaultClient [ @expt ], {
      apiKey  : "092c90f6-a8f2-11e2-a2b9-7c6d628b25f7"
      apiRoot : base.testApiRoot
    }

    delete window._gaq
    return

  afterEach ->
    delete window._gaq
    return

  describe "view", ->
    it "should record view events", (done) ->
      window._gaq = []
      @client.suggest('id').then (viewed) =>
        expect(window._gaq).toEqual [
          ["_trackEvent", "myna", "id-view", viewed.id, null, false]
        ]
        done()

    it "should record reward events", (done) ->
      window._gaq = []
      @client.suggest('id').then (viewed) =>
        @client.reward('id').then (rewarded) =>
          expect(window._gaq).toEqual [
            ["_trackEvent", "myna", "id-view", viewed.id, null, false]
            ["_trackEvent", "myna", "id-reward", viewed.id, 100, true]
          ]
          done()

    it "should do nothing if GA is not running", (done) ->
      settings.set(@expt.settings, "myna.web.googleAnalytics.enabled", false)
      @client.suggest('id').then (viewed) =>
        @client.reward('id').then (rewarded) =>
          expect(window._gaq).toEqual undefined
          done()

    it "should do nothing if disabled", (done) ->
      window._gaq = []
      settings.set(@expt.settings, "myna.web.googleAnalytics.enabled", false)
      @client.suggest('id').then (viewed) =>
        @client.reward('id').then (rewarded) =>
          expect(window._gaq).toEqual []
          done()

    it "should allow the user to customise event names and reward multiplier", (done) ->
      window._gaq = []
      settings.set(@expt.settings, "myna.web.googleAnalytics", {
        viewEvent        : "foo"
        rewardEvent      : "bar"
        rewardMultiplier : 250
      })
      @client.suggest('id').then (viewed) =>
        # The reward should be rounded:
        @client.reward('id', 0.799999999).then (rewarded) =>
          expect(_gaq).toEqual [
            [ "_trackEvent", "myna", "foo", viewed.id,   null, false ]
            [ "_trackEvent", "myna", "bar", rewarded.id, 200,  true  ] # 0.8 * 250
          ]
          done()
