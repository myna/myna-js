expt = new Myna.Experiment
  uuid:     "45923780-80ed-47c6-aa46-15e2ae7a0e8c"
  id:       "id"
  apiKey:   "092c90f6-a8f2-11e2-a2b9-7c6d628b25f7"
  settings:
    "myna.web.sticky": true
    "myna.web.autoRecord": false
  variants:
    a: { settings: { buttons: "red"   }, weight: 0.2 }
    b: { settings: { buttons: "green" }, weight: 0.4 }
    c: { settings: { buttons: "blue"  }, weight: 0.6 }

for sticky in [false, true]
  initialized = (fn) ->
    return ->
      expt.callbacks = {}
      expt.settings.set("myna.web.sticky", sticky)
      expt.clearLastSuggestion()
      expt.unstick()
      expt.clearQueuedEvents()
      fn()

  describe "Myna.Experiment.reward (#{(if sticky then 'sticky' else 'non-sticky')})", ->
    it "should reward the last suggestion", initialized ->
      withSuggestion expt, (variant) ->
        withReward expt, 0.8, ->
          expect(eventSummaries(expt.loadQueuedEvents())).toEqual [
            [ "view",   variant.id, null ],
            [ "reward", variant.id, 0.8  ]
          ]

    it "should clear the last suggestion", initialized ->
      withSuggestion expt, (variant) ->
        withReward expt, 0.8, ->
          expect(expt.loadLastSuggestion()).toEqual(null)

    it "should #{if sticky then 'save' else 'NOT save'} the sticky reward", initialized ->
      withSuggestion expt, (variant) ->
        withReward expt, 0.8, ->
          if sticky
            expect(expt.loadStickyReward()).toBe(variant)
          else
            expect(expt.loadStickyReward()).toBe(null)

    it "should queue a reward event for upload", initialized ->
      withSuggestion expt, (variant) ->
        expect(eventSummaries(expt.loadQueuedEvents())).toEqual [
          [ "view",   variant.id, null ]
        ]
        withReward expt, 0.8, ->
          expect(eventSummaries(expt.loadQueuedEvents())).toEqual [
            [ "view",   variant.id, null ],
            [ "reward", variant.id, 0.8  ]
          ]

    it "should guard against duplicate rewards", initialized ->
      finished = false

      withSuggestion expt, (variant) ->
        expect(variant).toBeInstanceOf(Myna.Variant)
        withReward expt, 0.8, ->
          withReward expt, 0.6, ->
            expect(eventSummaries(expt.loadQueuedEvents())).toEqual [
              [ "view",   variant.id, null ],
              [ "reward", variant.id, 0.8  ]
            ]
            finished = true

      waitsFor -> finished
      runs -> expect(finished).toEqual(true)

    it "should #{if sticky then 'NOT' else ''} enqueue events for successive suggest/reward cycles", initialized ->
      finished = false

      withSuggestion expt, (v1) ->
        expect(v1).toBeInstanceOf(Myna.Variant)
        withReward expt, 0.8, ->
          withSuggestion expt, (v2) ->
            withReward expt, 0.6, ->
              if sticky
                expect(v1.id).toEqual(v2.id)
                expect(eventSummaries(expt.loadQueuedEvents())).toEqual [
                  [ "view",   v1.id, null ],
                  [ "reward", v1.id, 0.8  ]
                ]
              else
                expect(eventSummaries(expt.loadQueuedEvents())).toEqual [
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
              expect(eventSummaries(expt.loadQueuedEvents())).toEqual [
                [ "view",   v1.id, null ],
                [ "reward", v1.id, 0.8  ]
                [ "view",   v2.id, null ],
                [ "reward", v2.id, 0.6  ]
              ]

    it "should run beforeReward and afterReward event handlers", initialized ->
      suggested = false
      rewarded = false
      variant  = null

      beforeReward = jasmine.createSpy('beforeReward')
      afterReward  = jasmine.createSpy('afterReward')

      runs ->
        Myna.log("SECTION A")
        expt.callbacks = { beforeReward, afterReward }
        expt.suggest (v) ->
          variant = v
          suggested = true

      waitsFor -> suggested

      runs ->
        Myna.log("SECTION B")
        expt.reward 0.8, ->
          rewarded = true

      waitsFor -> rewarded

      runs ->
        Myna.log("SECTION C")
        expect(beforeReward).toHaveBeenCalledWith(variant, 0.8, false)
        expect(afterReward).toHaveBeenCalledWith(variant, 0.8, false)

        suggested = false
        rewarded = false
        expt.callbacks = { beforeReward, afterReward }

        expt.suggest (v) ->
          variant = v
          suggested = true

      waitsFor -> suggested

      runs =>
        expt.reward 0.6, ->
          rewarded = true

      waitsFor -> rewarded

      runs ->
        expect(variant).toBeInstanceOf(Myna.Variant)
        expect(beforeReward).toHaveBeenCalledWith(variant, 0.6, if sticky then true else false)
        expect(afterReward).toHaveBeenCalledWith(variant, 0.6, if sticky then true else false)

    it "should allow beforeReward to cancel the reward", initialized ->
      suggested = false
      rewarded = false
      variant  = null

      beforeReward = jasmine.createSpy('beforeSuggest').andCallFake ->
        rewarded = true
        false

      runs ->
        expt.callbacks = { beforeReward }
        expt.suggest (v) ->
          variant = v
          suggested = true

      waitsFor -> suggested

      runs ->
        expt.reward 0.8, ->
          rewarded = true

      waitsFor -> rewarded

      runs ->
        expect(variant).toBeInstanceOf(Myna.Variant)
        expect(expt.loadLastSuggestion()).toEqual(variant)
        expect(expt.loadLastReward()).toEqual(null)
        expect(expt.loadStickySuggestion()).toEqual(if sticky then variant else null)
        expect(expt.loadStickyReward()).toEqual(null)
        expect(eventSummaries(expt.loadQueuedEvents())).toEqual [
          [ 'view', variant.id, null ]
        ]
