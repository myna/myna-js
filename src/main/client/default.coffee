Promise      = require('es6-promise').Promise
log          = require '../common/log'
settings     = require '../common/settings'
CachedClient = require './cached'
StickyCache  = require './sticky'
ApiRecorder  = require './api'
GaRecorder   = require './ga'

###
Standard suggest/view/reward client.

Does everything the Sticky client does, plus persists views/rewards
back to the API server and to Google Analytics when appropriate.
###

module.exports = class DefaultClient extends CachedClient
  # arrayOf(experiment) object -> DefaultClient
  constructor: (experiments = [], options = {}) ->
    log.debug("Client.constructor", options)

    @settings = settings.create(options)
    @apiKey   = @settings.apiKey  ? log.error("Client.constructor", "no apiKey in settings", @settings)
    @apiRoot  = @settings.apiRoot ? "//api.mynaweb.com"
    @sticky   = new StickyCache()
    @record   = new ApiRecorder(@settings)
    @google   = new GaRecorder()

    @experiments = {}
    for expt in experiments then @experiments[expt.id] = expt

  # or(experiment, string) -> promiseOf(variant)
  suggest: (exptOrId) =>
    log.debug('DefaultClient.view', exptOrId)
    @_withExperiment(exptOrId).then (expt) =>
      @_withStickyView(expt).catch (error) =>
        # Only record on a first view:
        super(expt).then (variant) =>
          @sticky.saveView(expt, variant)
          @google.view(expt, variant)
          @record.view(expt, variant)
          @record.sync() # async
          variant

  # or(experiment, string) or(variant, string) -> promiseOf(variant)
  view: (exptOrId, variantOrId) =>
    log.debug('DefaultClient.view', exptOrId, variantOrId)
    @_withExperiment(exptOrId).then (expt) =>
      @_withStickyView(expt).catch (error) =>
        # Only record on a first view:
        super(expt, variantOrId).then (variant) =>
          @sticky.saveView(expt, variant)
          @google.view(expt, variant)
          @record.view(expt, variant)
          @record.sync() # async
          variant

  # or(experiment, string) [0-to-1] -> promiseOf(variant)
  reward: (exptOrId, amount = 1.0) =>
    log.debug('DefaultClient.reward', exptOrId, amount)
    @_withExperiment(exptOrId).then (expt) =>
      @_withStickyReward(expt).catch (error) =>
        # Only record on a first view:
        super(expt, amount).then (variant) =>
          @sticky.saveReward(expt, variant)
          @google.reward(expt, variant, amount)
          @record.reward(expt, variant, amount)
          @record.sync().then(-> variant)

  # or(experiment, string) -> promiseOf(null)
  clear: (exptOrId) =>
    log.debug('DefaultClient.clear', exptOrId)
    @_withExperiment(exptOrId).then (expt) =>
      super(expt)
      @sticky.clear(expt)
      Promise.resolve(null)

  # or(experiment, string) -> promiseOf(experiment)
  _withExperiment: (exptOrId) =>
    if typeof exptOrId == "string"
      expt = @experiments[exptOrId]
    else
      expt = exptOrId

    # log.debug('DefaultClient._withExperiment', exptOrId, expt?.id)

    if expt
      Promise.resolve(expt)
    else
      Promise.reject(new Error("Experiment not found: #{exptOrId}"))

  # experiment -> promiseOf(variant)
  _withStickyView: (expt) =>
    variant = @sticky.loadView(expt)
    # console.log('DefaultClient._withStickyView', expt?.id, variant?.id)
    if variant
      Promise.resolve(variant)
    else
      Promise.reject(new Error("Sticky view not found: #{expt}"))

  # experiment -> promiseOf(variant)
  _withStickyReward: (expt) =>
    variant = @sticky.loadReward(expt)
    # console.log('DefaultClient._withStickyReward', expt?.id, variant?.id)
    if variant
      Promise.resolve(variant)
    else
      Promise.reject(new Error("Sticky reward not found: #{expt}"))
