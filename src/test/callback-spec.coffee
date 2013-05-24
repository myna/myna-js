expt = new Myna.Experiment
  uuid:     "45923780-80ed-47c6-aa46-15e2ae7a0e8c"
  id:       "id"
  apiKey:   "092c90f6-a8f2-11e2-a2b9-7c6d628b25f7"
  apiRoot:  "http://localhost:8080"
  settings: "myna.web.sticky": false
  variants: [
    { id: "variant1", weight: 0.5 }
    { id: "variant2", weight: 0.5 }
  ]

initialized = (fn) ->
  return ->
    expt.clearLastSuggestion()
    expt.unstick()
    expt.clearQueuedEvents()
    expt.recordInProgress = false
    expt.waitingToRecord = []

    calls = []
    callbacks = {}

    logCalls = ->
      for call in calls
        Myna.log("...", call)

    callbacks.beforeSuggest = jasmine.createSpy('beforeSuggest').andCallFake (args...) ->
      calls.push([ "beforeSuggest", args... ])
      logCalls()

    callbacks.afterSuggest = jasmine.createSpy('afterSuggest').andCallFake (args...) ->
      calls.push([ "afterSuggest", args... ])
      logCalls()

    callbacks.beforeView = jasmine.createSpy('beforeView').andCallFake (args...) ->
      calls.push([ "beforeView", args... ])
      logCalls()

    callbacks.afterView = jasmine.createSpy('afterView').andCallFake (args...) ->
      calls.push([ "afterView", args... ])
      logCalls()

    callbacks.beforeReward = jasmine.createSpy('beforeReward').andCallFake (args...) ->
      calls.push([ "beforeReward", args... ])
      logCalls()

    callbacks.afterReward = jasmine.createSpy('afterReward').andCallFake (args...) ->
      calls.push([ "afterReward", args... ])
      logCalls()

    callbacks.beforeRecord = jasmine.createSpy('beforeRecord').andCallFake (args...) ->
      calls.push([ "beforeRecord", (for events in args then eventSummaries(events))... ])
      logCalls()

    callbacks.afterRecord = jasmine.createSpy('afterRecord').andCallFake (args...) ->
      calls.push([ "afterRecord", (for events in args then eventSummaries(events))... ])
      logCalls()

    fn(calls, callbacks, logCalls)

findCall = (calls, name, index) ->
  counter = 0
  for call in calls when call[0] == name
    if counter == index
      return call
    else
      counter++
  return null

indexOfCall = (calls, name) ->
  for index, call in calls when call[0] == name
    return index
  return null

describe "callbacks", ->
  it "should be called in the correct order", initialized (calls, callbacks, logCalls) ->
    variant = null

    rewardCallback = jasmine.createSpy('rewardCallback').andCallFake (args...) ->
      calls.push([ "rewardCallback", args... ])
      logCalls()

    suggestCallback = jasmine.createSpy('suggestCallback').andCallFake (args...) ->
      calls.push([ "suggestCallback", args... ])
      logCalls()
      variant = arguments[0]
      window.setTimeout( (-> expt.reward(0.8, rewardCallback)), 500 )

    runs ->
      Myna.log("BLOCK 1")
      expt.callbacks = callbacks
      expt.suggest suggestCallback

    waitsFor ->
      rewardCallback.callCount > 0

    waits 250

    runs ->
      Myna.log("BLOCK 2")
      expect(for call in calls then call[0]).toEqual [
        "beforeSuggest"
        "beforeView"
        "suggestCallback"
        "afterView"
        "afterSuggest"

        "beforeRecord"
        "afterRecord"

        "beforeReward"
        "beforeRecord"
        "rewardCallback"
        "afterReward"
        "afterRecord"
      ]

      expect(findCall(calls, "beforeSuggest",   0)).toEqual([ "beforeSuggest",   variant, false ])
      expect(findCall(calls, "beforeView",      0)).toEqual([ "beforeView",      variant, false ])
      expect(findCall(calls, "suggestCallback", 0)).toEqual([ "suggestCallback", variant, false ])
      expect(findCall(calls, "afterView",       0)).toEqual([ "afterView",       variant, false ])
      expect(findCall(calls, "afterSuggest",    0)).toEqual([ "afterSuggest",    variant, false ])
      expect(findCall(calls, "beforeRecord",    0)).toEqual([ "beforeRecord",    [[ 'view',   variant.id, null ]] ])
      expect(findCall(calls, "beforeReward",    0)).toEqual([ "beforeReward",    variant, 0.8, false ])
      expect(findCall(calls, "afterReward",     0)).toEqual([ "afterReward",     variant, 0.8, false ])
      expect(findCall(calls, "afterRecord",     0)).toEqual([ "afterRecord",     [[ 'view',   variant.id, null ]], [] ])
      expect(findCall(calls, "beforeRecord",    1)).toEqual([ "beforeRecord",    [[ 'reward', variant.id, 0.8  ]] ])
      expect(findCall(calls, "rewardCallback",  0)).toEqual([ "rewardCallback",  variant, 0.8, false ])
      expect(findCall(calls, "afterRecord",     1)).toEqual([ "afterRecord",     [[ 'reward', variant.id, 0.8  ]], [] ])

      @removeAllSpies()

