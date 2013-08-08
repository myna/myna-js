class Myna.Recorder extends Myna.Events
  constructor: (client) ->
    super()
    Myna.log("Myna.Recorder.constructor", client)

    @client     = client
    @apiKey     = client.apiKey     ? Myna.error("Myna.Recorder.constructor", "no apiKey in options", options)
    @apiRoot    = client.apiRoot    ? "//api.mynaweb.com"

    @storageKey = client.settings.get("myna.web.storageKey", "myna")
    @timeout    = client.settings.get("myna.web.timeout", 1000)
    @autoSync   = client.settings.get("myna.web.autoSync", true)

    # The number of record requests currently in progress. Should be 0 or 1.
    # The value is used to prevent multiple record requests being submitted concurrently.
    @semaphore = 0

    # Callbacks passed to record that *aren't* part of a current request.
    #
    # These callbacks are cached until the current record request is over,
    # at which point the record method retriggers itself.
    @waiting = []

  # Start listening for results
  init: =>
    for id, expt of @client.experiments
      @listenTo(expt)

  listenTo: (expt) =>
    Myna.log("Myna.Recorder.listenTo", expt.id)

    expt.on 'recordView', (variant, success, error) =>
      @recordView(expt, variant, success, error)

    expt.on 'recordReward', (variant, amount, success, error) =>
      @recordReward(expt, variant, amount, success, error)

  # Record a view event, caching it in local storage and possibly
  # synchronising it to the Myna servers before calling the success callback.
  recordView: (expt, variant, success = (->), error = (->)) =>
    Myna.log("Myna.Recorder.recordView", expt.id, variant.id)
    @queueEvent
      typename:   "view"
      experiment: expt.uuid
      variant:    variant.id
      timestamp:  Myna.dateToString(new Date())
    Myna.log("Myna.Recorder.recordReward", "aboutToSync", @autoSync)
    if @autoSync then @sync(success, error) else success()

  # Record a reward event, caching it in local storage and possibly
  # synchronising it to the Myna servers before calling the success callback.
  recordReward: (expt, variant, amount, success = (->), error = (->)) =>
    Myna.log("Myna.Recorder.recordReward", expt.id, variant.id, amount)
    @queueEvent
      typename:   "reward"
      experiment: expt.uuid
      variant:    variant.id
      amount:     amount
      timestamp:  Myna.dateToString(new Date())
    Myna.log("Myna.Recorder.recordReward", "aboutToSync", @autoSync)
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
      Myna.log("Myna.Recorder.sync", "queued", @waiting.length)
    else
      @semaphore++

      waiting = @waiting
      @waiting = []

      start = =>
        events = @clearQueuedEvents()
        Myna.log("Myna.Recorder.sync.start", events, waiting.length)
        if @trigger('beforeSync', events) == false
          # @requeueEvents(events)
          finish([], events, true)
        else
          syncAll(events, [], [])

      syncAll = (events, successEvents, errorEvents) =>
        Myna.log("Myna.Recorder.sync.syncAll", events, successEvents, errorEvents)
        if events.length == 0
          finish(successEvents, errorEvents)
        else
          [ head, tail ... ] = events
          syncOne(head, tail, successEvents, errorEvents)

      syncOne = (event, otherEvents, successEvents, errorEvents) =>
        Myna.log("Myna.Recorder.sync.syncOne", event, otherEvents, successEvents, errorEvents)

        params = Myna.extend({}, event, { uuid: event.experiment.uuid, apikey: @apiKey })
        params = Myna.deleteKeys(params, 'experiment')

        Myna.jsonp.request
          url:     "#{@apiRoot}/v2/experiment/#{event.experiment}/record"
          success: -> syncAll(otherEvents, successEvents.concat([ event ]), errorEvents)
          error:   -> syncAll(otherEvents, successEvents, errorEvents.concat([ event ]))
          timeout: @timeout
          params:  params

      finish = (successEvents, errorEvents, cancelled = false) =>
        Myna.log("Myna.Recorder.sync.finish", successEvents, errorEvents, @waiting.length)

        if errorEvents.length > 0
          @requeueEvents(errorEvents)
          for item in waiting then item.error(successEvents, errorEvents)
        else
          for item in waiting then item.success(successEvents, errorEvents)

        unless cancelled
          @trigger('sync', successEvents, errorEvents)

        @semaphore--

        if !cancelled && @waiting.length > 0
          @sync() # start another sync

      start()

  queuedEvents: =>
    ans = @load().queuedEvents ? []
    Myna.log("Myna.Recorder.queuedEvents", ans)
    ans

  queueEvent: (event) =>
    Myna.log("Myna.Recorder.queueEvent", event)
    @loadAndSave (saved) ->
      saved.queuedEvents = (saved.queuedEvents ? []).concat([ event ])
      saved

  requeueEvents: (events) =>
    Myna.log("Myna.Recorder.requeueEvents", events)
    @loadAndSave (saved) ->
      saved.queuedEvents = events.concat(saved.queuedEvents ? [])
      saved

  clearQueuedEvents: =>
    Myna.log("Myna.Recorder.clearQueuedEvents")
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

