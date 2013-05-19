describe "Myna.Experiment.suggest", ->
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
        expt.callbacks = {}
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
            expect("error callback was called with " + args).toEqual("success callback was called")
            done = true
        )
      waitsFor -> done
      runs ->
        fn(variant)

    eventSummaries = (events) ->
      for evt in events
        switch evt.typename
          when 'view'   then [ 'view', evt.variant, null ]
          when 'reward' then [ 'reward', evt.variant, evt.amount ]
          else [ 'error', evt ]

    describe (if sticky then 'sticky' else 'non-sticky'), ->
      it "should suggest something", initialized ->
        withSuggestion (variant) ->
          expect(variant).toBeInstanceOf(Myna.Variant)

      it "should save the last suggestion", initialized ->
        withSuggestion (variant) ->
          expect(expt.loadLastSuggestion()).toBe(variant)

      it "should queue an event for upload", initialized ->
        finished = false

        withSuggestion (variant) ->
          expect(eventSummaries(expt.loadQueuedEvents())).toEqual [
            [ "view",   variant.id, null ],
          ]
          finished = true

        waitsFor -> finished
        runs -> expect(finished).toEqual(true)

      it "should #{if sticky then 'save' else 'NOT save'} save the sticky suggestion", initialized ->
        withSuggestion (variant) ->
          if sticky
            expect(expt.loadStickySuggestion()).toBe(variant)
          else
            expect(expt.loadStickySuggestion()).toBe(null)

      it "should #{if sticky then 'queue' else 'NOT queue'} a second event for upload", initialized ->
        finished = false

        withSuggestion (v1) ->
          withSuggestion (v2) ->
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
              withSuggestion (v1) ->
                withSuggestion (v2) ->
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
            withSuggestion (v1) ->
              expt.unstick()
              withSuggestion (v2) ->
                hasBeenDifferent = hasBeenDifferent || (v1 != v2)
                finished = true

            waitsFor -> finished

        runs -> expect(hasBeenDifferent).toEqual(true)

      it "should call the error handler if an exeption is thrown", initialized ->
        spyOn(expt, 'view').andCallFake(-> throw "spy exn")

        success = false
        error = false

        runs -> expt.suggest((-> success = false), (-> error = true))

        waitsFor -> success || error

        runs ->
          expect(success).toEqual(false)
          expect(error).toEqual(true)
          @removeAllSpies()

      it "should run beforeSuggest, afterSuggest, beforeView, and afterView event handlers", initialized ->
        finished = false
        variant  = null

        beforeSuggest = jasmine.createSpy('beforeSuggest')
        afterSuggest  = jasmine.createSpy('afterSuggest')
        beforeView    = jasmine.createSpy('beforeView')
        afterView     = jasmine.createSpy('afterView')

        runs ->
          expt.callbacks = { beforeSuggest, afterSuggest, beforeView, afterView }
          expt.suggest (v) ->
            variant = v
            finished = true

        waitsFor -> finished

        runs ->
          expect(variant).toBeInstanceOf(Myna.Variant)
          expect(beforeSuggest).toHaveBeenCalledWith(variant, false)
          expect(afterSuggest).toHaveBeenCalledWith(variant, false)
          expect(beforeView).toHaveBeenCalledWith(variant)
          expect(afterView).toHaveBeenCalledWith(variant)

        runs ->
          finished = false
          expt.callbacks = { beforeSuggest, afterSuggest, beforeView, afterView }
          expt.suggest (v) ->
            variant = v
            finished = true

        waitsFor -> finished

        runs ->
          expect(variant).toBeInstanceOf(Myna.Variant)
          expect(beforeSuggest).toHaveBeenCalledWith(variant, if sticky then true else false)
          expect(afterSuggest).toHaveBeenCalledWith(variant, if sticky then true else false)
          expect(beforeView).toHaveBeenCalledWith(variant)
          expect(afterView).toHaveBeenCalledWith(variant)

      it "should allow beforeSuggest to cancel the suggestion", initialized ->
        finished = false
        variant  = null

        beforeSuggest = jasmine.createSpy('beforeSuggest').andCallFake ->
          Myna.log("CALLBACK")
          finished = true
          false

        runs ->
          expt.callbacks = { beforeSuggest }
          expt.suggest()

        waitsFor -> finished

        runs ->
          expect(expt.loadLastSuggestion()).toEqual(null)
          expect(expt.loadStickySuggestion()).toEqual(null)
          expect(eventSummaries(expt.loadQueuedEvents())).toEqual []

  createTests(false)

  createTests(true)
