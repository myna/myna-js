Promise = require('es6-promise').Promise
log     = require '../common/log'

###
Basic suggest/view/reward client.

Simply suggests variants. Doesn't remember suggestions,
and doesn't support any experiment or variant settings.
###

module.exports = class BasicClient
  # experiment -> promiseOf(variant)
  suggest = (expt) ->
    log.debug("basic.suggest", expt)
    total  = _totalWeight(expt)
    random = Math.random() * total
    for id, variant of expt.variants
      total -= variant.weight
      if total <= random
        log.debug("basic.randomVariant", @id, variant.id)
        return Promise.resolve(variant)
    log.debug("basic.randomVariant", @id, null)
    return Promise.reject(null)

  # experiment or(variant, string) -> promiseOf(variant)
  view = (expt, variantOrId) ->
    _lookupVariant(expt, variantOrId).then (variant) ->
      variant

  # experiment variant [number] -> promiseOf(variant)
  reward = (expt, variant, amount = 1.0) ->
    _lookupVariant(expt, variant)

  # experiment -> number
  _totalWeight = (expt) ->
    ans = 0.0
    for id, variant of expt.variants
      ans += variant.weight
    ans

  # experiment or(variant, string) -> promiseOf(variant)
  _lookupVariant = (expt, variantOrId) ->
    id      = if variantOrId.id then variantOrId.id else variantOrId
    variant = expt.variants[id]

    if variant
      Promise.resolve(variant)
    else
      Promise.reject(new Error("Variant not found: #{id}"))
