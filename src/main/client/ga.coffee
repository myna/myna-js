log      = require '../common/log'
settings = require '../common/settings'

module.exports = class GaRecorder
  constructor: (settings) ->
    # No configuration necessary

  view = (expt, variant) =>
    log.debug("GoogleAnalytics.recordView", expt, variant, success, error)
    if @_enabled(expt) then _gaq?.push @_viewEvent(expt, variant)
    success()

  reward = (expt, variant, amount) =>
    log.debug("GoogleAnalytics.recordReward", expt, variant, success, error)
    if @_enabled(expt) then _gaq?.push @_rewardEvent(expt, variant, amount)
    success()

  _viewEvent = (expt, variant) =>
    ["_trackEvent", "myna", @_eventName(expt, "view"), variant.id, null, false]

  _rewardEvent = (expt, variant, amount) =>
    # The "amount" field in _trackEvent is an integer.
    # We have to scale the reward amount up to make it greater than 1.
    multiplier = @_rewardMultiplier(expt)
    ["_trackEvent", "myna", @_eventName(expt, "reward"), variant.id, Math.round(multiplier * amount), true]

  _enabled: (expt) =>
    settings.get(expt.settings, "myna.web.googleAnalytics.enabled", true)

  _eventName: (expt, event) =>
    settings.get(expt.settings, "myna.web.googleAnalytics.#{event}Event") ? "#{expt.id}-#{event}"

  _rewardMultiplier: (expt) =>
    settings.get(expt.settings, "myna.web.googleAnalytics.rewardMultiplier", 100)
