describe "Myna.Experiment.reward", ->
  beforeEach ->
    this.addMatchers
      toBeInstanceOf: (expected) ->
        this.actual instanceof expected
      toBeImplemented: ->
        this.message = -> "#{this.actual} has not been written yet."
        false

  pending = ->
    expect("This test").toBeImplemented()

  expt = new Myna.Experiment
    uuid: "uuid"
    id: "id"
    settings:
      "myna.sticky": true
    variants:
      a: { settings: { buttons: "red"   }, weight: 0.2 }
      b: { settings: { buttons: "green" }, weight: 0.4 }
      c: { settings: { buttons: "blue"  }, weight: 0.6 }

  createTests = (sticky) ->
    # Wrapper for a test that sets up the stickiness of expt
    # without having to mutate Jasmine's global beforeEach variable:
    initialized = (fn) ->
      return ->
        expt.settings.set("myna.sticky", sticky)
        expt.clearLastSuggestion()
        expt.unstick()
        expt.clearQueuedEvents()
        fn()

    # Helper function - grabs a suggestion and passes it to the argument:
    withSuggestion = (fn) ->
      done = false
      variant = null
      runs ->
        expt.suggest(
          (v) ->
            variant = v
            done = true
          (args...) ->
            variant = null
            done = true
        )
      waitsFor -> done
      runs ->
        fn(variant)

    # Helper function - records a reward and calls the argument:
    withReward = (amount, fn) ->
      done = false
      runs ->
        expt.reward(
          amount
          -> done = true
          -> done = true
        )
      waitsFor -> done
      runs ->
        fn()

    eventSummaries = (events) ->
      for evt in events
        switch evt.typename
          when 'view'   then [ 'view', evt.variant, null ]
          when 'reward' then [ 'reward', evt.variant, evt.amount ]
          else [ 'error', evt ]

    describe (if sticky then 'sticky' else 'non-sticky'), ->
      it "should reward the last suggestion", initialized ->
        withSuggestion (variant) ->
          withReward 0.8, ->
            expect(eventSummaries(expt.loadQueuedEvents())).toEqual [
              [ "view",   variant.id, null ],
              [ "reward", variant.id, 0.8  ]
            ]

      it "should clear the last suggestion", initialized ->
        withSuggestion (variant) ->
          withReward 0.8, ->
            expect(expt.loadLastSuggestion()).toEqual(null)

      it "should #{if sticky then 'save' else 'NOT save'} the sticky reward", initialized ->
        withSuggestion (variant) ->
          withReward 0.8, ->
            if sticky
              expect(expt.loadStickyReward()).toBe(variant)
            else
              expect(expt.loadStickyReward()).toBe(null)

      it "should queue a reward event for upload", initialized ->
        withSuggestion (variant) ->
          expect(eventSummaries(expt.loadQueuedEvents())).toEqual [
            [ "view",   variant.id, null ]
          ]
          withReward 0.8, ->
            expect(eventSummaries(expt.loadQueuedEvents())).toEqual [
              [ "view",   variant.id, null ],
              [ "reward", variant.id, 0.8  ]
            ]

      it "should guard against duplicate rewards", initialized ->
        finished = false

        withSuggestion (variant) ->
          expect(variant).toBeInstanceOf(Myna.Variant)
          withReward 0.8, ->
            withReward 0.6, ->
              expect(eventSummaries(expt.loadQueuedEvents())).toEqual [
                [ "view",   variant.id, null ],
                [ "reward", variant.id, 0.8  ]
              ]
              finished = true

        waitsFor -> finished
        runs -> expect(finished).toEqual(true)

      it "should #{if sticky then 'NOT' else ''} enqueue events for successive suggest/reward cycles", initialized ->
        finished = false

        withSuggestion (v1) ->
          expect(v1).toBeInstanceOf(Myna.Variant)
          withReward 0.8, ->
            withSuggestion (v2) ->
              withReward 0.6, ->
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
        finished = false

        withSuggestion (v1) ->
          withReward 0.8, ->
            expt.unstick()
            withSuggestion (v2) ->
              withReward 0.6, ->
                expect(eventSummaries(expt.loadQueuedEvents())).toEqual [
                  [ "view",   v1.id, null ],
                  [ "reward", v1.id, 0.8  ]
                  [ "view",   v2.id, null ],
                  [ "reward", v2.id, 0.6  ]
                ]
                finished = true

        waitsFor -> finished
        runs -> expect(finished).toEqual(true)

      it "should run beforeReward and afterReward event handlers", initialized pending

  createTests(false)

  createTests(true)
