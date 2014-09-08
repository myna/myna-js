Promise       = require('es6-promise').Promise
log           = require '../../main/common/log'
jsonp         = require '../../main/common/jsonp'
DefaultClient = require '../../main/client/default'
ApiRecorder   = require '../../main/client/api'
base          = require '../spec-base'

recorderState = (record) -> [
  record.queuedEvents().length, # the number of events waiting to be sent by the next call to record()
  record.semaphore,             # the number of record() methods that are currently running
  record.waiting.length         # the number of callbacks registered for future calls to record()
]

for errorCase in [ "success", "client", "server" ]
  do (errorCase) ->
    apiKey = switch errorCase
               when "success" then base.testApiKey
               when "client"  then "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
               when "server"  then base.testApiKey

    errorStatus = switch errorCase
                    when "success" then "success:"
                    when "client"  then "client error:"
                    when "server"  then "server error:"

    describe "ApiRecorder: #{errorStatus}", ->
      beforeEach (done) ->
        @expt =
          uuid     : "45923780-80ed-47c6-aa46-15e2ae7a0e8c"
          id       : "expt"
          settings : "myna.web.sticky": false
          variants : [
            { id : "variant1", weight : 0.5 }
            { id : "variant2", weight : 0.5 }
          ]

        @client  = new DefaultClient [ @expt ], {
          apiKey   : apiKey
          apiRoot  : base.testApiRoot
          settings : "myna.web.autoSync": false
        }

        # Simulate network errors:
        switch errorCase
          when "client"
            spyOn(jsonp, "request").and.callFake ->
              Promise.reject({ typename: "problem", status: 404 })
          when "server"
            spyOn(jsonp, "request").and.callFake ->
              Promise.reject({ typename: "problem", status: 500 })

        @client.record.clear()
        @client.clear(@expt).then(done)

      describe "sync", ->
        it "should record a single event", (done) ->
          expect(@client.settings).toEqual(myna: web: autoSync: false)
          expect(@client.autoSync).toEqual(false)
          @client.suggest('expt').then (variant) =>
            @client.record.sync().then (result) =>
              switch errorCase
                when 'success'
                  expect(result.successful()).toEqual(true)
                  expect(result.completed.length).toEqual(1)
                  expect(result.discarded.length).toEqual(0)
                  expect(result.requeued.length).toEqual(0)
                when 'client'
                  expect(result.successful()).toEqual(false)
                  expect(result.completed.length).toEqual(0)
                  expect(result.discarded.length).toEqual(1)
                  expect(result.requeued.length).toEqual(0)
                else
                  expect(result.successful()).toEqual(false)
                  expect(result.completed.length).toEqual(0)
                  expect(result.discarded.length).toEqual(0)
                  expect(result.requeued.length).toEqual(1)
              done()

        it "should record multiple events", (done) ->
          @client.suggest('expt').then (variant) =>
            @client.reward('expt').then (variant) =>
              @client.suggest('expt').then (variant) =>
                @client.reward('expt').then (variant) =>
                  @client.record.sync().then (result) =>
                    switch errorCase
                      when 'success'
                        expect(result.successful()).toEqual(true)
                        expect(result.completed.length).toEqual(4)
                        expect(result.discarded.length).toEqual(0)
                        expect(result.requeued.length ).toEqual(0)
                      when 'client'
                        expect(result.successful()).toEqual(false)
                        expect(result.completed.length).toEqual(0)
                        expect(result.discarded.length).toEqual(4)
                        expect(result.requeued.length ).toEqual(0)
                      else
                        expect(result.successful()).toEqual(false)
                        expect(result.completed.length).toEqual(0)
                        expect(result.discarded.length).toEqual(0)
                        expect(result.requeued.length ).toEqual(4)
                    done()

        it "should handle multiple sequential calls to record", (done) ->
          @client.suggest('expt').then (variant) =>
            @client.reward('expt').then (variant) =>
              @client.record.sync().then (result1) =>
                @client.record.sync().then (result2) =>
                  expect(result1).not.toBe(result2)
                  switch errorCase
                    when 'success'
                      expect(result1.successful()).toEqual(true)
                      expect(result1.completed.length).toEqual(2)
                      expect(result1.discarded.length).toEqual(0)
                      expect(result1.requeued.length ).toEqual(0)
                      expect(result2.successful()).toEqual(true)
                      expect(result2.completed.length).toEqual(0)
                      expect(result2.discarded.length).toEqual(0)
                      expect(result2.requeued.length ).toEqual(0)
                    when 'client'
                      expect(result1.successful()).toEqual(false)
                      expect(result1.completed.length).toEqual(0)
                      expect(result1.discarded.length).toEqual(2)
                      expect(result1.requeued.length ).toEqual(0)
                      expect(result2.successful()).toEqual(true)
                      expect(result2.completed.length).toEqual(0)
                      expect(result2.discarded.length).toEqual(0)
                      expect(result2.requeued.length ).toEqual(0)
                    else
                      expect(result1.successful()).toEqual(false)
                      expect(result1.completed.length).toEqual(0)
                      expect(result1.discarded.length).toEqual(0)
                      expect(result1.requeued.length ).toEqual(2)
                      expect(result2.successful()).toEqual(false)
                      expect(result2.completed.length).toEqual(0)
                      expect(result2.discarded.length).toEqual(0)
                      expect(result2.requeued.length ).toEqual(2)
                  done()

        it "should handle multiple concurrent calls to record", (done) ->
          @client.suggest('expt').then (variant) =>
            @client.reward('expt').then (variant) =>
              Promise.all([ @client.record.sync(), @client.record.sync() ]).then ([ result1, result2 ]) =>
                expect(result1).toBe(result2)
                done()
