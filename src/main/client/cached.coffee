Promise     = require('es6-promise').Promise
log         = require '../common/log'
BasicClient = require './basic'
storage     = require './storage'

###
Cached suggest/view/reward client.

Remembers the last-suggested variant so you don't have to
pass it back into the reward() method.

Rewarding avariant clears the client's memory allowing you
to perform another suggest/reward cycle.

Doesn't contact the server to record views/rewards.
###

module.exports = class CachedClient extends BasicClient
  # Suggest a variant.
  #
  # Remembers the last-suggested variant for use in reward().
  #
  # experiment -> promiseOf(variant)
  suggest: (expt) ->
    super(expt).then (variant) ->
      storage.save(expt, "lastView", variant)
      variant

  view: (expt, variantOrId) ->
    super(expt, variantOrId).then (variant) ->
      storage.save(expt, "lastView", variant)
      variant

  # Reward the last variant to be returned by suggest() or view().
  #
  # Clears the last viewed variant on completion to avoid double-rewards.
  #
  # experiment 0-to-1 -> promiseOf(variant)
  reward: (expt, amount = 1.0) ->
    lastView = storage.load(expt, "lastView")
    if lastView
      super(expt, lastView, amount).then (variant) ->
        storage.clear(expt, "lastView")
        variant
    else
      Promise.reject(new Error("No last view for experiment #{expt.id} (#{expt.uuid})"))

  # Clear any storaged variants from the last view of `expt`.
  #
  # experiment -> void
  clear: (expt) ->
    cache.clear(expt, 'lastView')
    return
