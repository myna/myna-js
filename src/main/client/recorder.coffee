jsonp    = require '../common/jsonp'
log      = require '../common/log'
settings = require '../common/settings'
storage  = require '../common/storage'
util     = require '../common/util'
Events   = require './events'

module.exports = class Recorder extends Events
  constructor: (client) ->
    super()
    log.debug("Recorder.constructor", client)

    @client     = client
    @apiKey     = client.apiKey  ? log.error("Recorder.constructor", "no apiKey in options", options)
    @apiRoot    = client.apiRoot ? "//api.mynaweb.com"

    @storageKey = settings.get(client.settings, "myna.web.storageKey", "myna")
    @timeout    = settings.get(client.settings, "myna.web.timeout",    1000)
    @autoSync   = settings.get(client.settings, "myna.web.autoSync",   true)

    # The number of record requests currently in progress. Should be 0 or 1.
    # The value is used to prevent multiple record requests being submitted concurrently.
    @semaphore = 0

    # Callbacks passed to record that *aren't* part of a current request.
    #
    # These callbacks are storaged until the current record request is over,
    # at which point the record method retriggers itself.
    @waiting = []

  # Start listening for results
  init: =>
    for id, expt of @client.experiments
      @listenTo(expt)

  listenTo: (expt) =>
    log.debug("Recorder.listenTo", expt.id)

    expt.on 'recordView', (variant, success, error) =>
      @recordView(expt, variant, success, error)

    expt.on 'recordReward', (variant, amount, success, error) =>
      @recordReward(expt, variant, amount, success, error)

  # Record a view event, caching it in local storage and possibly
  # synchronising it to the Myna servers before calling the success callback.
  recordView: (expt, variant, success = (->), error = (->)) =>
    log.debug("Recorder.recordView", expt.id, variant.id)
    @queueEvent
      typename:   "view"
      experiment: expt.uuid
      variant:    variant.id
      timestamp:  util.dateToString(new Date())
    log.debug("Recorder.recordReward", "aboutToSync", @autoSync)
    if @autoSync then @sync(success, error) else success()

  # Record a reward event, caching it in local storage and possibly
  # synchronising it to the Myna servers before calling the success callback.
  recordReward: (expt, variant, amount, success = (->), error = (->)) =>
    log.debug("Recorder.recordReward", expt.id, variant.id, amount)
    @queueEvent
      typename:   "reward"
      experiment: expt.uuid
      variant:    variant.id
      amount:     amount
      timestamp:  util.dateToString(new Date())
    log.debug("Recorder.recordReward", "aboutToSync", @autoSync)
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
      log.debug("Recorder.sync", "queued", @waiting.length)
    else
      @semaphore++

      waiting = @waiting
      @waiting = []

      start = =>
        events = @clearQueuedEvents()
        log.debug("Recorder.sync.start", events, waiting.length)
        if @trigger('beforeSync', events) == false
          finish([], [], events, true)
        else
          syncAll(events, [], [], [])

      syncAll = (events, successEvents, discardedEvents, requeuedEvents) =>
        log.debug("Recorder.sync.syncAll", events, successEvents, discardedEvents, requeuedEvents)
        if events.length == 0
          finish(successEvents, discardedEvents, requeuedEvents)
        else
          [ head, tail ... ] = events
          syncOne(head, tail, successEvents, discardedEvents, requeuedEvents)

      syncOne = (event, otherEvents, successEvents, discardedEvents, requeuedEvents) =>
        log.debug("Recorder.sync.syncOne", event, otherEvents, successEvents, discardedEvents, requeuedEvents)

        params = util.extend({}, event, { apikey: @apiKey })
        params = util.deleteKeys(params, 'experiment')

        jsonp.request
          url:     "#{@apiRoot}/v2/experiment/#{event.experiment}/record"
          success: -> syncAll(otherEvents, successEvents.concat([ event ]), discardedEvents, requeuedEvents)
          error: (response) ->
            if response.status && response.status >= 500
              syncAll(otherEvents, successEvents, discardedEvents, requeuedEvents.concat([ event ]))
            else
              syncAll(otherEvents, successEvents, discardedEvents.concat([ event ]), requeuedEvents)
          timeout: @timeout
          params:  params

      finish = (successEvents, discardedEvents, requeuedEvents, cancelled = false) =>
        log.debug("Recorder.sync.finish", successEvents, discardedEvents, requeuedEvents, @waiting.length)

        if requeuedEvents.length > 0
          @requeueEvents(requeuedEvents)

        if discardedEvents.length > 0 || requeuedEvents.length > 0
          for item in waiting then item.error(successEvents, discardedEvents, requeuedEvents)
        else
          for item in waiting then item.success(successEvents, discardedEvents, requeuedEvents)

        unless cancelled
          @trigger('sync', successEvents, discardedEvents, requeuedEvents)

        @semaphore--

        if !cancelled && @waiting.length > 0
          @sync() # start another sync

      start()

  queuedEvents: =>
    ans = @load().queuedEvents ? []
    log.debug("Recorder.queuedEvents", ans)
    ans

  queueEvent: (event) =>
    log.debug("Recorder.queueEvent", event)
    @loadAndSave (saved) ->
      saved.queuedEvents = (saved.queuedEvents ? []).concat([ event ])
      saved

  requeueEvents: (events) =>
    log.debug("Recorder.requeueEvents", events)
    @loadAndSave (saved) ->
      saved.queuedEvents = events.concat(saved.queuedEvents ? [])
      saved

  clearQueuedEvents: =>
    log.debug("Recorder.clearQueuedEvents")
    ans = []
    @loadAndSave (saved) ->
      ans = saved.queuedEvents ? []
      delete saved.queuedEvents
      saved
    ans

  loadAndSave: (func) =>
    @save(func(@load() ? {}))

  load: =>
    storage.get(@storageKey)

  save: (state) =>
    storage.set(@storageKey, state)