describe "beforeSuggest callback", ->
  it "should be able to cancel a suggestion", initialized (calls, callbacks, logCalls) ->
    variant  = null

    callbacks.beforeSuggest = jasmine.createSpy('beforeSuggest').andCallFake (args...) ->
      calls.push([ "beforeSuggest", args... ])
      variant = arguments[0]
      false

    rewardCallback = jasmine.createSpy('rewardCallback').andCallFake (args...) ->
      calls.push([ "rewardCallback", args... ])
      logCalls()

    suggestCallback = jasmine.createSpy('suggestCallback').andCallFake (args...) ->
      calls.push([ "suggestCallback", args... ])
      logCalls()
      window.setTimeout( (-> expt.reward(0.8, rewardCallback)), 0 )

    runs ->
      expt.callbacks = callbacks
      expt.suggest suggestCallback

    waitsFor -> callbacks.beforeSuggest.callCount > 0

    waits 250

    runs ->
      expect(for call in calls then call[0]).toEqual [
        "beforeSuggest"
        # "beforeView"
        # "suggestCallback"
        # "afterView"
        # "afterSuggest"
        # "beforeRecord"
        # "beforeReward"
        # "afterReward"
        # "afterRecord"
        # "beforeRecord"
        # "rewardCallback"
        # "afterRecord"
      ]

      expect(findCall(calls, "beforeSuggest", 0)).toEqual([ "beforeSuggest", variant, false ])

      @removeAllSpies()

describe "beforeView callback", ->
  it "should be able to cancel a suggestion", initialized (calls, callbacks, logCalls) ->
    variant  = null

    callbacks.beforeView = jasmine.createSpy('beforeView').andCallFake (args...) ->
      calls.push([ "beforeView", args... ])
      variant = arguments[0]
      false

    rewardCallback = jasmine.createSpy('rewardCallback').andCallFake (args...) ->
      calls.push([ "rewardCallback", args... ])
      logCalls()

    suggestCallback = jasmine.createSpy('suggestCallback').andCallFake (args...) ->
      calls.push([ "suggestCallback", args... ])
      logCalls()
      window.setTimeout( (-> expt.reward(0.8, rewardCallback)), 0 )

    runs ->
      expt.callbacks = callbacks
      expt.suggest suggestCallback

    waitsFor -> callbacks.beforeSuggest.callCount > 0

    waits 250

    runs ->
      expect(for call in calls then call[0]).toEqual [
        "beforeSuggest"
        "beforeView"
        # "suggestCallback"
        # "afterView"
        # "afterSuggest"
        # "beforeRecord"
        # "beforeReward"
        # "afterReward"
        # "afterRecord"
        # "beforeRecord"
        # "rewardCallback"
        # "afterRecord"
      ]

      expect(findCall(calls, "beforeSuggest", 0)).toEqual([ "beforeSuggest", variant, false ])
      expect(findCall(calls, "beforeView",    0)).toEqual([ "beforeView",    variant, false ])

      @removeAllSpies()

describe "beforeReward callback", ->
  it "should be able to cancel a reward", initialized (calls, callbacks, logCalls) ->
    variant  = null

    callbacks.beforeReward = jasmine.createSpy('beforeReward').andCallFake (args...) ->
      calls.push([ "beforeReward", args... ])
      variant = arguments[0]
      false

    rewardCallback = jasmine.createSpy('rewardCallback').andCallFake (args...) ->
      calls.push([ "rewardCallback", args... ])
      logCalls()

    suggestCallback = jasmine.createSpy('suggestCallback').andCallFake (args...) ->
      calls.push([ "suggestCallback", args... ])
      logCalls()
      window.setTimeout( (-> expt.reward(0.8, rewardCallback)), 500 )

    runs ->
      expt.callbacks = callbacks
      expt.suggest suggestCallback

    waitsFor -> callbacks.beforeReward.callCount > 0

    waits 250

    runs ->
      expect(for call in calls then call[0]).toEqual [
        "beforeSuggest"
        "beforeView"
        "suggestCallback"
        "afterView"
        "afterSuggest"
        "beforeRecord"
        "afterRecord"
        "beforeReward"
      ]

      expect(findCall(calls, "beforeSuggest",   0)).toEqual([ "beforeSuggest",   variant, false ])
      expect(findCall(calls, "beforeView",      0)).toEqual([ "beforeView",      variant, false ])
      expect(findCall(calls, "suggestCallback", 0)).toEqual([ "suggestCallback", variant, false ])
      expect(findCall(calls, "afterView",       0)).toEqual([ "afterView",       variant, false ])
      expect(findCall(calls, "afterSuggest",    0)).toEqual([ "afterSuggest",    variant, false ])
      expect(findCall(calls, "beforeRecord",    0)).toEqual([ "beforeRecord",    [[ 'view', variant.id, null ]] ])
      expect(findCall(calls, "beforeReward",    0)).toEqual([ "beforeReward",    variant, 0.8, false ])
      expect(findCall(calls, "afterRecord",     0)).toEqual([ "afterRecord",     [[ 'view', variant.id, null ]], [] ])

      @removeAllSpies()
