goodApiKey = "092c90f6-a8f2-11e2-a2b9-7c6d628b25f7"
badApiKey  = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"

recorderState = (recorder) -> [
  recorder.queuedEvents().length, # the number of events waiting to be sent by the next call to record()
  recorder.semaphore,             # the number of record() methods that are currently running
  recorder.waiting.length         # the number of callbacks registered for future calls to record()
]

for denyAccess in [ false, true ]
  apiKey = if denyAccess then badApiKey else goodApiKey

  accessStatus = if denyAccess then "deny access" else "allow access"

  expt = new Myna.Experiment
    uuid:     "45923780-80ed-47c6-aa46-15e2ae7a0e8c"
    id:       "id"
    settings: "myna.js.sticky": false
    variants: [
      { id: "variant1", weight: 0.5 }
      { id: "variant2", weight: 0.5 }
    ]

  recorder = new Myna.Recorder
    apiKey:   apiKey
    apiRoot:  testApiRoot
    autoSync: false

  initialized = (fn) ->
    return ->
      expt.off()
      expt.unstick()
      recorder.off()
      recorder.listenTo(expt)
      recorder.clearQueuedEvents()
      recorder.semaphore = 0
      recorder.waiting = []
      fn()

  describe "Myna.Experiment.record (#{accessStatus})", ->
    it "should record a single event", initialized ->
      variant  = null
      success  = false
      error    = false

      withSuggestion expt, (v) ->
        variant = v

      waitsFor -> variant

      runs ->
        expect(recorderState(recorder)).toEqual([ 1, 0, 0 ])
        recorder.sync(
          ->
            expect(recorderState(recorder)).toEqual([ 0, 1, 0 ])
            success = true
          ->
            expect(recorderState(recorder)).toEqual([ 1, 1, 0 ])
            error = true
        )

      waitsFor -> success || error

      runs ->
        expect(success).toEqual(if denyAccess then false else true)
        expect(error).toEqual(if denyAccess then true else false)

        expect(recorderState(recorder)).toEqual(if denyAccess then [ 1, 0, 0 ] else [ 0, 0, 0 ])

    it "should record multiple events (#{accessStatus})", initialized ->
      variant1 = null
      variant2 = null
      success  = false
      error    = false

      withSuggestion expt, (v1) ->
        withReward expt, 1.0, ->
          withSuggestion expt, (v2) ->
            withReward expt, 1.0, ->
              variant1 = v1
              variant2 = v2

      waitsFor -> variant1 && variant2

      runs ->
        expect(recorderState(recorder)).toEqual([ 4, 0, 0 ])
        recorder.sync(
          ->
            expect(recorderState(recorder)).toEqual([ 0, 1, 0 ])
            success = true
          ->
            expect(recorderState(recorder)).toEqual([ 4, 1, 0 ])
            error = true
        )

      waitsFor -> success || error

      runs ->
        expect(success).toEqual(if denyAccess then false else true)
        expect(error).toEqual(if denyAccess then true else false)
        expect(recorderState(recorder)).toEqual(if denyAccess then [ 4, 0, 0 ] else [ 0, 0, 0 ])

    it "should handle multiple concurrent calls to record (#{accessStatus})", initialized ->
      # Myna.log statements show the likely order of execution.

      variant1 = null
      variant2 = null
      success1 = false
      success2 = false
      error1   = false
      error2   = false

      withView expt, "variant1", (v1) ->
        withReward expt, 1.0, ->
          variant1 = v1

      waitsFor -> variant1

      runs ->
        Myna.log("BLOCK 1")
        expect(recorderState(recorder)).toEqual([ 2, 0, 0 ])
        recorder.sync(
          ->
            Myna.log("BLOCK 4a")
            expect(denyAccess).toEqual(false)
            expect(recorderState(recorder)).toEqual([ 2, 1, 1 ])
            success1 = true
          ->
            Myna.log("BLOCK 4b")
            expect(denyAccess).toEqual(true)
            expect(recorderState(recorder)).toEqual([ 4, 1, 1 ])
            error1 = true
        )

      runs ->
        Myna.log("BLOCK 2")
        withView expt, "variant2", (v2) ->
          withReward expt, 1.0, ->
            variant2 = v2

      runs ->
        Myna.log("BLOCK 3")
        expect(recorderState(recorder)).toEqual([ 2, 1, 0 ])
        recorder.sync(
          ->
            Myna.log("BLOCK 5a")
            expect(denyAccess).toEqual(false)
            expect(recorderState(recorder)).toEqual([ 0, 1, 0 ])
            success2 = true
          ->
            Myna.log("BLOCK 5b")
            expect(denyAccess).toEqual(true)
            expect(recorderState(recorder)).toEqual([ 4, 1, 0 ])
            error2 = true
        )

      waitsFor -> (success1 || error1) && (success2 || error2)

      # 6
      runs ->
        Myna.log("BLOCK 6")
        expect(success1).toEqual(if denyAccess then false else true)
        expect(success2).toEqual(if denyAccess then false else true)
        expect(error1).toEqual(if denyAccess then true else false)
        expect(error2).toEqual(if denyAccess then true else false)
        expect(recorderState(recorder)).toEqual(if denyAccess then [ 4, 0, 0 ] else [ 0, 0, 0 ])
