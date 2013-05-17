class Myna.Experiment
  constructor: (options = {}) ->
    @uuid = options.uuid ? Myna.error("Myna.Experiment.constructor", "no UUID in options", options)
    @name = options.name ? "Unnamed experiment"
    @settings = new Myna.Settings(options.settings ? {})

    @variants = {}
    for name, data of (options.variants ? {})
      variant = new Myna.Variant(name, data)
      @variants[name] = variant

  # -> boolean
  sticky: =>
    !!@settings.get("myna.sticky", true)

  # -> double
  totalWeight: =>
    ans = 0.0
    for name, variant of @variants then ans += variant.weight
    ans

  # (variant -> void) (any -> void) -> void
  suggest: (success = (->), error = (->)) =>
    Myna.log("Myna.Experiment.suggest", @uuid)
    try
      if @sticky()
        variant = @loadStickySuggestion() ? @randomVariant()
        @saveStickySuggestion(variant)
      else
        variant = @randomVariant()
      @saveLastSuggestion(variant)
      @recordView(variant)
      success(variant)
    catch exn
      error(exn)

  # number-between-0-and-1 (variant -> void) (any -> void) -> void
  reward: (amount = 1.0, success = (->), error = (->)) =>
    Myna.log("Myna.Experiment.reward", @uuid, amount)
    try
      if @sticky()
        if (variant = @loadStickyReward())?
          success()
        else if (variant = @loadLastSuggestion())?
          @saveStickyReward(variant)
          @clearLastSuggestion()
          @recordReward(variant, amount)
          success()
        else
          error()
      else
        if (variant = @loadLastSuggestion())?
          @clearLastSuggestion()
          @recordReward(variant, amount)
          success()
        else
          error()
    catch exn
      error(exn)

  randomVariant: =>
    total = @totalWeight()
    random = Math.random() * total
    for name, variant of @variants
      total -= variant.weight
      if total <= random
        return variant
    return null

  unstick: =>
    @clearStickySuggestion()
    @clearStickyReward()

  recordView: (variant) =>
    Myna.log("Myna.Experiment.recordView", @uuid, variant)

  recordReward: (variant, amount) =>
    Myna.log("Myna.Experiment.recordReward", @uuid, variant, amount)

  # => U(variant null)
  loadLastSuggestion: =>
    @loadVariant('lastSuggestion')

  # variant => void
  saveLastSuggestion: (variant) =>
    @saveVariant('lastSuggestion', variant)

  # => void
  clearLastSuggestion: =>
    @clearVariant('lastSuggestion')

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

  loadVariant: (id) =>
    Myna.log("Myna.Experiment.loadVariant", id)
    name = @load()?[id]
    if name? then @variants[name] else null

  saveVariant: (id, variant) =>
    @loadAndSave (saved) ->
      Myna.log("Myna.Experiment.saveVariant", id, variant, saved)
      saved[id] = variant.name
      saved

  clearVariant: (id) =>
    @loadAndSave (saved) ->
      Myna.log("Myna.Experiment.clearVariant", id, saved)
      delete saved[id]
      saved

  loadAndSave: (func) =>
    @save(func(@load() ? {}))

  load: =>
    Myna.cache.load(@uuid)

  save: (state) =>
    Myna.cache.save(@uuid, state)
