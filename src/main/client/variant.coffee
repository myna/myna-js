Promise = require('es6-promise').Promise
log     = require '../common/log'
storage = require '../common/storage'

###
Wrapper for `common/storage.coffee` that stores variants.

The user can save a previously viewed/rewarded variant by
providing a reference to an experiment, a variant, and a string key.

This functionality is used to implement:

 - *cached* versions of suggest/view/reward that do not require
   the user to keep track of the last suggested variant;

 - *sticky* experiments that attach users to particular variants
   for a consistent browsing experience.
###

# Saves `variant` against `storageKey`.
#
# This allows the variant to be looked up again in the future,
# bypassing recording a new view or reward.
#
# experiment string variant -> void
save = (expt, storageKey, variant) ->
  # log.debug('variant.save', expt, storageKey, variant)
  storage.set("#{expt.uuid}_#{storageKey}", variant.id)
  return

# Returns any memoized variant cached against `storageKey`.
#
# experiment string -> or(variant, null)
load = (expt, storageKey) ->
  # log.debug('variant.load', expt, storageKey)
  id = storage.get("#{expt.uuid}_#{storageKey}") ? null
  log.debug('variant.load', 'id', id)
  if id then lookup(expt, id) else null

# Clear any memoized variants for `expt` and `storageKey`.
#
# experiment string -> void
remove = (expt, storageKey) ->
  # log.debug('variant.remove', expt, storageKey)
  storage.remove("#{expt.uuid}_#{storageKey}")
  return

# experiment or(variant, string) -> or(variant, null)
lookup = (expt, variantOrId) ->
  # log.debug("variant.lookup", expt, variantOrId)
  id = if variantOrId.id then variantOrId.id else variantOrId
  for variant in expt.variants when variant.id == id
    return variant
  return null

# experiment -> or(variant, null)
random = (expt) ->
  # log.debug("variant.random", expt)
  total  = _totalWeight(expt)
  random = Math.random() * total
  for id, variant of expt.variants
    total -= variant.weight
    if total <= random
      # log.debug("variant.random", "result", variant)
      return variant
  # log.debug("variant.random", "noresult")
  return null

# experiment -> number
_totalWeight = (expt) ->
  # log.debug("variant._totalWeight", expt)
  ans = 0.0
  for variant in expt.variants then ans += variant.weight
  ans

module.exports = {
  save
  load
  remove
  lookup
  random
  _totalWeight
}