class Myna.Client
  constructor: (options = {}) ->
    @apiRoot = options.apiRoot ? '//api.mynaweb.com'
    @apiKey = options.apiKey  ? Myna.error("Myna.Client.constructor", "no apiKey in options", options)
    @experiments = {}
    for json in (options.experiments ? [])
      expt = new Myna.Experiment(json)
      @experiments[expt.id] = expt

  suggest: (exptId, success = (->), error = (->)) =>
    @experiments[exptId].suggest(success, error)

  view: (exptId, variantId, success = (->), error = (->)) =>
    @experiments[exptId].view(variantId, success, error)

  reward: (exptId, amount = 1.0, success = (->), error = (->)) =>
    @experiments[exptId].reward(amount, success, error)
