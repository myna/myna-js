$               = require 'jquery'
log             = require './log'
hash            = require './hash'
jsonp           = require './jsonp'
Client          = require './client'
Recorder        = require './recorder'
Experiment      = require './experiment'
Binder          = require './binder'
Inspector       = require './inspector'
GoogleAnalytics = require './google-analytics'

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

  if hash.preview() && options.latest
    Myna.initRemote { url: options.latest }
  else
    Myna.initLocal(options)

  return

# deploymentJson -> void
Myna.initLocal = (options) ->
  log.debug("Myna.init", options)

  apiKey               = options.apiKey  ? log.error("Myna.init", "no apiKey in options", options)
  apiRoot              = options.apiRoot ? "//api.mynaweb.com"
  experiments          = for expt in (options.experiments ? []) then new Experiment(expt)
  Myna.client          = new Client({ apiKey, apiRoot, experiments })
  Myna.recorder        = new Recorder(Myna.client)
  Myna.binder          = new Binder(Myna.client)
  Myna.googleAnalytics = new GoogleAnalytics(Myna.client)

  if hash.preview()
    Myna.inspector = new Inspector(Myna.client, Myna.binder)
    $ ->
      Myna.triggerReady(Myna.client)
      Myna.inspector.init()
      Myna.binder.init()
  else
    $ ->
      Myna.triggerReady(Myna.client)
      Myna.recorder.init()
      Myna.googleAnalytics.init()
      Myna.binder.init()

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
      success(Myna.initLocal(json))
    error:   error

  return

module.exports = Myna
