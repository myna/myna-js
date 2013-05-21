class Myna.BaseExperiment
  constructor: (options = {}) ->
    Myna.log("Myna.BaseExperiment.constructor", options)
    @uuid      = options.uuid      ? Myna.error("Myna.Experiment.constructor", @id, "no uuid in options", options)
    @id        = options.id        ? Myna.error("Myna.Experiment.constructor", @id, "no id in options", options)
    @apiKey    = options.apiKey    ? Myna.error("Myna.Experiment.constructor", @id, "no apiKey in options", options)
    @apiRoot   = options.apiRoot   ? "//api.mynaweb.com"
    @callbacks = options.callbacks ? {}
    @settings  = new Myna.Settings(options.settings ? {})

    @variants = {}
    for id, data of (options.variants ? {})
      variant = new Myna.Variant(id, data)
      @variants[id] = variant

    @recordSemaphore = 0
    @waitingToRecord = []

  # (variant -> void) (any -> void) -> void
  suggest: (success = (->), error = (->)) =>
    try
      Myna.log("Myna.BaseExperiment.suggest", @id)
      variant = @randomVariant()

      if @callback('beforeSuggest').call(this, variant) == false
        return

      ans = @view(variant.id, success, error)
      @callback('afterSuggest').call(this, variant)
      ans
    catch exn
      @error(exn)

  view: (variantId, success = (->), error = (->)) =>
    try
      Myna.log("Myna.BaseExperiment.view", @id, variantId)
      variant = @variants[variantId]

      if @callback('beforeView').call(this, variant) == false
        return

      @saveLastSuggestion(variant)
      @clearLastReward()
      @enqueueView(variant)

      ans = success(variant)
      @callback('afterView').call(this, variant)
      ans
    catch exn
      error(exn)

  # number-between-0-and-1 (variant -> void) (any -> void) -> void
  reward: (amount = 1.0, success = (->), error = (->)) =>
    try
      Myna.log("Myna.BaseExperiment.reward", @id, amount)
      variant = @loadLastSuggestion()
      if variant?
        return if @callback('beforeReward').call(this, variant, amount) == false
        ans = @rewardVariant(variant, amount, success, error)
        @callback('afterReward').call(this, variant, amount)
      else
        error()
    catch exn
      error(exn)

  # variant number-between-0-and-1 (variant -> void) (any -> void) -> void
  rewardVariant: (variant, amount = 1.0, success = (->), error = (->)) =>
    try
      Myna.log("Myna.BaseExperiment.rewardVariant", @id, variant.id, amount)
      rewarded = @loadLastReward()
      Myna.log(" - rewarded", rewarded)
      if rewarded?
        error()
      else
        @clearLastSuggestion()
        @saveLastReward(variant)
        @enqueueReward(variant, amount)
        success(variant)
    catch exn
      error(exn)

  record: (success = (->), error = (->)) =>
    @waitingToRecord.push({ success, error })
    if @recordSemaphore > 0
      Myna.log("Myna.Experiment.record", "queued")
    else
      @recordSemaphore++

      callbacks = @waitingToRecord
      @waitingToRecord = []

      Myna.log("Myna.Experiment.record", "starting", callbacks.length)

      allSuccess = (args...) =>
        for item in callbacks then item.success(args...)

      allError = (args...) =>
        for item in callbacks then item.error(args...)

      recordAll = (events, successEvents, errorEvents) =>
        Myna.log("Myna.Experiment.record.recordAll", events, successEvents, errorEvents)
        if events.length == 0
          finish(successEvents, errorEvents)
        else
          [ head, tail ... ] = events
          recordOne(head, tail, successEvents, errorEvents)

      recordOne = (event, otherEvents, successEvents, errorEvents) =>
        Myna.log("Myna.Experiment.record.recordOne", event, otherEvents, successEvents, errorEvents)
        Myna.jsonp.request
          url:     "#{@apiRoot}/v2/experiment/#{@uuid}/record"
          success: -> recordAll(otherEvents, successEvents.concat([ event ]), errorEvents)
          error:   -> recordAll(otherEvents, successEvents, errorEvents.concat([ event ]))
          params:  Myna.extend({}, event, { apikey: @apiKey })

      finish = (successEvents, errorEvents) =>
        Myna.log("Myna.Experiment.record.finish", successEvents, errorEvents)
        if errorEvents.length > 0
          @requeueEvents(errorEvents)
          allError(errorEvents)
        else
          allSuccess(successEvents)

        @recordSemaphore--

        if @waitingToRecord.length > 0
          @record() # spawn another record process

      recordAll(@clearQueuedEvents(), [], [])

  # -> double
  totalWeight: =>
    ans = 0.0
    for id, variant of @variants then ans += variant.weight
    ans

  randomVariant: =>
    Myna.log("Myna.BaseExperiment.randomVariant", @id)
    total = @totalWeight()
    random = Math.random() * total
    for id, variant of @variants
      total -= variant.weight
      if total <= random
        Myna.log("Myna.BaseExperiment.randomVariant", @id, variant.id)
        return variant
    Myna.log("Myna.BaseExperiment.randomVariant", @id, null)
    return null

  callback: (id) =>
    ans = @callbacks[id]
    Myna.log("Myna.BaseExperiment.callback", @id, id, ans)
    ans ? (->)

  # => U(variant null)
  loadLastSuggestion: =>
    @loadVariant('lastSuggestion')

  # variant => void
  saveLastSuggestion: (variant) =>
    @saveVariant('lastSuggestion', variant)
    @clearVariant('lastReward')

  # => void
  clearLastSuggestion: =>
    @clearVariant('lastSuggestion')
    # @clearVariant('lastReward')

  # => U(variant null)
  loadLastReward: =>
    @loadVariant('lastReward')

  # variant => void
  saveLastReward: (variant) =>
    @saveVariant('lastReward', variant)

  # => void
  clearLastReward: =>
    @clearVariant('lastReward')

  loadVariant: (cacheKey) =>
    id = @load()?[cacheKey]
    Myna.log("Myna.BaseExperiment.loadVariant", @id, cacheKey, id)
    if id? then @variants[id] else null

  saveVariant: (cacheKey, variant) =>
    @loadAndSave (saved) ->
      Myna.log("Myna.BaseExperiment.saveVariant", @id, cacheKey, variant, saved)
      if variant?
        saved[cacheKey] = variant.id
      else
        delete saved[cacheKey]
      saved

  clearVariant: (cacheKey) =>
    @saveVariant(cacheKey, null)

  loadQueuedEvents: =>
    ans = @load().queuedEvents ? []
    Myna.log("Myna.BaseExperiment.loadQueuedEvents", @id, ans)
    ans

  clearQueuedEvents: =>
    Myna.log("Myna.BaseExperiment.clearQueuedEvents", @id)
    ans = []
    @loadAndSave (saved) ->
      ans = saved.queuedEvents ? []
      delete saved.queuedEvents
      saved
    ans

  enqueueEvent: (event) =>
    Myna.log("Myna.BaseExperiment.enqueueEvent", @id, event)
    @loadAndSave (saved) ->
      if saved.queuedEvents?
        saved.queuedEvents.push(event)
      else
        saved.queuedEvents = [ event ]
      saved

  requeueEvents: (events) =>
    Myna.log("Myna.BaseExperiment.requeueEvents", @id, events)
    @loadAndSave (saved) ->
      if saved.queuedEvents?
        saved.queuedEvents = events.concat(saved.queuedEvents)
      else
        saved.queuedEvents = events
      saved

  enqueueView: (variant) =>
    Myna.log("Myna.BaseExperiment.enqueueView", @id, variant)
    @enqueueEvent
      typename:  "view"
      variant:   variant.id
      timestamp: Myna.dateToString(new Date())

  enqueueReward: (variant, amount) =>
    Myna.log("Myna.BaseExperiment.enqueueReward", @id, variant, amount)
    @enqueueEvent
      typename:  "reward"
      variant:   variant.id
      amount:    amount
      timestamp: Myna.dateToString(new Date())

  loadAndSave: (func) =>
    @save(func(@load() ? {}))

  load: =>
    Myna.cache.load(@uuid)

  save: (state) =>
    Myna.cache.save(@uuid, state)

