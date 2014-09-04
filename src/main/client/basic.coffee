Promise = require('es6-promise').Promise
log     = require '../common/log'

###
Basic suggest/view/reward client.

Simply suggests variants. Doesn't remember suggestions,
and doesn't support any experiment or variant settings.
###

module.exports = class BasicClient
  # experiment -> promiseOf(variant)
  suggest: (expt) ->
    log.debug("BasicClient.suggest", expt)
    @_randomVariant(expt)

  # experiment or(variant, string) -> promiseOf(variant)
  view: (expt, variantOrId) ->
    log.debug("BasicClient.view", expt, variantOrId)
    @_lookupVariant(expt, variantOrId).then (variant) ->
      variant

  # experiment or(variant, string) [number] -> promiseOf(variant)
  reward: (expt, variantOrId, amount = 1.0) ->
    log.debug("BasicClient.reward", expt, variantOrId, amount)
    @_lookupVariant(expt, variantOrId)

  # experiment -> number
  _totalWeight: (expt) ->
    log.debug("BasicClient._totalWeight", expt)
    ans = 0.0
    for variant in expt.variants then ans += variant.weight
    ans

  # experiment -> promiseOf(variant)
  _randomVariant: (expt) ->
    log.debug("BasicClient._randomVariant", expt)
    total  = @_totalWeight(expt)
    random = Math.random() * total
    for id, variant of expt.variants
      total -= variant.weight
      if total <= random
        log.debug("BasicClient.randomVariant", @id, variant.id)
        return Promise.resolve(variant)
    log.debug("BasicClient.randomVariant", @id, null)
    return Promise.reject(null)

  # experiment or(variant, string) -> promiseOf(variant)
  _lookupVariant: (expt, variantOrId) ->
    log.debug("BasicClient._lookupVariant", expt, variantOrId)

    id = if variantOrId.id then variantOrId.id else variantOrId
    for v in expt.variants when v.id == id
      variant = v
      break

    log.debug("BasicClient._lookupVariant", "id", id)
    log.debug("BasicClient._lookupVariant", "variant", variant)

    if variant
      Promise.resolve(variant)
    else
      Promise.reject(new Error("Variant not found: #{id}"))
