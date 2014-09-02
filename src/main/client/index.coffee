log      = require '../common/log'
settings = require '../common/settings'

module.exports = class Client
  constructor: (options = {}) ->
    log.debug("Client.constructor", options)

    @uuid     = options.uuid    ? null
    @apiKey   = options.apiKey  ? log.error("Client.constructor", "no apiKey in options", options)
    @apiRoot  = options.apiRoot ? "//api.mynaweb.com"
    @settings = settings.create options.settings ? {}

    @experiments = {}
    for expt in (options.experiments ? [])
      @experiments[expt.id] = expt

  suggest: (exptId, success = (->), error = (->)) =>
    @experiments[exptId].suggest(success, error)

  view: (exptId, variantId, success = (->), error = (->)) =>
    @experiments[exptId].view(variantId, success, error)

  reward: (exptId, amount = 1.0, success = (->), error = (->)) =>
    @experiments[exptId].reward(amount, success, error)
