expt = new Myna.Experiment
  uuid:     "45923780-80ed-47c6-aa46-15e2ae7a0e8c"
  id:       "id"
  apiKey:   "092c90f6-a8f2-11e2-a2b9-7c6d628b25f7"
  settings: "myna.web.sticky": true
  variants: [
    { id: "a", settings: { buttons: "red"   }, weight: 0.2 }
    { id: "b", settings: { buttons: "green" }, weight: 0.4 }
    { id: "c", settings: { buttons: "blue"  }, weight: 0.6 }
  ]

for sticky in [false, true]
  initialized = (fn) ->
    return ->
      expt.callbacks = {}
      expt.settings.set("myna.web.sticky", sticky)
      expt.clearLastSuggestion()
      expt.unstick()
      expt.clearQueuedEvents()
      fn()

  describe "Myna.Experiment.suggest (#{(if sticky then 'sticky' else 'non-sticky')})", ->
    it "should suggest something", initialized ->
      withSuggestion expt, (variant) ->
        expect(variant).toBeInstanceOf(Myna.Variant)

    it "should save the last suggestion", initialized ->
      withSuggestion expt, (variant) ->
        expect(expt.loadLastSuggestion()).toBe(variant)

    it "should queue an event for upload", initialized ->
      finished = false

      withSuggestion expt, (variant) ->
        expect(eventSummaries(expt.loadQueuedEvents())).toEqual [
          [ "view", variant.id, null ],
        ]
        finished = true

      waitsFor -> finished
      runs -> expect(finished).toEqual(true)

    it "should #{if sticky then 'save' else 'NOT save'} save the sticky suggestion", initialized ->
      withSuggestion expt, (variant) ->
        if sticky
          expect(expt.loadStickySuggestion()).toBe(variant)
        else
          expect(expt.loadStickySuggestion()).toBe(null)

    it "should #{if sticky then 'queue' else 'NOT queue'} a second event for upload", initialized ->
      finished = false

      withSuggestion expt, (v1) ->
        withSuggestion expt, (v2) ->
          if sticky
            expect(eventSummaries(expt.loadQueuedEvents())).toEqual [
              [ "view", v1.id, null ]
            ]
          else
            expect(eventSummaries(expt.loadQueuedEvents())).toEqual [
              [ "view", v1.id, null ],
              [ "view", v2.id, null ]
            ]
          finished = true

      waitsFor -> finished
      runs -> expect(finished).toEqual(true)

    it "should #{if sticky then 'always suggest' else 'NOT always suggest'} the same thing the next time", initialized ->
      hasBeenDifferent = false

      for i in [1..10]
        do (finished = false) ->
          runs ->
            expt.unstick()
            withSuggestion expt, (v1) ->
              withSuggestion expt, (v2) ->
                hasBeenDifferent = hasBeenDifferent || (v1.id != v2.id)
                finished = true

          waitsFor -> finished

      runs ->
        expect(hasBeenDifferent).toEqual(if sticky then false else true)

    it "should be reset by unstick, offering new variants on future calls to suggest", initialized ->
      hasBeenDifferent = false

      for i in [1..10]
        do (finished = false) ->
          expt.unstick()
          withSuggestion expt, (v1) ->
            expt.unstick()
            withSuggestion expt, (v2) ->
              hasBeenDifferent = hasBeenDifferent || (v1 != v2)
              finished = true

          waitsFor -> finished

      runs -> expect(hasBeenDifferent).toEqual(true)

    it "should throw exceptions", initialized ->
      spyOn(expt, 'viewVariant').andCallFake(-> throw "spy exn")

      expect(-> expt.suggest()).toThrow()
