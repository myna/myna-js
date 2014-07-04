log      = require './log'
util     = require './util'
cache    = require './cache'
Events   = require './events'
Settings = require './settings'
Variant  = require './variant'

class BaseExperiment extends Events
  constructor: (options = {}) ->
    super(options)
    log.debug("BaseExperiment.constructor", options)
    @uuid      = options.uuid ? log.error("BaseExperiment.constructor", @id, "no uuid in options", options)
    @id        = options.id   ? log.error("BaseExperiment.constructor", @id, "no id in options", options)
    @settings  = new Settings(options.settings ? {})

    @variants = {}
    for data in (options.variants ? [])
      @variants[data.id] = new Variant(data)

  # (variant -> void) (any -> void) -> void
  suggest: (success = (->), error = (->)) =>
    variants = @loadVariantsForSuggest()
    log.debug("BaseExperiment.suggest", @id, variants.variant?.id, variants.viewed?.id)
    @viewVariant(util.extend({ success, error }, variants))
    return

  loadVariantsForSuggest: =>
    { variant: @randomVariant(), viewed: @loadLastView() }

  # or(string, variant) -> { variant: variant, viewed: or(variant, undefined) } -> undefined
  view: (variantOrId, success = (->), error = (->)) =>
    variants = @loadVariantsForView(variantOrId)
    log.debug("BaseExperiment.view", @id, variants.variant?.id, variants.viewed?.id)
    @viewVariant(util.extend({ success, error }, variants))
    return

  # or(string, variant) -> { variant: variant, viewed: or(variant, undefined) } -> undefined
  loadVariantsForView: (variantOrId) =>
    variant: if variantOrId instanceof Variant then variantOrId else @variants[variantOrId]
    viewed:  null

  # object -> undefined
  viewVariant: (options) =>
    variant   = options.variant
    viewed    = options.viewed
    success   = options.success ? (->)
    error     = options.error   ? (->)

    log.debug("BaseExperiment.viewVariant", @id, variant?.id, viewed?.id)

    if viewed? # TODO: Do we need this conditional? Why not just save every time?
      # The comparison to false is important here as it distringuishes from undefined:
      unless @trigger('beforeView', viewed, false) == false
        success.call(this, viewed, false)
        @trigger('view', viewed, false)
    else if variant?
      # The comparison to false is important here as it distringuishes from undefined:
      unless @trigger('beforeView', variant, true) == false
        @saveVariantFromView(variant)
        success.call(this, variant, true)
        @trigger('view', variant, true)
        @trigger('recordView', variant)
    else
      error(util.problem("no-variant"))

    return

  # variant -> undefined
  saveVariantFromView: (variant) =>
    @saveLastView(variant)
    @clearLastReward()

  # Reward the last page view. A `reward` event is queued in local storage
  # ready to be submitted to the servers.
  #
  # 0-to-1 (variant boolean -> undefined) (any -> undefined) -> undefined
  reward: (amount = 1.0, success = (->), error = (->)) =>
    variants = @loadVariantsForReward()
    log.debug("BaseExperiment.reward", @id, variants.variant?.id, variants.rewarded?.id, amount)
    @rewardVariant(util.extend({ amount, success, error }, variants))
    return

  # -> { variant: variant, rewarded: or(variant, null) }
  loadVariantsForReward: =>
    variant:  @loadLastView()
    rewarded: @loadLastReward()

  # object -> undefined
  rewardVariant: (options = {}) =>
    log.debug("BaseExperiment.rewardVariant", @id, options)

    variant   = options.variant
    rewarded  = options.rewarded
    amount    = options.amount    ? 1.0
    success   = options.success   ? (->)
    error     = options.error     ? (->)

    if rewarded?
      # The comparison to false is important here as it distringuishes from undefined:
      unless @trigger('beforeReward', rewarded, amount, false) == false
        success.call(this, rewarded, amount, false)
        @trigger('reward', rewarded, amount, false)
    else if variant?
      # The comparison to false is important here as it distringuishes from undefined:
      unless @trigger('beforeReward', variant, amount, true) == false
        @triggerAsync 'recordReward', variant, amount,
          =>
            @saveVariantFromReward(variant)
            success.call(this, variant, amount, true)
            @trigger('reward', variant, amount, true)
          =>
            @saveVariantFromReward(variant)
            error.call(this)
            return
    else
      error(util.problem("no-variant"))

    return

  # variant -> undefined
  saveVariantFromReward: (variant) =>
    @clearLastView()
    @saveLastReward(variant)

  # -> double
  totalWeight: =>
    ans = 0.0
    for id, variant of @variants then ans += variant.weight
    ans

  # -> variant
  randomVariant: =>
    total = @totalWeight()
    random = Math.random() * total
    for id, variant of @variants
      total -= variant.weight
      if total <= random
        log.debug("BaseExperiment.randomVariant", @id, variant.id)
        return variant
    log.debug("BaseExperiment.randomVariant", @id, null)
    return null

  # => U(variant null)
  loadLastView: =>
    @loadVariant('lastView')

  # variant => void
  saveLastView: (variant) =>
    @saveVariant('lastView', variant)
    @clearVariant('lastReward')

  # => void
  clearLastView: =>
    @clearVariant('lastView')

  # => U(variant null)
  loadLastReward: =>
    @loadVariant('lastReward')

  # variant => void
  saveLastReward: (variant) =>
    @saveVariant('lastReward', variant)

  # => void
  clearLastReward: =>
    @clearVariant('lastReward')

  loadVariant: (cacheKey) =>
    id = @load()?[cacheKey]
    log.debug("BaseExperiment.loadVariant", @id, cacheKey, id)
    if id? then @variants[id] else null

  saveVariant: (cacheKey, variant) =>
    @loadAndSave (saved) =>
      log.debug("BaseExperiment.saveVariant", @id, cacheKey, variant, saved)
      if variant?
        saved[cacheKey] = variant.id
      else
        delete saved[cacheKey]
      saved

  clearVariant: (cacheKey) =>
    @saveVariant(cacheKey, null)

  loadAndSave: (func) =>
    @save(func(@load() ? {}))

  load: =>
    cache.load(@uuid)

  save: (state) =>
    cache.save(@uuid, state)

module.exports = BaseExperiment