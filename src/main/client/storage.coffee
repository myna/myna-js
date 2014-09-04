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
  if expt.settings.myna?.web?.sticky
    storage.set("#{expt.uuid}_#{storageKey}", variant.id)
  return

# Returns any memoized variant cached against `storageKey`.
#
# experiment string -> or(variant, null)
load = (expt, storageKey) ->
  if expt.settings.myna?.web?.sticky
    id = storage.get("#{expt.uuid}_#{storageKey}", null)
    if id then expt.variants[id] else null
  else null

# Clear any memoized variants for `expt` and `storageKey`.
#
# experiment string -> void
clear = (expt, storageKey) ->
  storage.unset("#{expt.uuid}_#{storageKey}")
  return

module.exports = {
  save
  load
  clear
}