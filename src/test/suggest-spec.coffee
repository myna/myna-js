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

  createSuggestTests = (sticky) ->
    # Wrapper for a test that sets up the stickiness of expt
    # without having to mutate Jasmine's global beforeEach variable:
    initialized = (fn) ->
      return ->
        expt.settings.set("myna.sticky", sticky)
        expt.clearLastSuggestion()
        expt.unstick()
        fn()

    # Helper function - grabs a suggestion and passes it to the argument:
    withSuggestion = (fn) ->
      variant = null
      runs ->
        expt.suggest(
          (v) -> variant = v
          (args...) -> console.error("error in withSuggestion", args...)
        )
      waitsFor -> variant
      runs -> fn(variant)


    describe (if sticky then 'sticky' else 'non-sticky'), ->
      it "should suggest something", initialized ->
        withSuggestion (variant) ->
          expect(variant).toBeInstanceOf(Myna.Variant)

      it "should save the last suggestion", initialized ->
        withSuggestion (variant) ->
          expect(expt.loadLastSuggestion()).toBe(variant)

      it "should #{if sticky then 'save' else 'NOT save'} save the sticky suggestion", initialized ->
        withSuggestion (variant) ->
          if sticky
            expect(expt.loadStickySuggestion()).toBe(variant)
          else
            expect(expt.loadStickySuggestion()).toBe(null)

      it "should #{if sticky then 'queue' else 'NOT queue'} a view event for upload", initialized pending

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

      it "can be unstuck, offering new variants on future calls to suggest", initialized ->
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

        runs ->
          expect(hasBeenDifferent).toEqual(true)

      it "should call the error handler if an exeption is thrown", initialized ->
        spyOn(expt, 'view').andCallFake(-> throw "spy exn")

        success = false
        error = false

        runs ->
          expt.suggest((-> success = false), (-> error = true))

        waitsFor ->
          success || error

        runs ->
          expect(success).toEqual(false)
          expect(error).toEqual(true)
          @removeAllSpies()

      it "should run beforeSuggest, afterSuggest, beforeView, and afterView event handlers", initialized pending

  createSuggestTests(false)

  createSuggestTests(true)
