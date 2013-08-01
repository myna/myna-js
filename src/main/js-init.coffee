# deploymentJson -> void
Myna.init = (options) ->
  Myna.log("Myna.init", options)

  if Myna.preview() && options.latest
    Myna.initRemote { url: options.latest }
  else
    Myna.initLocal(options)

  return

# deploymentJson boolean -> void
Myna.initLocal = (options) ->
  Myna.log("Myna.init", options)

  apiKey      = options.apiKey  ? Myna.error("Myna.init", "no apiKey in options", options)
  apiRoot     = options.apiRoot ? "//api.mynaweb.com"
  experiments = for expt in (options.experiments ? [])
                  new Myna.Experiment(expt)

  Myna.client = new Myna.Client({ apiKey, apiRoot, experiments })

  if Myna.preview()
    Myna.inspector = new Myna.Inspector(Myna.client)
    Myna.$ ->
      Myna.inspector.init()
  else
    Myna.recorder = new Myna.Recorder(Myna.client)
    Myna.recorder.init()
    Myna.googleAnalytics = new Myna.GoogleAnalytics(Myna.client)
    Myna.googleAnalytics.init()

  Myna.client

# { url: string, success: deploymentJson -> void, error: ??? -> void } -> void
Myna.initRemote = (options) ->
  Myna.log("Myna.initRemote", options)

  url      = options.url     ? Myna.error("Myna.Client.initRemote", "no url specified in options", options)
  success  = options.success ? (->)
  error    = options.error   ? (->)

  Myna.jsonp.request
    url:     url
    success: (json) ->
      Myna.log("Myna.initRemote", "response", json)
      success(Myna.initLocal(json))
    error:   error

  return
