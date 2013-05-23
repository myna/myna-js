class Myna.HtmlExperiment extends Myna.Experiment
  constructor: (options = {}) ->
    Myna.log("Myna.HtmlExperiment.constructor", options)
    super(options)
    @binder = options.binder ? new Myna.Binder()

  bind: =>
    Myna.log("Myna.HtmlExperiment.bind")
    @binder.bind(this)
    return

class Myna.HtmlClient extends Myna.Client
  createExperiment: (options) ->
    new Myna.HtmlExperiment(options)

  bind: =>
    Myna.log("Myna.HtmlClient.bind")
    for id, expt of @experiments then expt.bind()
    return

Myna.initLocal = (options) ->
  Myna.log("Myna.initLocal", options)

  apiKey      = options.apiKey      ? throw "no apiKey specified"
  apiRoot     = options.apiRoot     ? "//api.mynaweb.com"
  experiments = options.experiments ? []

  new Myna.HtmlClient({ apiKey, apiRoot, experiments })

Myna.initApi = (options) ->
  Myna.log("Myna.initRemote", options)

  apiKey  = options.apiKey  ? throw "no apiKey specified"
  apiRoot = options.apiRoot ? "//api.mynaweb.com"
  success = options.success ? (->)
  error   = options.error   ? (->)

  Myna.jsonp.request
    url:     "#{apiRoot}/v2/experiment"
    params:  apikey: apiKey
    success: (json) ->
      Myna.log("Myna.initRemote", "response", json)
      client = Myna.initLocal({ apiKey, apiRoot, experiments: json.results })
      Myna.$(-> client.bind())
      success(client)
    error:   error
