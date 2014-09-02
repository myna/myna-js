log             = require './common/log'
hash            = require './common/hash'
jsonp           = require './common/jsonp'
Client          = require './client'
Recorder        = require './client/recorder'
Experiment      = require './client/experiment'
GoogleAnalytics = require './client/google-analytics'

if hash.params.debug? then log.enabled = true

Myna = {}

# arrayOf(client -> void)
Myna.readyHandlers = []

# (client -> void) -> void
Myna.ready = (callback) ->
  if Myna.client then callback(Myna.client) else Myna.readyHandlers.push(callback)
  return

# client -> void
Myna.triggerReady = (client) ->
  for callback in Myna.readyHandlers
    callback.call(Myna, client)

# deploymentJson -> void
Myna.init = (options) ->
  log.debug("Myna.init", options)
  success = options.success ? (->)
  error   = options.error   ? (->)
  try
    client = Myna.initLocal(options)
    success(client)
  catch exn
    error(exn)
  return

# deploymentJson -> Myna.Client
Myna.initLocal = (options) ->
  log.debug("Myna.init", options)

  typename = options.typename
  unless typename == "deployment"
    log.error(
      "Myna.initLocal"
      """
      Myna needs a deployment to initialise. The given JSON is not a deployment.
      It has a typename of "#{typename}". Check you are initialising Myna with the
      correct UUID if you are calling initRemote
      """
      options
    )

  apiKey               = options.apiKey  ? log.error("Myna.init", "no apiKey in options", options)
  apiRoot              = options.apiRoot ? "//api.mynaweb.com"
  experiments          = for expt in (options.experiments ? []) then new Experiment(expt)
  Myna.client          = new Client({ apiKey, apiRoot, experiments })
  Myna.recorder        = new Recorder(Myna.client)
  Myna.googleAnalytics = new GoogleAnalytics(Myna.client)

  Myna.triggerReady(Myna.client)
  Myna.recorder.init()
  Myna.googleAnalytics.init()

  Myna.client

# { url: string, success: deploymentJson -> void, error: ??? -> void } -> void
Myna.initRemote = (options) ->
  log.debug("Myna.initRemote", options)

  url      = options.url     ? log.error("Myna.initRemote", "no url specified in options", options)
  success  = options.success ? (->)
  error    = options.error   ? (->)

  jsonp.request
    url:     url
    success: (json) ->
      log.debug("Myna.initRemote", "response", json)
      try
        client = Myna.initLocal(json)
        success(client)
      catch exn
        error(exn)
    error:   error

  return

module.exports = window.Myna = Myna
