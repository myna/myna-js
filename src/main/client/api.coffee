Promise  = require('es6-promise').Promise
jsonp    = require '../common/jsonp'
log      = require '../common/log'
settings = require '../common/settings'
storage  = require '../common/storage'
util     = require '../common/util'

class SyncResult
  constructor: (@completed = [], @discarded = [], @requeued = []) ->

  complete: (completed) =>
    new SyncResult(@completed.concat([ completed ]), @discarded, @requeued)

  discard: (discarded) =>
    new SyncResult(@completed, @discarded.concat([ discarded ]), @requeued)

  requeue: (requeued) =>
    new SyncResult(@completed, @discarded, @requeued.concat([ requeued ]))

  successful: =>
    @discarded.length == 0 && @requeued.length == 0

module.exports = class ApiRecorder
  # clientConfig -> ApiRecorder
  constructor: (@apiKey, @apiRoot, options = {}) ->
    unless @apiKey  then log.error("ApiRecorder.constructor", "missing apiKey")
    unless @apiRoot then log.error("ApiRecorder.constructor", "missing apiRoot")
    @storageKey = settings.get(options, "myna.web.storageKey", "myna")
    @timeout    = settings.get(options, "myna.web.timeout", 1000)
    @inProgress = null # or(promiseOf(SyncResult), null)
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
  # -> promiseOf(SyncResult)
  sync: =>
    log.debug('ApiRecorder.sync', @_queue().length)

    # event [SyncResult] -> promiseOf(SyncResult)
    syncOne = (event, accum = new SyncResult) =>
      log.debug("ApiRecorder.sync.syncOne", event, accum)

      params = util.extend({}, event, { apikey: @apiKey })
      params = util.deleteKeys(params, 'experiment')

      # log.debug("ApiRecorder.sync.syncOne", 'params', params)

      jsonp
      .request("#{@apiRoot}/v2/experiment/#{event.experiment}/record", params, @timeout)
      .then (response) =>
        log.debug("ApiRecorder.sync.syncOne.then", response)
        syncAll(accum.complete(event))
      .catch (response) =>
        log.debug("ApiRecorder.sync.syncOne.catch", response)
        if response.status && response.status >= 500
          accum.requeue(event)
        else
          accum.discard(event)

    # SyncResult -> promiseOf(SyncResult)
    syncAll = (accum = new SyncResult) =>
      log.debug("ApiRecorder.sync.syncAll", accum)

      event = @_dequeue()

      if event
        syncOne(event, accum).then(syncAll)
      else
        @_enqueue(accum.requeued...)
        Promise.resolve(accum)

    # any -> any
    onComplete = (result) =>
      log.debug("ApiRecorder.sync.onComplete", result)
      @inProgress = null
      result

    # any -> any
    onError = (result) =>
      log.debug("ApiRecorder.sync.onError", result)
      @inProgress = null
      Promise.reject(result)

    @inProgress ?= syncAll().then(onComplete, onError)
    @inProgress

  # -> void
  clear: =>
    log.debug("ApiRecorder.clear")
    storage.remove(@storageKey)
    return

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
