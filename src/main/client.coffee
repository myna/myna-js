class Myna.Client
  constructor: (options = {}) ->
    @apiRoot = options.apiRoot ? '//api.mynaweb.com'
    @apiKey = options.apiKey  ? Myna.error("Myna.Client.constructor", "no apiKey in options", options)

    @cache = new Myna.Settings

    @experiments = {}
    for json in (options.experiments ? [])
      expt = new Myna.Experiment(json)
      @experiments[expt.uuid] = expt

  suggest: (uuid, success = (->), error = (->)) =>
    @experiments[uuid].suggest(success, error)

  reward: (uuid, amount = 1.0, success = (->), error = (->)) =>
    @experiments[uuid].reward(amount, success, error)
