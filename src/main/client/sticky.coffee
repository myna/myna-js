Promise  = require('es6-promise').Promise
log      = require '../common/log'
settings = require '../common/settings'
variant  = require './variant'

###
Sticky suggest/view/reward client.

Does everything the Memoized client does, plus supports
experiments with the `myna.web.sticky` setting.
###

module.exports = class StickyCache
  # string -> StickyCache
  constructor: (@stickyKey = "myna.web.sticky") ->

  # Load the last sticky view for `expt`.
  #
  # If there is no last view, or the experiment does not use sticky variants, fail.
  #
  # experiment -> or(variant, null)
  loadView: (expt) =>
    log.debug('StickyCache.loadView', expt)
    if @_isSticky(expt) then variant.load(expt, 'stickyView') else null

  # Attempt to save a sticky view for `expt`.
  #
  # If the experiment does not use sticky variants, do nothing.
  #
  # experiment variant -> void
  saveView: (expt, vrnt) =>
    log.debug('StickyCache.saveView', expt, vrnt)
    if @_isSticky(expt) then variant.save(expt, 'stickyView', vrnt)
    return

  # Load the last sticky reward variant for `expt`.
  #
  # If there is no last reward, or the experiment does not use sticky variants, fail.
  #
  # experiment -> or(variant, null)
  loadReward: (expt) =>
    log.debug('StickyCache.loadReward', expt)
    if @_isSticky(expt) then variant.load(expt, "stickyReward") else null

  # Attempt to save a sticky reward for `expt`.
  #
  # If the experiment does not use sticky variants, do nothing.
  #
  # experiment variant -> void
  saveReward: (expt, vrnt) =>
    log.debug('StickyCache.saveReward', expt, vrnt)
    if @_isSticky(expt) then variant.save(expt, 'stickyReward', vrnt)
    return

  # Clear any cached sticky variants and variants from previous calls
  # to `suggest()`, `view()`, or `reward()`.
  #
  # experiment -> void
  clear: (expt) =>
    log.debug('StickyCache.clear', expt)
    variant.remove(expt, 'stickyView')
    variant.remove(expt, 'stickyReward')
    return

  # Does this experiment use sticky variants?
  #
  # experiment -> boolean
  _isSticky: (expt) ->
    !!settings.get(expt.settings, @stickyKey, false)
