Promise     = require('es6-promise').Promise
log         = require '../common/log'
BasicClient = require './basic'
variant     = require './variant'

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
  suggest: (expt) =>
    log.debug("CachedClient.suggest", expt)
    super(expt).then (vrnt) =>
      log.debug("CachedClient.suggest", "variant", vrnt)
      variant.save(expt, 'lastView', vrnt)
      vrnt

  # View a variant.
  #
  # Remembers the last-viewed variant for use in reward().
  #
  # experiment or(variant string) -> promiseOf(variant)
  view: (expt, variantOrId) =>
    log.debug("CachedClient.view", expt, variantOrId)
    super(expt, variantOrId).then (vrnt) =>
      log.debug("CachedClient.view", "variant", vrnt)
      variant.save(expt, 'lastView', vrnt)
      vrnt

  # Reward the last variant to be returned by suggest() or view().
  #
  # Clears the last viewed variant on completion to avoid double-rewards.
  #
  # experiment 0-to-1 -> promiseOf(variant)
  reward: (expt, amount = 1.0) =>
    log.debug("CachedClient.reward", expt, amount)
    lastView = variant.load(expt, 'lastView')
    log.debug("lastView", lastView)
    if lastView
      super(expt, lastView, amount).then (vrnt) =>
        log.debug("CachedClient.reward", "variant", vrnt)
        variant.remove(expt, 'lastView')
        vrnt
    else
      log.debug("suffering epic fail")
      Promise.reject(new Error("No last view for experiment #{expt.id} (#{expt.uuid})"))

  # Clear any cached variants from the last view of `expt`.
  #
  # experiment -> void
  clear: (expt) =>
    log.debug("CachedClient.clear", expt)
    variant.remove(expt, 'lastView')
    return
