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
  # arrayOf(experiment) settings -> DefaultClient
  constructor: (experiments = [], settings = {}) ->
    log.debug("Client.constructor", settings)

    @settings = settings.create(settings)
    @apiKey   = @settings.apiKey  ? log.error("Client.constructor", "no apiKey in settings", @settings)
    @apiRoot  = @settings.apiRoot ? "//api.mynaweb.com"
    @sticky   = new StickyCache()
    @record   = new ApiRecorder(@settings)
    @google   = new GaRecorder(@settings)

    @experiments = {}
    for expt in experiments then @experiments[expt.id] = expt

  # string -> promiseOf(variant)
  suggest: (exptId) =>
    @_withExperiment exptId, (expt) ->
      @sticky.loadView(expt).catch (error) ->
        # Only record on a first view:
        super(expt).then (variant) ->
          @sticky.saveView(variant)
          @google.view(expt, variant)
          @record.view(expt, variant)
          @record.sync()
          variant

  # string or(variant, string) -> promiseOf(variant)
  view: (exptId, variantOrId) =>
    @_withExperiment exptId, (expt) ->
      @sticky.loadView(expt).catch (error) ->
        # Only record on a first view:
        super(expt, variantOrId).then (variant) ->
          @sticky.saveView(variant)
          @google.view(expt, variant)
          @record.view(expt, variant)
          @record.sync()
          variant

  # string [0-to-1] -> promiseOf(variant)
  reward: (exptId, amount = 1.0) =>
    @_withExperiment exptId, (expt) ->
      @sticky.loadReward(expt).catch (error) ->
        # Only record on a first view:
        super(expt, amount).then (variant) ->
          @sticky.saveReward(variant)
          @google.reward(expt, variant, amount)
          @record.reward(expt, variant, amount)
          @record.sync().then(-> variant)

  # string -> promiseOf(null)
  clear: (exptId) =>
    @_withExperiment exptId, (expt) ->
      super(expt)
      @sticky.clear(expt)
      Promise.resolve(null)

  # string (experiment -> promiseOf(any)) -> promiseOf(any)
  _withExperiment: (exptId, func) =>
    expt = @experiments[exptId]
    unless expt
      Promise.reject(new Error("Experiment not found: #{exptId}"))
    else
      func(expt)
