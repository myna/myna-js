Promise  = require('es6-promise').Promise
jsonp    = require '../common/jsonp'
log      = require '../common/log'
settings = require '../common/settings'
storage  = require '../common/storage'
util     = require '../common/util'

class SyncResult
  constructor: (@completed = [], @discarded = [], @requeued = []) ->
  complete: (completed) => return new SyncResult(@completed.concat([ completed ]), @discarded, @requeued)
  discard:  (discarded) => return new SyncResult(@completed, @discarded.concat([ discarded ]), @requeued)
  requeue:  (requeued)  => return new SyncResult(@completed, @discarded, @requeued.concat([ requeued ]))

module.exports = class ApiRecorder
  apiKey     : null                # API key
  apiRoot    : "//api.mynaweb.com" # API root URL
  storageKey : "myna"              # storage key for the persisted event queue
  timeout    : 1000                # timeout for API requests
  attempts   : 5                   # number of timeouts / error 500s before giving up

  # clientConfig -> ApiRecorder
  constructor: (options) ->
    @apiKey     = options.apiKey     ? @apiKey     ? log.error("record.configure", "missing config key: apiKey", options)
    @apiRoot    = options.apiRoot    ? @apiRoot    ? log.error("record.configure", "missing config key: apiRoot", options)
    @storageKey = options.storageKey ? @storageKey ? log.error("record.configure", "missing config key: storageKey", options)
    @timeout    = options.timeout    ? @timeout    ? log.error("record.configure", "missing config key: timeout", options)
    @attempts   = options.attempts   ? @attempts   ? log.error("record.configure", "missing config key: attempts", options)
    return

  # Enqueue a view event to be transmitted to the server,
  # and return the number of outstanding events in the queue.
  #
  # experiment variant -> number
  view: (expt, variant) =>
    event =
      typename:   "view"
      experiment: expt.uuid
      variant:    variant.id
      timestamp:  util.dateToString(new Date())

    log.debug('ApiRecorder.view', event)

    @_enqueue(event)

  # Enqueue a view event to be transmitted to the server,
  # and return the number of outstanding events in the queue.
  #
  # experiment variant -> number
  reward: (expt, variant, amount) =>
    event = {
      typename:   "reward"
      experiment: expt.uuid
      variant:    variant.id
      amount:     amount
      timestamp:  util.dateToString(new Date())
    }

    log.debug('ApiRecorder.reward', event)

    @_enqueue(event)

  # Call the `record` endpoint on the Myna API servers, synchronising view/reward
  # events from local storage.
  #
  # If any events cannot be submitted to the server they are requeued for future
  # submission.
  #
  # Callback functions are passed two arguments: an array of successfully submitted
  # events and an array of requeued events.
  #
  # -> promiseOf(syncResult)
  #
  # where syncResult: { completed: arrayOf(event), discarded: arrayOf(event), requeued: arrayOf(event) }
  sync: =>
    log.debug('ApiRecorder.sync', @_queue().length)

    # event arrayOf(event) -> promiseOf(arrayOf(event))
    syncOne = (event, accum = new SyncResult) =>
      # log.debug("ApiRecorder.sync.syncOne", event, accum)

      params = util.extend({}, event, { apikey: @apiKey })
      params = util.deleteKeys(params, 'experiment')

      # log.debug("ApiRecorder.sync.syncOne", 'params', params)

      jsonp
      .request("#{@apiRoot}/v2/experiment/#{event.experiment}/record", params, @timeout)
      .then (response) =>
        syncOne(accum.complete(event))
      .catch (response) =>
        if response.status && response.status >= 500
          accum.requeue(event)
        else
          accum.discard(event)

    syncAll = (accum = new SyncResult) =>
      # log.debug("ApiRecorder.sync.syncAll", accum)

      event = @_dequeue()

      if event
        syncOne(event, accum).then(syncAll)
      else
        @_enqueue(accum.requeued...)
        Promise.resolve(accum)

    return syncAll()

  # -> arrayOf(event)
  _queue: =>
    ans = storage.get(@storageKey) ? []
    # log.debug('ApiRecorder._queue', ans)
    ans

  # event... -> number
  _enqueue: (events...) =>
    # log.debug('ApiRecorder._enqueue', events...)
    queue = @_queue().concat(events...)
    # log.debug('ApiRecorder._enqueue', 'queue', queue)
    storage.set(@storageKey, queue)
    # log.debug('ApiRecorder._enqueue', 'queue set')
    queue.length

  # -> or(event null)
  _dequeue: =>
    queue = @_queue()
    if queue.length > 0
      event = queue.shift()
      storage.set(@storageKey, queue)
      event
    else
      null
