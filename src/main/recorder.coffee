class Myna.Recorder extends Myna.Events
  constructor: (options = {}) ->
    super(options)

    @log("constructor", options)
    @apiKey     = options.apiKey     ? Myna.error("Myna.Recorder.constructor", "no apiKey in options", options)
    @apiRoot    = options.apiRoot    ? "//api.mynaweb.com"
    @storageKey = options.storageKey ? "myna"
    @timeout    = options.timeout    ? 1000 # ms
    @autoSync   = options.autoSync   ? true

    # The number of record requests currently in progress. Should be 0 or 1.
    # The value is used to prevent multiple record requests being submitted concurrently.
    @semaphore = 0

    # Callbacks passed to record that *aren't* part of a current request.
    #
    # These callbacks are cached until the current record request is over,
    # at which point the record method retriggers itself.
    @waiting = []

  listenTo: (expt) =>
    @log("listenTo", expt.id)

    expt.on 'recordView', (variant, success, error) =>
      @recordView(expt, variant, success, error)

    expt.on 'recordReward', (variant, amount, success, error) =>
      @recordReward(expt, variant, amount, success, error)

  # Record a view event, caching it in local storage and possibly
  # synchronising it to the Myna servers before calling the success callback.
  recordView: (expt, variant, success = (->), error = (->)) =>
    @log("recordView", expt.id, variant.id)
    if expt.uuid?
      @queueEvent
        typename:   "view"
        experiment: expt.uuid
        variant:    variant.id
        timestamp:  Myna.dateToString(new Date())
      @log("recordReward", "aboutToSync", @autoSync)
      if @autoSync then @sync(success, error) else success()

  # Record a reward event, caching it in local storage and possibly
  # synchronising it to the Myna servers before calling the success callback.
  recordReward: (expt, variant, amount, success = (->), error = (->)) =>
    @log("recordReward", expt.id, variant.id, amount)
    if expt.uuid?
      @queueEvent
        typename:   "reward"
        experiment: expt.uuid
        variant:    variant.id
        amount:     amount
        timestamp:  Myna.dateToString(new Date())
      @log("recordReward", "aboutToSync", @autoSync)
      if @autoSync then @sync(success, error) else success()

  # Call the `record` endpoint on the Myna API servers, synchronising view/reward
  # events from local storage.
  #
  # If any events cannot be submitted to the server they are requeued for future
  # submission.
  #
  # Callback functions are passed two arguments: an array of successfully submitted
  # events and an array of requeued events.
  #
  # (arrayOf(event) arrayOf(event) -> void) (arrayOf(event) arrayOf(event) -> void) -> void
  sync: (success = (->), error = (->)) =>
    @waiting.push({ success, error })

    if @semaphore > 0
      @log("sync", "queued")
    else
      @semaphore++

      waiting = @waiting
      @waiting = []

      start = =>
        events = @clearQueuedEvents()
        @log("sync.start", events, waiting.length)
        if @trigger('beforeSync', events) == false
          @requeueEvents(events)
        else
          syncAll(events, [], [])

      syncAll = (events, successEvents, errorEvents) =>
        @log("sync.syncAll", events, successEvents, errorEvents)
        if events.length == 0
          finish(successEvents, errorEvents)
        else
          [ head, tail ... ] = events
          syncOne(head, tail, successEvents, errorEvents)

      syncOne = (event, otherEvents, successEvents, errorEvents) =>
        @log("sync.syncOne", event, otherEvents, successEvents, errorEvents)

        params = Myna.deleteKeys(event, 'experiment')
        Myna.jsonp.request
          url:     "#{@apiRoot}/v2/experiment/#{event.experiment}/record"
          success: -> syncAll(otherEvents, successEvents.concat([ event ]), errorEvents)
          error:   -> syncAll(otherEvents, successEvents, errorEvents.concat([ event ]))
          timeout: @timeout
          params:  Myna.extend({}, params, { apikey: @apiKey })

      finish = (successEvents, errorEvents) =>
        @log("sync.finish", successEvents, errorEvents)

        if errorEvents.length > 0
          @requeueEvents(errorEvents)
          for item in waiting then item.error(successEvents, errorEvents)
        else
          for item in waiting then item.success(successEvents, errorEvents)

        @trigger('afterSync', successEvents, errorEvents)

        @semaphore--

        if @waiting.length > 0 then @sync() # start another sync

      start()

  queuedEvents: =>
    ans = @load().queuedEvents ? []
    @log("queuedEvents", ans)
    ans

  queueEvent: (event) =>
    @log("queueEvent", event)
    @loadAndSave (saved) ->
      saved.queuedEvents = (saved.queuedEvents ? []).concat([ event ])
      saved

  requeueEvents: (events) =>
    @log("requeueEvents", events)
    @loadAndSave (saved) ->
      saved.queuedEvents = events.concat(saved.queuedEvents ? [])
      saved

  clearQueuedEvents: =>
    @log("clearQueuedEvents")
    ans = []
    @loadAndSave (saved) ->
      ans = saved.queuedEvents ? []
      delete saved.queuedEvents
      saved
    ans

  loadAndSave: (func) =>
    @save(func(@load() ? {}))

  load: =>
    Myna.cache.load(@storageKey)

  save: (state) =>
    Myna.cache.save(@storageKey, state)

