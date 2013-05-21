expt = new Myna.Experiment
  uuid:     "45923780-80ed-47c6-aa46-15e2ae7a0e8c"
  id:       "id"
  apiKey:   "092c90f6-a8f2-11e2-a2b9-7c6d628b25f7"
  apiRoot:  "http://localhost:8080"
  settings: "myna.sticky": false
  variants:
    variant1: weight: 0.5
    variant2: weight: 0.5

initialized = (fn) ->
  return ->
    expt.callbacks = {}
    expt.clearLastSuggestion()
    expt.unstick()
    expt.clearQueuedEvents()
    expt.recordInProgress = false
    expt.waitingToRecord = []
    fn()

recordState = (expt) -> [
  expt.loadQueuedEvents().length,
  expt.recordSemaphore,
  expt.waitingToRecord.length
]

describe "Myna.Experiment.record", ->
  it "should record a single event", initialized ->
    variant  = null
    success  = false

    withSuggestion expt, (v) ->
      variant = v

    waitsFor -> variant

    runs ->
      expect(recordState(expt)).toEqual([ 1, 0, 0 ])
      expt.record ->
        expect(recordState(expt)).toEqual([ 0, 1, 0 ])
        success = true

    waitsFor -> success

    runs ->
      expect(recordState(expt)).toEqual([ 0, 0, 0 ])
      @removeAllSpies()

  it "should record multiple events", initialized ->
    variant1 = null
    variant2 = null
    success  = false

    withSuggestion expt, (v1) ->
      withReward expt, 1.0, ->
        withSuggestion expt, (v2) ->
          withReward expt, 1.0, ->
            variant1 = v1
            variant2 = v2

    waitsFor -> variant1 && variant2

    runs ->
      expect(recordState(expt)).toEqual([ 4, 0, 0 ])
      expt.record ->
        expect(recordState(expt)).toEqual([ 0, 1, 0 ])
        success = true

    waitsFor -> success

    runs ->
      expect(recordState(expt)).toEqual([ 0, 0, 0 ])

  it "should schedule extra requests if record is called multiple times in parallel", initialized ->
    # Myna.log statements show the likely order of execution.

    variant1 = null
    variant2 = null
    success1 = false
    success2 = false

    withView expt, "variant1", (v1) ->
      withReward expt, 1.0, ->
        variant1 = v1

    waitsFor -> variant1

    runs ->
      Myna.log("BLOCK 1")
      expect(recordState(expt)).toEqual([ 2, 0, 0 ])
      expt.record ->
        Myna.log("BLOCK 4")
        expect(recordState(expt)).toEqual([ 2, 1, 1 ])
        success1 = true

    runs ->
      Myna.log("BLOCK 2")
      withView expt, "variant2", (v2) ->
        withReward expt, 1.0, ->
          variant2 = v2

    runs ->
      Myna.log("BLOCK 3")
      expect(recordState(expt)).toEqual([ 2, 1, 0 ])
      expt.record ->
        Myna.log("BLOCK 5")
        expect(recordState(expt)).toEqual([ 0, 1, 0 ])
        success2 = true

    waitsFor -> success1 && success2

    # 6
    runs ->
      expect(recordState(expt)).toEqual([ 0, 0, 0 ])
