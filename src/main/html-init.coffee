class Myna.HtmlExperiment extends Myna.Experiment
  constructor: (options = {}) ->
    Myna.log("Myna.HtmlExperiment.constructor", options)
    super(options)
    @binder = options.binder ? new Myna.Binder()

    @on 'afterView', (variant) =>
      @binder.bind(this, variant, options)

  preview: (variant, options = { goal: false }) =>
    Myna.log("Myna.HtmlExperiment.preview", variant)
    if typeof variant == "string" then variant = @variants[variant]
    @binder.bind(this, variant, options)
    return


class Myna.HtmlClient extends Myna.Client
  createExperiment: (options) ->
    new Myna.HtmlExperiment(options)

  onload: =>
    Myna.log("Myna.HtmlClient.onload")
    if window.location.hash == "#debug" then @showToolbar()
    for id, expt of @experiments then expt.suggest()
    return

  showToolbar: =>
    Myna.log("Myna.HtmlClient.showToolbar")
    @toolbar = new Myna.Toolbar(this)
    @toolbar.show()

  preview: (exptId, variantId, options = { goal: false }) =>
    @experiments[exptId]?.preview(variantId, options)

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
      Myna.$(client.onload)
      success(client)
    error:   error
