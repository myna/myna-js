settings   = require '../../main/common/settings'
Client     = require '../../main/client'
Experiment = require '../../main/client/experiment'
Recorder   = require '../../main/client/recorder'
Variant    = require '../../main/client/variant'
base       = require '../spec-base'

expt = new Experiment
  uuid:     "45923780-80ed-47c6-aa46-15e2ae7a0e8c"
  id:       "id"
  settings: myna: web: sticky: true
  variants: [
    { id: "a", settings: { buttons: "red"   }, weight: 0.2 }
    { id: "b", settings: { buttons: "green" }, weight: 0.4 }
    { id: "c", settings: { buttons: "blue"  }, weight: 0.6 }
  ]

client = new Client
  apiKey:   "092c90f6-a8f2-11e2-a2b9-7c6d628b25f7"
  apiRoot:  base.testApiRoot
  settings: "myna.web.autoSync":  false
  experiments: [ expt ]

recorder = new Recorder client

recorder.listenTo(expt)

for sticky in [false, true]
  initialized = (fn) ->
    return ->
      expt.callbacks = {}
      settings.set(expt.settings, "myna.web.sticky", sticky)
      expt.unstick()
      recorder.clearQueuedEvents()
      fn()
      @removeAllSpies()

  describe "Experiment.reward (#{(if sticky then 'sticky' else 'non-sticky')})", ->
    it "should reward the last suggestion", initialized ->
      base.withSuggestion expt, (variant) ->
        base.withReward expt, 0.8, ->
          expect(base.eventSummaries(recorder.queuedEvents())).toEqual [
            [ "view",   variant.id, null ],
            [ "reward", variant.id, 0.8  ]
          ]

    it "should clear the last suggestion", initialized ->
      base.withSuggestion expt, (variant) ->
        base.withReward expt, 0.8, ->
          expect(expt.loadLastView()).toEqual(null)

    it "should #{if sticky then 'save' else 'NOT save'} the sticky reward", initialized ->
      base.withSuggestion expt, (variant) ->
        base.withReward expt, 0.8, ->
          if sticky
            expect(expt.loadStickyReward()).toBe(variant)
          else
            expect(expt.loadStickyReward()).toBe(null)

    it "should queue a reward event for upload", initialized ->
      base.withSuggestion expt, (variant) ->
        expect(base.eventSummaries(recorder.queuedEvents())).toEqual [
          [ "view",   variant.id, null ]
        ]
        base.withReward expt, 0.8, ->
          expect(base.eventSummaries(recorder.queuedEvents())).toEqual [
            [ "view",   variant.id, null ],
            [ "reward", variant.id, 0.8  ]
          ]

    it "should guard against duplicate rewards", initialized ->
      finished = false

      base.withSuggestion expt, (variant) ->
        expect(variant).toBeInstanceOf(Variant)
        base.withReward expt, 0.8, ->
          base.withReward expt, 0.6, ->
            expect(base.eventSummaries(recorder.queuedEvents())).toEqual [
              [ "view",   variant.id, null ],
              [ "reward", variant.id, 0.8  ]
            ]
            finished = true

      waitsFor -> finished
      runs -> expect(finished).toEqual(true)

    it "should #{if sticky then 'NOT' else ''} enqueue events for successive suggest/reward cycles", initialized ->
      finished = false

      base.withSuggestion expt, (v1) ->
        expect(v1).toBeInstanceOf(Variant)
        base.withReward expt, 0.8, ->
          base.withSuggestion expt, (v2) ->
            base.withReward expt, 0.6, ->
              if sticky
                expect(v1.id).toEqual(v2.id)
                expect(base.eventSummaries(recorder.queuedEvents())).toEqual [
                  [ "view",   v1.id, null ],
                  [ "reward", v1.id, 0.8  ]
                ]
              else
                expect(base.eventSummaries(recorder.queuedEvents())).toEqual [
                  [ "view",   v1.id, null ],
                  [ "reward", v1.id, 0.8  ]
                  [ "view",   v2.id, null ],
                  [ "reward", v2.id, 0.6  ]
                ]
              finished = true

      waitsFor -> finished
      runs -> expect(finished).toEqual(true)

    it "should be reset by unstick, saving new events on future calls to reward", initialized ->
      base.withSuggestion expt, (v1) ->
        base.withReward expt, 0.8, ->
          expt.unstick()
          base.withSuggestion expt, (v2) ->
            base.withReward expt, 0.6, ->
              expect(base.eventSummaries(recorder.queuedEvents())).toEqual [
                [ "view",   v1.id, null ],
                [ "reward", v1.id, 0.8  ]
                [ "view",   v2.id, null ],
                [ "reward", v2.id, 0.6  ]
              ]
