Experiment = require '../app/experiment'
Client     = require '../app/client'
Recorder   = require '../app/recorder'
Variant    = require '../app/variant'

expt = new Experiment
  uuid:     "45923780-80ed-47c6-aa46-15e2ae7a0e8c"
  id:       "id"
  settings: "myna.web.sticky": true
  variants: [
    { id: "a", settings: { buttons: "red"   }, weight: 0.2 }
    { id: "b", settings: { buttons: "green" }, weight: 0.4 }
    { id: "c", settings: { buttons: "blue"  }, weight: 0.6 }
  ]

client = new Client
  apiKey:   "092c90f6-a8f2-11e2-a2b9-7c6d628b25f7"
  apiRoot:  testApiRoot
  settings: "myna.web.autoSync":  false
  experiments: [ expt ]

recorder = new Recorder client

recorder.listenTo(expt)

for sticky in [false, true]
  initialized = (fn) ->
    return ->
      expt.callbacks = {}
      expt.settings.set("myna.web.sticky", sticky)
      expt.unstick()
      recorder.clearQueuedEvents()
      fn()
      @removeAllSpies()

  describe "Experiment.reward (#{(if sticky then 'sticky' else 'non-sticky')})", ->
    it "should reward the last suggestion", initialized ->
      withSuggestion expt, (variant) ->
        withReward expt, 0.8, ->
          expect(eventSummaries(recorder.queuedEvents())).toEqual [
            [ "view",   variant.id, null ],
            [ "reward", variant.id, 0.8  ]
          ]

    it "should clear the last suggestion", initialized ->
      withSuggestion expt, (variant) ->
        withReward expt, 0.8, ->
          expect(expt.loadLastView()).toEqual(null)

    it "should #{if sticky then 'save' else 'NOT save'} the sticky reward", initialized ->
      withSuggestion expt, (variant) ->
        withReward expt, 0.8, ->
          if sticky
            expect(expt.loadStickyReward()).toBe(variant)
          else
            expect(expt.loadStickyReward()).toBe(null)

    it "should queue a reward event for upload", initialized ->
      withSuggestion expt, (variant) ->
        expect(eventSummaries(recorder.queuedEvents())).toEqual [
          [ "view",   variant.id, null ]
        ]
        withReward expt, 0.8, ->
          expect(eventSummaries(recorder.queuedEvents())).toEqual [
            [ "view",   variant.id, null ],
            [ "reward", variant.id, 0.8  ]
          ]

    it "should guard against duplicate rewards", initialized ->
      finished = false

      withSuggestion expt, (variant) ->
        expect(variant).toBeInstanceOf(Variant)
        withReward expt, 0.8, ->
          withReward expt, 0.6, ->
            expect(eventSummaries(recorder.queuedEvents())).toEqual [
              [ "view",   variant.id, null ],
              [ "reward", variant.id, 0.8  ]
            ]
            finished = true

      waitsFor -> finished
      runs -> expect(finished).toEqual(true)

    it "should #{if sticky then 'NOT' else ''} enqueue events for successive suggest/reward cycles", initialized ->
      finished = false

      withSuggestion expt, (v1) ->
        expect(v1).toBeInstanceOf(Variant)
        withReward expt, 0.8, ->
          withSuggestion expt, (v2) ->
            withReward expt, 0.6, ->
              if sticky
                expect(v1.id).toEqual(v2.id)
                expect(eventSummaries(recorder.queuedEvents())).toEqual [
                  [ "view",   v1.id, null ],
                  [ "reward", v1.id, 0.8  ]
                ]
              else
                expect(eventSummaries(recorder.queuedEvents())).toEqual [
                  [ "view",   v1.id, null ],
                  [ "reward", v1.id, 0.8  ]
                  [ "view",   v2.id, null ],
                  [ "reward", v2.id, 0.6  ]
                ]
              finished = true

      waitsFor -> finished
      runs -> expect(finished).toEqual(true)

    it "should be reset by unstick, saving new events on future calls to reward", initialized ->
      withSuggestion expt, (v1) ->
        withReward expt, 0.8, ->
          expt.unstick()
          withSuggestion expt, (v2) ->
            withReward expt, 0.6, ->
              expect(eventSummaries(recorder.queuedEvents())).toEqual [
                [ "view",   v1.id, null ],
                [ "reward", v1.id, 0.8  ]
                [ "view",   v2.id, null ],
                [ "reward", v2.id, 0.6  ]
              ]
