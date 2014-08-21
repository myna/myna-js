log      = require './log'
Settings = require './settings'

class Client
  constructor: (options = {}) ->
    log.debug("Client.constructor", options)

    @uuid        = options.uuid       ? null
    @apiKey      = options.apiKey     ? log.error("Client.constructor", "no apiKey in options", options)
    @apiRoot     = options.apiRoot    ? "//api.mynaweb.com"
    @settings    = new Settings(options.settings ? {})

    @experiments = {}
    for expt in (options.experiments ? [])
      @experiments[expt.id] = expt

  suggest: (exptId, success = (->), error = (->)) =>
    @experiments[exptId].suggest(success, error)

  view: (exptId, variantId, success = (->), error = (->)) =>
    @experiments[exptId].view(variantId, success, error)

  reward: (exptId, amount = 1.0, success = (->), error = (->)) =>
    @experiments[exptId].reward(amount, success, error)

module.exports = Client