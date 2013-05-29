beforeEach ->
  this.addMatchers
    toBeInstanceOf: (expected) ->
      this.actual instanceof expected
    toBeImplemented: ->
      this.message = -> "#{this.actual} has not been written yet."
      false
    toBeDeeplyEqualTo: (expected) ->
      differingPath = null
      compare = (x, y, path = '') ->
        if typeof x != typeof y
          differingPath = "#{path}: #{x} vs #{y}"
          return false
        switch typeof x
          when 'object'
            for key, value of x
              unless compare(value, y[key], "#{path}.#{key}")
                return false

            for key, value of y
              if typeof value != 'undefined' && typeof x[key] == 'undefined'
                differingPath = "#{path}.#{key}: #{value} vs #{x[key]}"
                return false

            return true

          when 'function'
            if x.toString() == y.toString()
              true
            else
              differingPath = "#{path}: #{x} vs #{y}"
              false

          else
            if x == y
              true
            else
              differingPath = "#{path}: #{x} vs #{y}"
              false

      if compare(this.actual, expected)
        true
      else
        this.message = -> "arguments differ at path: #{differingPath}:\n#{this.actual}\n#{expected}"
        false

window.testApiRoot = "http://localhost:8080"

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
