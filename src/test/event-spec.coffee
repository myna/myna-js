expt = new Myna.Experiment
  uuid:     "45923780-80ed-47c6-aa46-15e2ae7a0e8c"
  id:       "id"
  settings: "myna.js.sticky": false
  variants: [
    { id: "variant1", weight: 0.5 }
    { id: "variant2", weight: 0.5 }
  ]

recorder = new Myna.Recorder
  apiKey:   "092c90f6-a8f2-11e2-a2b9-7c6d628b25f7"
  apiRoot:  testApiRoot

initialized = (fn) ->
  return ->
    expt.off()
    expt.unstick()
    recorder.off()
    recorder.listenTo(expt)
    recorder.clearQueuedEvents()
    recorder.semaphore = 0
    recorder.waiting = []

    calls = []

    logCalls = ->
      for call in calls
        Myna.log("...", call)

    expt.on 'beforeView', jasmine.createSpy('beforeView').andCallFake (args...) ->
      calls.push([ "beforeView", args... ])
      logCalls()

    expt.on 'view', jasmine.createSpy('view').andCallFake (args...) ->
      calls.push([ "view", args... ])
      logCalls()

    expt.on 'beforeReward', jasmine.createSpy('beforeReward').andCallFake (args...) ->
      calls.push([ "beforeReward", args... ])
      logCalls()

    expt.on 'reward', jasmine.createSpy('reward').andCallFake (args...) ->
      calls.push([ "reward", args... ])
      logCalls()

    recorder.on 'beforeSync', jasmine.createSpy('beforeSync').andCallFake (args...) ->
      calls.push([ "beforeSync", (for events in args then eventSummaries(events))... ])
      logCalls()

    recorder.on 'afterSync', jasmine.createSpy('afterSync').andCallFake (args...) ->
      calls.push([ "afterSync", (for events in args then eventSummaries(events))... ])
      logCalls()

    fn(calls, logCalls)

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

describe "events", ->
  it "should be called in the correct order", initialized (calls, logCalls) ->
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
      expt.suggest suggestCallback

    waitsFor ->
      rewardCallback.callCount > 0

    waits 250

    runs ->
      Myna.log("BLOCK 2")
      expect(for call in calls then call[0]).toEqual [
        "beforeView"
        "suggestCallback"
        "view"

        "beforeSync"
        "afterSync"

        "beforeReward"
        "beforeSync"
        "rewardCallback"
        "reward"
        "afterSync"
      ]

      expect(findCall(calls, "beforeView",      0)).toEqual([ "beforeView",      variant, true ])
      expect(findCall(calls, "suggestCallback", 0)).toEqual([ "suggestCallback", variant, true ])
      expect(findCall(calls, "view",            0)).toEqual([ "view",            variant, true ])
      expect(findCall(calls, "beforeSync",      0)).toEqual([ "beforeSync",      [[ 'view',   variant.id, null ]] ])
      expect(findCall(calls, "beforeReward",    0)).toEqual([ "beforeReward",    variant, 0.8, true ])
      expect(findCall(calls, "reward",          0)).toEqual([ "reward",          variant, 0.8, true ])
      expect(findCall(calls, "afterSync",       0)).toEqual([ "afterSync",       [[ 'view',   variant.id, null ]], [] ])
      expect(findCall(calls, "beforeSync",      1)).toEqual([ "beforeSync",      [[ 'reward', variant.id, 0.8  ]] ])
      expect(findCall(calls, "rewardCallback",  0)).toEqual([ "rewardCallback",  variant, 0.8, true ])
      expect(findCall(calls, "afterSync",       1)).toEqual([ "afterSync",       [[ 'reward', variant.id, 0.8  ]], [] ])

      @removeAllSpies()

describe "beforeView event", ->
  it "should be able to cancel a suggestion", initialized (calls, logCalls) ->
    variant  = null

    expt.off('beforeView')
    expt.on 'beforeView', jasmine.createSpy('beforeView').andCallFake (args...) ->
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

    runs -> expt.suggest suggestCallback

    waitsFor -> expt.eventHandlers['beforeView'][0].callCount > 0

    waits 250

    runs ->
      expect(for call in calls then call[0]).toEqual([ "beforeView" ])
      expect(findCall(calls, "beforeView", 0)).toEqual([ "beforeView", variant, true ])
      @removeAllSpies()

describe "beforeReward event", ->
  it "should be able to cancel a reward", initialized (calls, logCalls) ->
    variant  = null

    expt.off('beforeReward')
    expt.on 'beforeReward', jasmine.createSpy('beforeReward').andCallFake (args...) ->
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

    runs -> expt.suggest suggestCallback

    waitsFor -> expt.eventHandlers['beforeReward'][0].callCount > 0

    waits 250

    runs ->
      expect(for call in calls then call[0]).toEqual [
        "beforeView"
        "suggestCallback"
        "view"
        "beforeSync"
        "afterSync"
        "beforeReward"
      ]

      expect(findCall(calls, "beforeView",      0)).toEqual([ "beforeView",      variant, true ])
      expect(findCall(calls, "suggestCallback", 0)).toEqual([ "suggestCallback", variant, true ])
      expect(findCall(calls, "view",            0)).toEqual([ "view",            variant, true ])
      expect(findCall(calls, "beforeSync",      0)).toEqual([ "beforeSync",      [[ 'view', variant.id, null ]] ])
      expect(findCall(calls, "beforeReward",    0)).toEqual([ "beforeReward",    variant, 0.8, true ])
      expect(findCall(calls, "afterSync",       0)).toEqual([ "afterSync",       [], [[ 'view', variant.id, null ]] ])

      @removeAllSpies()
