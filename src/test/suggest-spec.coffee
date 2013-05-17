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
    uuid: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
    name: "name"
    settings:
      sticky: true
    variants:
      a: { settings: { buttons: "red"   }, weight: 0.2 }
      b: { settings: { buttons: "green" }, weight: 0.4 }
      c: { settings: { buttons: "blue"  }, weight: 0.6 }

  for sticky in [false, true]

    beforeEach ->
      expt.settings.set("myna.sticky", sticky)
      expt.clearLastSuggestion()
      expt.unstick()

    # Helper function - grabs a suggestion and passes it to the argument:
    withSuggestion = (fn) ->
      variant = null
      runs -> expt.suggest (v) -> variant = v
      waitsFor (-> variant), "the suggestion", 100
      runs -> fn(variant)

    describe (if sticky then 'sticky' else 'non-sticky'), ->
      it "should suggest something", ->
        withSuggestion (variant) ->
          expect(variant).toBeInstanceOf(Myna.Variant)

      it "should save the last suggestion", ->
        withSuggestion (variant) ->
          expect(expt.loadLastSuggestion()).toBe(variant)

      it "should #{if sticky then 'save' else 'NOT save'} save the sticky suggestion", ->
        withSuggestion (variant) ->
          if sticky
            expect(expt.loadStickySuggestion()).toBe(variant)
          else
            expect(expt.loadStickySuggestion()).toBe(null)

      it "should queue a view event for upload", pending

      it "should #{if sticky then 'always suggest' else 'NOT always suggest'} the same thing the next time", ->
        hasBeenDifferent = false

        for i in [1..10]
          expt.unstick()
          withSuggestion (v1) -> withSuggestion (v2) ->
            hasBeenDifferent = hasBeenDifferent || v1 != v2

        expect(hasBeenDifferent).toEqual(if sticky then false else true)

      it "should NOT queue a second event for upload", pending

      it "should be reset by unstick", ->
        hasBeenDifferent = false

        for i in [1..10]
          expt.unstick()
          withSuggestion (v1) ->
            expt.unstick()
            withSuggestion (v2) ->
              hasBeenDifferent = hasBeenDifferent || v1 != v2

        expect(hasBeenDifferent).toEqual(if sticky then false else true)

      # it "should fail in all the same cases that myna-html does", pending
      # it "should handle server timeout", pending
      # it "should run beforeSuggest, afterSuggest, beforeView, and afterView event handlers", pending

    # describe "non-sticky", ->
    #   expt.settings.set("myna.sticky", false)

    #   it "should suggest something", pending
    #   it "should save the last suggestion", pending
    #   it "should NOT save the sticky suggestion", pending
    #   it "should queue a view event for upload", pending
    #   it "should NOT suggest the same thing the next time", pending
    #   it "should queue a second event for upload", pending
    #   it "should allow unstick to be called without effect", pending
    #   it "should fail in all the same cases that myna-html does", pending
    #   # handle server timeout
    #   # run beforeSuggest, afterSuggest, beforeView, and afterView event handlers

  # describe "Experiment.suggest", ->
  #   testUuid = "45923780-80ed-47c6-aa46-15e2ae7a0e8c"
  #   experiment = null

  #   beforeEach ->
  #     experiment = new Experiment(testUuid)
  #     return

  #   it "should return a suggestion when asked to", ->
  #     flag = false
  #     result = false

  #     runs ->
  #       experiment.suggest(
  #         (suggestion) ->
  #           flag = true
  #           result = suggestion
  #           return
  #         (error) ->
  #           flag = true
  #           result = error
  #           return
  #       )

  #     waitsFor (-> flag), "The suggestion should return", 500

  #     runs ->
  #       expect(result.choice).toBeTruthy()
  #       expect(result.token).toBeTruthy()

  #   it "should handle errors on an invalid UUID", ->
  #     flag = false
  #     result = false

  #     runs ->
  #       new Experiment("br0ken").suggest(
  #         (suggestion) ->
  #           flag = true
  #           result = suggestion
  #           return
  #         (error) ->
  #           flag = true
  #           result = error
  #           return
  #       )

  #     waitsFor (-> flag), "the suggestion to return", 500

  #     runs ->
  #       console.log(result)
  #       expect(result.typename).toBe('problem')
  #       expect(result.subtype).toBe(400)
  #       expect(result.messages).toBeTruthy()

  #   it "should handle timeouts when the server doesn't respond", ->
  #     flag = false
  #     result = false

  #     runs ->
  #       new Experiment("br0ken", { baseurl: "http://example.com/" }).suggest(
  #         (suggestion) ->
  #           flag = true
  #           result = suggestion
  #           return
  #         (error) ->
  #           flag = true
  #           result = error
  #           return
  #       )

  #     waitsFor (-> flag), "the suggestion to return", 1400

  #     runs ->
  #       console.log(result)
  #       expect(result.typename).toBe('problem')
  #       expect(result.subtype).toBe(500)
  #       expect(result.messages).toBeTruthy()
  #       expect(result.messages[0].typename).toBe('timeout')

  #   it "should run suggest event handlers when making a suggestion", ->
  #     count = 0
  #     evts = []
  #     flag = false
  #     result = null

  #     runs ->
  #       handler = (expt, suggestion) ->
  #         count++
  #         evts.push [expt, suggestion]
  #         return

  #       Myna.onsuggest.push(handler, handler)

  #       experiment.suggest(
  #         (suggestion) ->
  #           flag = true
  #           result = suggestion
  #           return
  #         (error) ->
  #           flag = true
  #           result = error
  #           return
  #       )

  #     waitsFor (-> flag), "The suggestion should return", 500

  #     runs ->
  #       Myna.onsuggest.pop()
  #       Myna.onsuggest.pop()
  #       expect(count).toBe(2)
  #       expect(evts.length).toBe(2)
  #       expect(evts[0]).toEqual([experiment, result])
  #       expect(evts[1]).toEqual([experiment, result])

  #   it "should run suggest event handlers on error", ->
  #     count = 0
  #     evts = []
  #     flag = false
  #     result = null
  #     experiment = new Experiment("br0ken")

  #     runs ->
  #       handler = (expt, suggestion) ->
  #         count++
  #         evts.push [expt, suggestion]
  #         return

  #       Myna.onsuggest.push(handler, handler)

  #       experiment.suggest(
  #         (suggestion) ->
  #           flag = true
  #           result = suggestion
  #           return
  #         (error) ->
  #           flag = true
  #           result = error
  #           return
  #       )

  #     waitsFor (-> flag), "The suggestion should return", 500

  #     runs ->
  #       expect(count).toBe(2)
  #       expect(evts.length).toBe(2)
  #       expect(evts[0]).toEqual([experiment, result])
  #       expect(evts[1]).toEqual([experiment, result])
