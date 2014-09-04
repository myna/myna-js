Promise  = require('es6-promise').Promise
log      = require '../common/log'
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
  # experiment -> promiseOf(variant)
  loadView: (expt) =>
    stickyView = @_isSticky(expt) && variant.load(expt, 'stickyView')
    if stickyView
      Promise.resolve(stickyView)
    else
      Promise.reject(new Error("No cached sticky view"))

  # Attempt to save a sticky view for `expt`.
  #
  # If the experiment does not use sticky variants, do nothing.
  #
  # experiment variant -> void
  saveView: (expt, variant) =>
    if @_isSticky(expt) then variant.save(expt, 'stickyView', variant)
    return

  # Load the last sticky reward variant for `expt`.
  #
  # If there is no last reward, or the experiment does not use sticky variants, fail.
  #
  # experiment -> promiseOf(variant)
  loadReward: (expt) =>
    stickyReward = @_isSticky(expt) && variant.load(expt, "stickyReward")
    if stickyReward
      Promise.resolve(stickyReward)
    else
      Promise.reject(new Error("No cached sticky reward"))

  # Attempt to save a sticky reward for `expt`.
  #
  # If the experiment does not use sticky variants, do nothing.
  #
  # experiment variant -> void
  saveReward: (expt, variant) =>
    if @_isSticky(expt) then variant.save(expt, 'stickyReward', variant)
    return

  # Clear any cached sticky variants and variants from previous calls
  # to `suggest()`, `view()`, or `reward()`.
  #
  # experiment -> void
  clear: (expt) =>
    variant.remove(expt, 'stickyView')
    variant.remove(expt, 'stickyReward')
    return

  # Does this experiment use sticky variants?
  #
  # experiment -> boolean
  _isSticky: (expt) ->
    !!settings.get(expt.settings, @stickyKey, false)
