class Myna.Client
  constructor: (options = {}) ->
    Myna.log("Myna.Client.constructor", options)

    @uuid        = options.uuid       ? null
    @apiKey      = options.apiKey     ? Myna.error("Myna.Deployment.constructor", "no apiKey in options", options)
    @apiRoot     = options.apiRoot    ? "//api.mynaweb.com"
    @settings    = new Myna.Settings(options.settings ? {})

    @experiments = {}
    for expt in (options.experiments ? [])
      @experiments[expt.id] = expt

  suggest: (exptId, success = (->), error = (->)) =>
    @experiments[exptId].suggest(success, error)

  view: (exptId, variantId, success = (->), error = (->)) =>
    @experiments[exptId].view(variantId, success, error)

  reward: (exptId, amount = 1.0, success = (->), error = (->)) =>
    @experiments[exptId].reward(amount, success, error)
