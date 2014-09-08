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
    log.debug("DefaultClient.constructor", options)
    @apiKey   = options.apiKey  ? log.error("Client.constructor", "no apiKey specified", options)
    @apiRoot  = options.apiRoot ? "//api.mynaweb.com"
    @settings = settings.create(options?.settings ? {})
    @sticky   = new StickyCache()
    @record   = new ApiRecorder(@apiKey, @apiRoot, @settings)
    @google   = new GaRecorder(@settings)
    @autoSync = settings.get(@settings, "myna.web.autoSync", true)

    @experiments = {}
    for expt in experiments then @experiments[expt.id] = expt

  # or(experiment, string) -> promiseOf(variant)
  suggest: (exptOrId) =>
    log.debug('DefaultClient.suggest', exptOrId)
    @_withExperiment(exptOrId).then (expt) =>
      @_withStickyView(expt).catch (error) =>
        # Only record on a first view:
        super(expt).then (variant) =>
          @sticky.saveView(expt, variant)
          @google.view(expt, variant)
          @record.view(expt, variant)
          if @autoSync then @record.sync() # asynchronous
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
          if @autoSync then @record.sync() # asynchronous
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
          if @autoSync
            @record.sync().then(-> variant) # synchronous
          else
            variant

  # or(experiment, string) -> promiseOf(null)
  clear: (exptOrId) =>
    log.debug('DefaultClient.clear', exptOrId)
    @_withExperiment(exptOrId).then (expt) =>
      super(expt).then =>
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
    # log.debug('DefaultClient._withStickyView', expt?.id, variant?.id)
    if variant
      Promise.resolve(variant)
    else
      Promise.reject(new Error("Sticky view not found: #{expt}"))

  # experiment -> promiseOf(variant)
  _withStickyReward: (expt) =>
    variant = @sticky.loadReward(expt)
    # log.debug('DefaultClient._withStickyReward', expt?.id, variant?.id)
    if variant
      Promise.resolve(variant)
    else
      Promise.reject(new Error("Sticky reward not found: #{expt}"))
