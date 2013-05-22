class Myna.BaseExperiment
  constructor: (options = {}) ->
    Myna.log("Myna.BaseExperiment.constructor", options)
    @uuid      = options.uuid   ? Myna.error("Myna.BaseExperiment.constructor", @id, "no uuid in options", options)
    @id        = options.id     ? Myna.error("Myna.BaseExperiment.constructor", @id, "no id in options", options)
    @apiKey    = options.apiKey ? Myna.error("Myna.BaseExperiment.constructor", @id, "no apiKey in options", options)
    @apiRoot   = options.apiRoot ? "//api.mynaweb.com"
    @settings  = new Myna.Settings(options.settings ? {})

    @callbacks = options.callbacks ? {}

    @variants = {}
    for data in (options.variants ? [])
      @variants[data.id] = new Myna.Variant(data)

    # The number of record requests currently in progress. Should be 0 or 1.
    # The value is used to prevent multiple record requests being submitted concurrently.
    @recordSemaphore = 0

    # Callbacks passed to record that *aren't* part of a current request.
    #
    # These callbacks are cached until the current record request is over,
    # at which point the record method retriggers itself.
    @waitingToRecord = []

  # Timeout (in milliseconds) for API requests made by this experiment.
  #
  # -> number
  timeout: =>
    @settings.get("myna.web.timeout", 1000) # milliseconds

  # (variant -> void) (any -> void) -> void
  suggest: (success = (->), error = (->)) =>
    Myna.log("Myna.BaseExperiment.suggest", @id)
    variant = @randomVariant()

    if @callback('beforeSuggest').call(this, variant) == false then return false

    @viewVariant({ variant, success, error })

    @callback('afterSuggest').call(this, variant)

    return

  view: (variantId, success = (->), error = (->)) =>
    Myna.log("Myna.BaseExperiment.view", @id, variantId)

    if @viewVariant({ variant: @variants[variantId], success, error }) == false then return false

    return

  viewVariant: (options) =>
    Myna.log("Myna.BaseExperiment.viewVariant", @id, options)

    variant   = options.variant
    success   = options.success   ? (->)
    error     = options.error     ? (->)
    otherArgs = options.otherArgs ? []

    args      = [ variant, otherArgs... ]

    if @callback('beforeView').apply(this, args) == false then return false

    @saveLastSuggestion(variant)
    @clearLastReward()
    @enqueueView(variant)

    success.apply(this, args)

    @callback('afterView').apply(this, args)

    return

  # Reward the last page view. A `reward` event is queued in local storage
  # ready to be submitted to the servers.
  #
  # number-between-0-and-1 (variant -> void) (any -> void) -> void
  reward: (amount = 1.0, success = (->), error = (->)) =>
    Myna.log("Myna.BaseExperiment.reward", @id, amount)

    variant = @loadLastSuggestion()

    if variant?
      if @callback('beforeReward').call(this, variant, amount) == false then return false

      if @rewardVariant(variant, amount, success, error) == false then return false

      @callback('afterReward').call(this, variant, amount)
    else
      error.call(this, Myna.problem("no-suggestion"))
      return false

    return

  # variant number-between-0-and-1 (variant -> void) (any -> void) -> void
  rewardVariant: (options = {}) =>
    Myna.log("Myna.BaseExperiment.rewardVariant", @id, options)

    variant   = options.variant   ? throw "no variant specified"
    amount    = options.amount    ? 1.0
    success   = options.success   ? (->)
    error     = options.error     ? (->)
    otherArgs = options.otherArgs ? []
    args      = [ variant, amount, otherArgs... ]
    rewarded  = @loadLastReward()

    if rewarded?
      error.call(this, Myna.problem("already-rewarded"))
    else
      @clearLastSuggestion()
      @saveLastReward(variant)
      @enqueueReward(variant, amount)

      success.apply(this, args)

    return

  # Call the `record` endpoint on the Myna API servers,
  # recording any view/reward events that are queued up in local storage.
  #
  # If the submission of any events fails, they are requeued for future submission.
  # The callbacks are passed two arguments: an array of successfully submitted events,
  # and an array of requeued events.
  #
  # (arrayOf(event) arrayOf(event) -> void) (arrayOf(event) arrayOf(event) -> void) -> void
  record: (success = (->), error = (->)) =>
    @waitingToRecord.push({ success, error })

    if @recordSemaphore > 0
      Myna.log("Myna.BaseExperiment.record", "queued")
    else
      @recordSemaphore++

      callbacks = @waitingToRecord
      @waitingToRecord = []

      Myna.log("Myna.BaseExperiment.record", "starting", callbacks.length)

      recordAll = (events, successEvents, errorEvents) =>
        Myna.log("Myna.BaseExperiment.record.recordAll", events, successEvents, errorEvents)
        if events.length == 0
          finish(successEvents, errorEvents)
        else
          [ head, tail ... ] = events
          recordOne(head, tail, successEvents, errorEvents)

      recordOne = (event, otherEvents, successEvents, errorEvents) =>
        Myna.log("Myna.BaseExperiment.record.recordOne", event, otherEvents, successEvents, errorEvents)
        Myna.jsonp.request
          url:     "#{@apiRoot}/v2/experiment/#{@uuid}/record"
          success: -> recordAll(otherEvents, successEvents.concat([ event ]), errorEvents)
          error:   -> recordAll(otherEvents, successEvents, errorEvents.concat([ event ]))
          timeout: @timeout()
          params:  Myna.extend({}, event, { apikey: @apiKey })

      finish = (successEvents, errorEvents) =>
        Myna.log("Myna.BaseExperiment.record.finish", successEvents, errorEvents)
        if errorEvents.length > 0
          @requeueEvents(errorEvents)
          for item in callbacks
            item.error(successEvents, errorEvents)
        else
          for item in callbacks
            item.success(successEvents, errorEvents)

        @callback('afterRecord').call(this, successEvents, errorEvents)

        @recordSemaphore--

        if @waitingToRecord.length > 0
          @record() # spawn another record process

      events = @clearQueuedEvents()
      if @callback('beforeRecord').call(this, events) == false
        @requeueEvents(events)
      else
        recordAll(events, [], [])

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
    Myna.log("Myna.BaseExperiment.callback", @id, id, ans?)
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

