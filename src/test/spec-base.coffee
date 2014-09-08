log  = require '../main/common/log'
util = require '../main/common/util'

beforeEach ->
  # console.log("----- START -----")
  # jasmine.DEFAULT_TIMEOUT_INTERVAL = 2500
  jasmine.addMatchers
    toBeInstanceOf: (expected) ->
      this.actual instanceof expected
  return

afterEach (done) ->
  waitForCleanup = =>
    if util.isEmptyObject(window.__mynaCallbacks)
      # console.log("----- FINISH -----")
      done()
    else
      window.setTimeout(waitForCleanup, 50)
  waitForCleanup()
  return

testApiKey        = "092c90f6-a8f2-11e2-a2b9-7c6d628b25f7"
testApiRoot       = "http://api.mynaweb.com"
testStorageKey    = "myna"
testClientOptions = { apiKey: testApiKey, apiRoot: testApiRoot, storageKey: testStorageKey }

# Helper function - grab a suggestion and pass it to the argument:
withSuggestion = (expt, fn) ->
  done    = false
  variant = null

  runs ->
    expt.suggest().then(
      (v) ->
        variant = v
        done = true
      (args...) ->
        expect("error callback was called with " + args).toEqual("success callback was called")
        done = true
    )
  waitsFor -> done
  runs -> fn(variant)

# Helper function - grab a suggestion and pass it to the argument:
withView = (expt, id, fn) ->
  done    = false
  variant = null

  runs ->
    expt.view(id).then(
      (v) ->
        variant = v
        done = true
      (args...) ->
        expect("error callback was called with " + args).toEqual("success callback was called")
        done = true
    )
  waitsFor -> done
  runs -> fn(variant)

# Helper function - record a reward and call the argument:
withReward = (expt, amount, fn) ->
  done = false
  runs ->
    expt.reward(amount).then(
      -> done = true
      -> done = true
    )
  waitsFor -> done
  runs -> fn()

# Helper function - strip the timestamps from the supplied events making them easier to test:
eventSummaries = (events) ->
  for evt in events
    switch evt.typename
      when 'view'   then [ 'view', evt.variant, null ]
      when 'reward' then [ 'reward', evt.variant, evt.amount ]
      else [ 'error', evt ]

# Helper function - mark a test as "pending" (i.e. incomplete):
pending = ->
  expect("this test").toBeImplemented()

module.exports = {
  testApiKey
  testApiRoot
  testStorageKey
  testClientOptions
  withSuggestion
  withView
  withReward
  eventSummaries
  pending
}
