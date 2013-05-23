Myna.initLocal = (options) ->
  Myna.log("Myna.initLocal", options)

  apiKey      = options.apiKey      ? throw "no apiKey specified"
  apiRoot     = options.apiRoot     ? "//api.mynaweb.com"
  experiments = options.experiments ? []

  new Myna.Client({ apiKey, apiRoot, experiments })

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
      success( Myna.initLocal({ apiKey, apiRoot, experiments: json.results }) )
    error:   error
