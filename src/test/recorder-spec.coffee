goodApiKey = testApiKey
badApiKey  = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"

recorderState = (recorder) -> [
  recorder.queuedEvents().length, # the number of events waiting to be sent by the next call to record()
  recorder.semaphore,             # the number of record() methods that are currently running
  recorder.waiting.length         # the number of callbacks registered for future calls to record()
]

for errorCase in [ "success", "client", "server" ]
  do (errorCase) ->
    apiKey = switch errorCase
               when "success" then goodApiKey
               when "client"  then badApiKey
               when "server"  then goodApiKey

    errorStatus = switch errorCase
                    when "success" then "success"
                    when "client"  then "client error"
                    when "server"  then "server error"

    initialized = (fn) ->
      return ->
        expt = new Myna.Experiment
          uuid:     "45923780-80ed-47c6-aa46-15e2ae7a0e8c"
          id:       "id"
          settings: "myna.web.sticky": false
          variants: [
            { id: "variant1", weight: 0.5 }
            { id: "variant2", weight: 0.5 }
          ]

        client = new Myna.Client
          apiKey:   apiKey
          apiRoot:  testApiRoot
          settings: "myna.web.autoSync":  false
          experiments: [ expt ]

        recorder = new Myna.Recorder client

        switch errorCase
          # when "success"
          #   # Do nothing
          # when "client"
          #   # Do nothing
          when "server"
            spyOn(Myna.jsonp, "request").andCallFake (options) ->
              options.error({ typename: "problem", status: 500 })
              return

        expt.off()
        expt.unstick()
        recorder.off()
        recorder.listenTo(expt)
        recorder.clearQueuedEvents()
        recorder.semaphore = 0
        recorder.waiting = []

        fn(expt, client, recorder)

        runs ->
          @removeAllSpies()

        return

    describe "Myna.Recorder.sync (#{errorStatus})", ->
      it "should record a single event", initialized (expt, client, recorder) ->
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
              expect(recorderState(recorder)).toEqual(
                switch errorCase
                  when "success" then [ 0, 1, 0 ]
                  when "client"  then "fail"
                  when "server"  then "fail"
              )
              success = true
            ->
              expect(recorderState(recorder)).toEqual(
                switch errorCase
                  when "success" then "fail"
                  when "client"  then [ 0, 1, 0 ]
                  when "server"  then [ 1, 1, 0 ]
              )
              error = true
          )

        waitsFor -> success || error

        runs ->
          expect(success).toEqual(
            switch errorCase
              when "success" then true
              when "client"  then false
              when "server"  then false
          )

          expect(error).toEqual(
            switch errorCase
              when "success" then false
              when "client"  then true
              when "server"  then true
          )

          expect(recorderState(recorder)).toEqual(
            switch errorCase
              when "success" then [ 0, 0, 0 ]
              when "client"  then [ 0, 0, 0 ]
              when "server"  then [ 1, 0, 0 ]
          )

      it "should record multiple events (#{errorStatus})", initialized (expt, client, recorder) ->
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
              expect(recorderState(recorder)).toEqual(
                switch errorCase
                  when "success" then [ 0, 1, 0 ]
                  when "client"  then "fail"
                  when "server"  then "fail"
              )
              success = true
            ->
              expect(recorderState(recorder)).toEqual(
                switch errorCase
                  when "success" then "fail"
                  when "client"  then [ 0, 1, 0 ]
                  when "server"  then [ 4, 1, 0 ]
              )
              error = true
          )

        waitsFor -> success || error

        runs ->
          expect(success).toEqual(
            switch errorCase
              when "success" then true
              when "client"  then false
              when "server"  then false
          )

          expect(error).toEqual(
            switch errorCase
              when "success" then false
              when "client"  then true
              when "server"  then true
          )

          expect(recorderState(recorder)).toEqual(
            switch errorCase
              when "success" then [ 0, 0, 0 ]
              when "client"  then [ 0, 0, 0 ]
              when "server"  then [ 4, 0, 0 ]
          )

      it "should handle multiple concurrent calls to record (#{errorStatus})", initialized (expt, client, recorder) ->
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
              expect(errorCase).toEqual("success")
              expect(recorderState(recorder)).toEqual(
                switch errorCase
                  when "success" then [ 2, 1, 1 ]
                  when "client"  then "fail"
                  when "server"  then "fail"
              )
              success1 = true
            ->
              Myna.log("BLOCK 4b")
              expect(errorCase).not.toEqual("success")
              expect(recorderState(recorder)).toEqual(
                switch errorCase
                  when "success" then "fail"
                  when "client"  then [ 2, 1, 1 ]
                  when "server"  then [ 2, 1, 0 ]
              )
              error1 = true
          )

        runs ->
          Myna.log("BLOCK 2")
          withView expt, "variant2", (v2) ->
            withReward expt, 1.0, ->
              variant2 = v2

        runs ->
          Myna.log("BLOCK 3")
          expect(recorderState(recorder)).toEqual(
            switch errorCase
              when "success" then [ 2, 1, 0 ]
              when "client"  then [ 2, 1, 0 ]
              when "server"  then [ 4, 0, 0 ]
          )
          recorder.sync(
            ->
              Myna.log("BLOCK 5a")
              expect(errorCase).toEqual("success")
              expect(recorderState(recorder)).toEqual(
                switch errorCase
                  when "success" then [ 0, 1, 0 ]
                  when "client"  then "fail"
                  when "server"  then "fail"
              )
              success2 = true
            ->
              Myna.log("BLOCK 5b")
              expect(errorCase).not.toEqual("success")
              expect(recorderState(recorder)).toEqual(
                switch errorCase
                  when "success" then "fail"
                  when "client"  then [ 0, 1, 0 ]
                  when "server"  then [ 4, 1, 0 ]
              )
              error2 = true
          )

        waitsFor -> (success1 || error1) && (success2 || error2)

        # 6
        runs ->
          Myna.log("BLOCK 6")
          expect(success1).toEqual(
            switch errorCase
              when "success" then true
              when "client"  then false
              when "server"  then false
          )
          expect(success2).toEqual(
            switch errorCase
              when "success" then true
              when "client"  then false
              when "server"  then false
          )
          expect(error1).toEqual(
            switch errorCase
              when "success" then false
              when "client"  then true
              when "server"  then true
          )
          expect(error2).toEqual(
            switch errorCase
              when "success" then false
              when "client"  then true
              when "server"  then true
          )
          expect(recorderState(recorder)).toEqual(
            switch errorCase
              when "success" then [ 0, 0, 0 ]
              when "client"  then [ 0, 0, 0 ]
              when "server"  then [ 4, 0, 0 ]
          )

      it "should fire beforeSync and sync events (#{errorStatus})", initialized (expt, client, recorder) ->
        variant  = null
        success  = false
        error    = false
        calls    = []

        recorder.on 'beforeSync', jasmine.createSpy('beforeSync').andCallFake (unrecorded) ->
          calls.push { event: 'beforeSync', unrecorded }

        recorder.on 'sync', jasmine.createSpy('sync').andCallFake (recorded, discarded, requeued) ->
          calls.push { event: 'sync', recorded, discarded, requeued }

        withSuggestion expt, (v) ->
          variant = v

        waitsFor -> variant

        runs ->
          recorder.sync(
            -> success = true
            -> error = true
          )

        waitsFor -> success || error

        runs ->
          expect(success).toEqual(
            switch errorCase
              when "success" then true
              when "client"  then false
              when "server"  then false
          )
          expect(error).toEqual(
            switch errorCase
              when "success" then false
              when "client"  then true
              when "server"  then true
          )

          expect(calls.length).toEqual(2)

          expect(calls[0].event).toEqual('beforeSync')
          expect(calls[0].unrecorded.length).toEqual(1)

          expect(calls[0].unrecorded[0].timestamp).toBeDefined()
          delete calls[0].unrecorded[0].timestamp
          expect(calls[0].unrecorded[0]).toEqual {
            typename:   'view'
            experiment: expt.uuid
            variant:    variant.id
          }

          switch errorCase
            when "success"
              expect(calls[1].event).toEqual('sync')
              expect(calls[1].recorded.length).toEqual(1)
              expect(calls[1].discarded.length).toEqual(0)
              expect(calls[1].requeued.length).toEqual(0)

              # Timestamp was already deleted above:
              expect(calls[1].recorded[0]).toEqual {
                typename:   'view'
                experiment: expt.uuid
                variant:    variant.id
              }

            when "client"
              expect(calls[1].event).toEqual('sync')
              expect(calls[1].recorded.length).toEqual(0)
              expect(calls[1].discarded.length).toEqual(1)
              expect(calls[1].requeued.length).toEqual(0)

              # Timestamp was already deleted above:
              expect(calls[1].discarded[0]).toEqual {
                typename:   'view'
                experiment: expt.uuid
                variant:    variant.id
              }

            else
              expect(calls[1].event).toEqual('sync')
              expect(calls[1].recorded.length).toEqual(0)
              expect(calls[1].discarded.length).toEqual(0)
              expect(calls[1].requeued.length).toEqual(1)

              # Timestamp was already deleted above:
              expect(calls[1].requeued[0]).toEqual {
                typename:   'view'
                experiment: expt.uuid
                variant:    variant.id
              }

          return

      it "should allow beforeSync to cancel the sync (#{errorStatus})", initialized (expt, client, recorder) ->
        variant  = null
        success  = false
        error    = false
        calls    = []

        recorder.on 'beforeSync', jasmine.createSpy('beforeSync').andCallFake (unrecorded) ->
          calls.push { event: 'beforeSync', unrecorded }
          false

        recorder.on 'sync', jasmine.createSpy('sync').andCallFake (recorded, discarded, requeued) ->
          calls.push { event: 'sync', recorded, discarded, requeued }

        withSuggestion expt, (v) ->
          variant = v

        waitsFor -> variant

        runs ->
          recorder.sync(
            -> success = true
            -> error = true
          )

        waitsFor -> success || error

        runs ->
          expect(success).toEqual(false)
          expect(error).toEqual(true)

          expect(calls.length).toEqual(1)

          expect(calls[0].event).toEqual('beforeSync')
          expect(calls[0].unrecorded.length).toEqual(1)

          expect(calls[0].unrecorded[0].timestamp).toBeDefined()
          delete calls[0].unrecorded[0].timestamp
          expect(calls[0].unrecorded[0]).toEqual {
            typename:   'view'
            experiment: expt.uuid
            variant:    variant.id
          }

          expect(recorderState(recorder)).toEqual([ 1, 0, 0 ])

          return
