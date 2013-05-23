class Myna.Client
  constructor: (options = {}) ->
    @apiKey  = options.apiKey  ? throw "apiKey not specified in options"
    @apiRoot = options.apiRoot ? '//api.mynaweb.com'

    @experiments = {}
    for data in (options.experiments ? [])
      if data instanceof Myna.Experiment
        @experiments[data.id] = data
      else
        @experiments[data.id] = new Myna.Experiment(Myna.extend(data, { @apiKey, @apiRoot }))

  suggest: (exptId, success = (->), error = (->)) =>
    @experiments[exptId].suggest(success, error)

  view: (exptId, variantId, success = (->), error = (->)) =>
    @experiments[exptId].view(variantId, success, error)

  reward: (exptId, amount = 1.0, success = (->), error = (->)) =>
    @experiments[exptId].reward(amount, success, error)
