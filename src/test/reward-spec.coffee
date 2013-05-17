describe "Myna.Experiment.reward", ->
  pending = ->
    expect("Have we written this test yet?").toEqual("Nope - it's pending.")

  describe "sticky", ->
    it "should reward the last suggestion", pending
    it "should clear the last suggestion", pending
    it "should save the sticky reward", pending
    it "should queue a reward event for upload", pending
    it "should not reward anything thing the next time", pending
    it "should NOT queue a second event for upload", pending
    it "should be reset by unstick", pending
    it "should fail in all the same cases that myna-html does", pending
    # handle server timeout
    # run beforeReward and afterReward event handlers
    # handle alternative amounts

  describe "non-sticky", ->
    it "should reward the last suggestion", pending
    it "should clear the last suggestion", pending
    it "should NOT save the sticky reward", pending
    it "should queue a view event for upload", pending
    it "should reward the next suggestion", pending
    it "should queue a second event for upload", pending
    it "should allow unstick to be called without effect", pending
    it "should fail in all the same cases that myna-html does", pending

# describe "Suggestion.reward", ->
#   testUuid = "45923780-80ed-47c6-aa46-15e2ae7a0e8c"
#   experiment = null

#   timeout = 1000 # How long, in ms, do we wait for calls to Myna

#   # Useful debugging stuff
#   debug = true
#   log = (msg) ->
#     if debug
#       console.log "------------------------------------------------------------\n"
#       console.log msg
#       console.log "\n------------------------------------------------------------\n"

#   promiseTest = (promise) ->
#     _this =
#       ready: false # (U "success" "error" false)
#       result: null # Any

#     runs ->
#       promise.fork(
#         (data) ->
#           _this.ready = "success"
#           _this.result = data
#           return
#         (error) ->
#           _this.ready = "error"
#           _this.result = error
#           return
#       )

#     waitsFor (-> _this.ready != false), "promise to evaluate", timeout

#     runs ->
#       expect(_this.ready).toBe("success")

#   makeSuggestion = () ->
#     new Promise (success, error) ->
#       experiment.suggest(success, error)

#   makeReward = (amount) ->
#     (suggestion) ->
#       if amount
#         new Promise (success, error) ->
#           suggestion.reward(amount, success, error)
#       else
#         new Promise (success, error) ->
#           suggestion.reward(1.0, success, error)

#   beforeEach ->
#     experiment = new Experiment(testUuid)
#     return

#   it "should return ok when correctly rewarding", ->
#     promiseTest makeSuggestion().chain makeReward()

#   it "should allow amount to be specified", ->
#     promiseTest makeSuggestion().chain makeReward(1.0)

#   it "should handle errors on an invalid token", ->
#     promiseTest makeSuggestion().chain (suggestion) ->
#       suggestion.token = "ha-ha"
#       new Promise (success, error) ->
#         suggestion.reward 1.0, error, (problem) ->
#           if problem.typename == "problem" && problem.subtype == 400
#             success(problem)
#           else
#             error(problem)

#   it "should handle errors on an invalid amount", ->
#     promiseTest makeSuggestion().chain (suggestion) ->
#       new Promise (success, error) ->
#         suggestion.reward 2.0, error, (problem) ->
#           if problem.typename == "problem" && problem.subtype == 400
#             success(problem)
#           else
#             error(problem)

#   it "should run reward event handlers when making a reward", ->
#     flag = false
#     result = false
#     suggestion = null
#     count = 0
#     evts = []
#     handler = (suggestion, amount, result) ->
#       count++
#       evts.push [suggestion, amount, result]

#     runs ->
#       experiment.suggest(
#         (s) ->
#           flag = true
#           suggestion = s
#           return
#         (error) ->
#           flag = true
#           suggestion = error
#           return
#       )

#     waitsFor (-> flag), "the suggestion to return", timeout

#     runs ->
#       Myna.onreward.push(handler)
#       Myna.onreward.push(handler)
#       flag = false
#       result = false
#       suggestion.reward(
#         1.0
#         (ok) ->
#           flag = true
#           result = ok
#           return
#         (error) ->
#           flag = true
#           result = error
#           return
#       )

#     waitsFor (-> flag), "the reward to return", timeout

#     runs ->
#       Myna.onreward.pop()
#       Myna.onreward.pop()
#       expect(evts.length).toBe(2)
#       expect(evts[0][0].experiment.uuid).toEqual(suggestion.experiment.uuid)
#       expect(evts[0][1]).toBe(1.0)
#       expect(evts[0][2]).toBe(result)
#       expect(evts[1][0].experiment.uuid).toEqual(suggestion.experiment.uuid)
#       expect(evts[1][1]).toBe(1.0)
#       expect(evts[1][2]).toBe(result)

#   it "should run reward event handlers on error", ->
#     flag = false
#     result = false
#     suggestion = null
#     count = 0
#     evts = []
#     handler = (suggestion, amount, result) ->
#       count++
#       evts.push [suggestion, amount, result]

#     runs ->
#       experiment.suggest(
#         (s) ->
#           flag = true
#           suggestion = s
#           return
#         (error) ->
#           flag = true
#           suggestion = error
#           return
#       )

#     waitsFor (-> flag), "the suggestion to return", timeout

#     runs ->
#       Myna.onreward.push(handler)
#       Myna.onreward.push(handler)
#       flag = false
#       result = false
#       suggestion.reward(
#         2.0
#         (ok) ->
#           flag = true
#           result = ok
#           return
#         (error) ->
#           flag = true
#           result = error
#           return
#       )

#     waitsFor (-> flag), "the reward to return", timeout

#     runs ->
#       Myna.onreward.pop()
#       Myna.onreward.pop()
#       expect(evts.length).toBe(2)
#       expect(evts[0][0].experiment.uuid).toEqual(suggestion.experiment.uuid)
#       expect(evts[0][1]).toBe(2.0)
#       expect(evts[0][2]).toBe(result)
#       expect(evts[1][0].experiment.uuid).toEqual(suggestion.experiment.uuid)
#       expect(evts[1][1]).toBe(2.0)
#       expect(evts[1][2]).toBe(result)
