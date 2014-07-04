log    = require './log'
Events = require './events'

class GoogleAnalytics extends Events
  constructor: (client) ->
    log.debug("GoogleAnalytics.constructor", client)
    @client = client

  # Start listening for results
  init: =>
    for id, expt of @client.experiments
      @listenTo(expt)

  listenTo: (expt) =>
    log.debug("GoogleAnalytics.listenTo", expt.id)

    expt.on 'recordView', (variant, success, error) =>
      @recordView(expt, variant, success, error)

    expt.on 'recordReward', (variant, amount, success, error) =>
      @recordReward(expt, variant, amount, success, error)

  # Record methods:

  recordView: (expt, variant, success = (->), error = (->)) =>
    log.debug("GoogleAnalytics.recordView", expt, variant, success, error)
    if @enabled(expt) then _gaq?.push @viewEvent(expt, variant)
    success()

  recordReward: (expt, variant, amount, success = (->), error = (->)) =>
    log.debug("GoogleAnalytics.recordReward", expt, variant, success, error)
    if @enabled(expt) then _gaq?.push @rewardEvent(expt, variant, amount)
    success()

  # Event constructors:

  viewEvent: (expt, variant) =>
    ["_trackEvent", "myna", @eventName(expt, "view"), variant.id, null, false]

  rewardEvent: (expt, variant, amount) =>
    # The "amount" field in _trackEvent is an integer.
    # We have to scale the reward amount up to make it greater than 1.
    m = @rewardMultiplier(expt)
    ["_trackEvent", "myna", @eventName(expt, "reward"), variant.id, Math.round(m * amount), true]

  # Settings:

  enabled: (expt) =>
    expt.settings.get("myna.web.googleAnalytics.enabled", true)

  eventName: (expt, event) =>
    expt.settings.get("myna.web.googleAnalytics.#{event}Event") ? "#{expt.id}-#{event}"

  rewardMultiplier: (expt) =>
    expt.settings.get("myna.web.googleAnalytics.rewardMultiplier", 100)

module.exports = GoogleAnalytics