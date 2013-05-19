class Myna.BaseExperiment
  constructor: (options = {}) ->
    Myna.log("Myna.BaseExperiment.constructor", options)

    @uuid = options.uuid ? Myna.error("Myna.Experiment.constructor", "no UUID in options", options)
    @id   = options.id   ? Myna.error("Myna.Experiment.constructor", "no ID in options", options)
    @settings = new Myna.Settings(options.settings ? {})

    @variants = {}
    for id, data of (options.variants ? {})
      variant = new Myna.Variant(id, data)
      @variants[id] = variant

  # (variant -> void) (any -> void) -> void
  suggest: (success = (->), error = (->)) =>
    try
      Myna.log("Myna.BaseExperiment.suggest", @id)
      variant = @randomVariant()
      @view(variant.id, success, error)
    catch exn
      @error(exn)

  view: (variantId, success = (->), error = (->)) =>
    try
      Myna.log("Myna.BaseExperiment.view", @id, variantId)
      variant = @variants[variantId]
      @saveLastSuggestion(variant)
      @recordView(variant)
      success(variant)
    catch exn
      error(exn)

  # number-between-0-and-1 (variant -> void) (any -> void) -> void
  reward: (amount = 1.0, success = (->), error = (->)) =>
    try
      Myna.log("Myna.BaseExperiment.reward", @id, amount)
      variant = @loadLastSuggestion()
      if variant?
        @rewardVariant(variant, amount, success, error)
      else
        error()
    catch exn
      error(exn)

  # variant number-between-0-and-1 (variant -> void) (any -> void) -> void
  rewardVariant: (variant, amount = 1.0, success = (->), error = (->)) =>
    try
      Myna.log("Myna.BaseExperiment.rewardVariant", @id, variant.id, amount)
      @clearLastSuggestion()
      @recordReward(variant, amount)
      success(variant)
    catch exn
      error(exn)

  # -> double
  totalWeight: =>
    ans = 0.0
    for id, variant of @variants then ans += variant.weight
    ans

  randomVariant: =>
    Myna.log("Myna.BaseExperiment.randomVariant")
    total = @totalWeight()
    random = Math.random() * total
    for id, variant of @variants
      total -= variant.weight
      if total <= random
        Myna.log("Myna.BaseExperiment.randomVariant", variant.id)
        return variant
    Myna.log("Myna.BaseExperiment.randomVariant", null)
    return null

  recordView: (variant) =>
    Myna.log("Myna.BaseExperiment.recordView", @id, variant)

  recordReward: (variant, amount) =>
    Myna.log("Myna.BaseExperiment.recordReward", @id, variant, amount)

  # => U(variant null)
  loadLastSuggestion: =>
    @loadVariant('lastSuggestion')

  # variant => void
  saveLastSuggestion: (variant) =>
    @saveVariant('lastSuggestion', variant)

  # => void
  clearLastSuggestion: =>
    @clearVariant('lastSuggestion')

  loadVariant: (cacheKey) =>
    id = @load()?[cacheKey]
    Myna.log("Myna.BaseExperiment.loadVariant", cacheKey, id)
    if id? then @variants[id] else null

  saveVariant: (cacheKey, variant) =>
    @loadAndSave (saved) ->
      Myna.log("Myna.BaseExperiment.saveVariant", cacheKey, variant, saved)
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
    Myna.cache.load(@uuid)

  save: (state) =>
    Myna.cache.save(@uuid, state)

class Myna.Experiment extends Myna.BaseExperiment

  # (variant -> void) (any -> void) -> void
  suggest: (success = (->), error = (->)) =>
    try
      Myna.log("Myna.Experiment.suggest", @id)
      if @sticky()
        variant = @loadStickySuggestion() ? @randomVariant()
        @saveStickySuggestion(variant)
      else
        variant = @randomVariant()

      if variant?
        @view(variant.id, success, error)
      else
        error()
    catch exn
      error(exn)

  # number-between-0-and-1 (variant -> void) (any -> void) -> void
  reward: (amount = 1.0, success = (->), error = (->)) =>
    try
      Myna.log("Myna.Experiment.reward", @id, amount)
      if @sticky()
        variant = @loadStickyReward() ? @loadLastSuggestion()
        @saveStickyReward(variant)
      else
        variant = @loadLastSuggestion()

      if variant?
        @rewardVariant(variant, amount, success, error)
      else
        error()
    catch exn
      error(exn)

  # -> boolean
  sticky: =>
    !!@settings.get("myna.sticky", true)

  unstick: =>
    @clearStickySuggestion()
    @clearStickyReward()

  # => U(variant null)
  loadStickySuggestion: =>
    @loadVariant('stickySuggestion')

  # variant => void
  saveStickySuggestion: (variant) =>
    @saveVariant('stickySuggestion', variant)

  # => void
  clearStickySuggestion: =>
    @clearVariant('stickySuggestion')

  # => U(variant null)
  loadStickyReward: =>
    @loadVariant('stickyReward')

  # variant => void
  saveStickyReward: (variant) =>
    @saveVariant('stickyReward', variant)

  # => void
  clearStickyReward: =>
    @clearVariant('stickyReward')
