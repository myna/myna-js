Myna.initLocal = (options) ->
  Myna.log("Myna.initLocal", options)

  apiKey      = options.apiKey      ? Myna.error("Myna.initLocal", "no apiKey in options", options)
  apiRoot     = options.apiRoot     ? "//api.mynaweb.com"
  debug       = options.debug       ? window.location.hash == "#debug"
  experiments = options.experiments ? []

  Myna.client = new Myna.Client({ apiKey, apiRoot, experiments })

  # Myna.client.binder = new Myna.Binder(options)
  # for id, expt of Myna.client.experiments
  #   Myna.client.binder.listenTo(expt)

  if debug
    Myna.client.toolbar = new Myna.Toolbar(Myna.client)
    Myna.$(Myna.client.toolbar.init)
  else
    Myna.client.recorder = new Myna.Recorder(options)
    for id, expt of Myna.client.experiments
      Myna.client.recorder.listenTo(expt)

  Myna.client

Myna.initApi = (options) ->
  Myna.log("Myna.initRemote", options)

  apiKey  = options.apiKey  ? Myna.error("Myna.Client.initApi", "no apiKey in options", options)
  apiRoot = options.apiRoot ? "//api.mynaweb.com"
  success = options.success ? (->)
  error   = options.error   ? (->)

  Myna.jsonp.request
    url:     "#{apiRoot}/v2/experiment"
    params:  apikey: apiKey
    success: (json) ->
      Myna.log("Myna.initRemote", "response", json)
      success(Myna.initLocal({ apiKey, apiRoot, experiments: json.results }))
    error:   error
