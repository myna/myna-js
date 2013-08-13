beforeEach ->
  this.addMatchers
    toBeInstanceOf: (expected) ->
      this.actual instanceof expected
    toBeImplemented: ->
      this.message = -> "#{this.actual} has not been written yet."
      false

window.testApiKey  = "092c90f6-a8f2-11e2-a2b9-7c6d628b25f7"
window.testApiRoot = "http://api.mynaweb.com"

# Helper function - grab a suggestion and pass it to the argument:
window.withSuggestion = (expt, fn) ->
  done    = false
  variant = null

  runs ->
    expt.suggest(
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
window.withView = (expt, id, fn) ->
  done    = false
  variant = null

  runs ->
    expt.view(
      id
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
window.withReward = (expt, amount, fn) ->
  done = false
  runs ->
    expt.reward(
      amount
      -> done = true
      -> done = true
    )
  waitsFor -> done
  runs -> fn()

# Helper function - strip the timestamps from the supplied events making them easier to test:
window.eventSummaries = (events) ->
  for evt in events
    switch evt.typename
      when 'view'   then [ 'view', evt.variant, null ]
      when 'reward' then [ 'reward', evt.variant, evt.amount ]
      else [ 'error', evt ]

# Helper function - mark a test as "pending" (i.e. incomplete):
window.pending = ->
  expect("this test").toBeImplemented()