class Myna.Experiment extends Myna.BaseExperiment

  # (variant -> void) (any -> void) -> void
  suggest: (success = (->), error = (->)) =>
    try
      Myna.log("Myna.Experiment.suggest", @id)
      sticky = @sticky()

      if sticky
        suggested = @loadStickySuggestion()
        variant = suggested ? @randomVariant()
      else
        suggested = null
        variant = @randomVariant()

      Myna.log(" - suggest", suggested, variant)

      if @callback('beforeSuggest').call(this, variant, !!suggested) == false
        return

      Myna.log(" - suggest", "continuing")

      if suggested?
        ans = success(suggested)
      else if variant?
        if sticky then @saveStickySuggestion(variant)
        ans = @view(variant.id, success, error)
      else
        error()
        return

      Myna.log(" - suggest", "continued")

      @callback('afterSuggest').call(this, variant, !!suggested)
      ans
    catch exn
      error(exn)

  # number-between-0-and-1 (variant -> void) (any -> void) -> void
  reward: (amount = 1.0, success = (->), error = (->)) =>
    try
      Myna.log("Myna.Experiment.reward", @id, amount)
      sticky = @sticky()

      if sticky
        rewarded = @loadStickyReward()
        variant = rewarded ? @loadLastSuggestion()
      else
        rewarded = null
        variant = @loadLastSuggestion()

      Myna.log(" - reward", rewarded, variant, @callback('beforeReward'))

      if @callback('beforeReward').call(this, variant, !!rewarded) == false
        return

      Myna.log(" - reward", "continuing")

      if rewarded?
        ans = success()
      else if variant?
        if sticky then @saveStickyReward(variant)
        ans = @rewardVariant(variant, amount, success, error)
      else
        error()
        return

      Myna.log(" - reward", "continued")

      @callback('afterReward').call(this, variant, !!rewarded)
      ans
    catch exn
      error(exn)

  # -> boolean
  sticky: =>
    ans = !!@settings.get("myna.sticky", true)
    Myna.log("Myna.Experiment.sticky", @id, ans)
    ans

  unstick: =>
    Myna.log("Myna.Experiment.unstick", @id)
    @clearLastSuggestion()
    @clearLastReward()
    @clearStickySuggestion()

  # => U(variant null)
  loadStickySuggestion: =>
    @loadVariant('stickySuggestion')

  # variant => void
  saveStickySuggestion: (variant) =>
    @saveVariant('stickySuggestion', variant)
    @clearVariant('stickyReward')

  # => void
  clearStickySuggestion: =>
    @clearVariant('stickySuggestion')
    @clearVariant('stickyReward')

  # => U(variant null)
  loadStickyReward: =>
    @loadVariant('stickyReward')

  # variant => void
  saveStickyReward: (variant) =>
    @saveVariant('stickyReward', variant)

  # => void
  clearStickyReward: =>
    @clearVariant('stickyReward')
