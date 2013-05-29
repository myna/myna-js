class Myna.Client extends Myna.Logging
  constructor: (options = {}) ->
    @log("constructor", options)

    @experiments = {}
    for data in (options.experiments ? [])
      expt = if data instanceof Myna.ExperimentBase then data else new Myna.ExperimentSummary(data)
      @experiments[expt.id] = expt

  suggest: (exptId, success = (->), error = (->)) =>
    @experiments[exptId].suggest(success, error)

  view: (exptId, variantId, success = (->), error = (->)) =>
    @experiments[exptId].view(variantId, success, error)

  reward: (exptId, amount = 1.0, success = (->), error = (->)) =>
    @experiments[exptId].reward(amount, success, error)
