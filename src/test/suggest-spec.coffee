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
