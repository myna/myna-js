Promise = require('es6-promise').Promise
log     = require '../common/log'
variant = require './variant'

###
Basic suggest/view/reward client.

Simply suggests variants. Doesn't remember suggestions,
and doesn't support any experiment or variant settings.
###

module.exports = class BasicClient
  # experiment -> promiseOf(variant)
  suggest: (expt) =>
    log.debug("BasicClient.suggest", expt)
    @_random(expt).then (variant) =>
      log.debug("BasicClient.suggest", "variant", variant)
      variant

  # experiment or(variant, string) -> promiseOf(variant)
  view: (expt, variantOrId) =>
    log.debug("BasicClient.view", expt, variantOrId)
    @_lookup(expt, variantOrId).then (variant) =>
      log.debug("BasicClient.view", "variant", variant)
      variant

  # experiment or(variant, string) [number] -> promiseOf(variant)
  reward: (expt, variantOrId, amount = 1.0) =>
    log.debug("BasicClient.reward", expt, variantOrId, amount)
    @_lookup(expt, variantOrId)

  _random: (expt) =>
    ans = variant.random(expt)
    if ans
      Promise.resolve(ans)
    else
      Promise.reject(new Error("Could not choose random variant"))

  _lookup: (expt, variantOrId) =>
    ans = variant.lookup(expt, variantOrId)
    if ans
      Promise.resolve(ans)
    else
      Promise.reject(new Error("Could not choose random variant"))
