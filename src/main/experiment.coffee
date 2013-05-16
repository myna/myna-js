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
        if (variant = @loadStickySuggestion())?
          success(variant)
        else
          variant = @randomVariant()
          @saveStickySuggestion(variant)
          @recordView(variant)
          success(variant)
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

  recordView: (variant) =>
    Myna.log("Myna.Experiment.recordView", @uuid, variant)

  recordReward: (variant, amount) =>
    Myna.log("Myna.Experiment.recordReward", @uuid, variant, amount)

  # => U(variant undefined)
  loadLastSuggestion: =>
    @variants[Myna.cache.load(@uuid)?.lastSuggestion]

  # => void
  clearLastSuggestion: =>
    @loadAndSave (saved) ->
      delete saved['lastSuggestion']
      saved

  # => U(variant undefined)
  loadStickySuggestion: =>
    name = Myna.cache.load(@uuid)?.stickySuggestion
    variant = if name? then @variants[name] else null
    variant

  # variant => void
  saveStickySuggestion: (variant) =>
    @loadAndSave (saved) ->
      Myna.log("BAZ2", saved)
      saved.stickySuggestion = variant.name
      saved

  clearStickySuggestion: =>
    @loadAndSave (saved) ->
      saved.stickySuggestion = null
      saved

  # => U(variant undefined)
  loadStickyReward: =>
    @variants[Myna.cache.load(@uuid)?.stickyReward]

  # variant => void
  saveStickyReward: (variant) =>
    @loadAndSave (saved) ->
      saved.stickyReward = variant.name
      saved

  clearStickyReward: =>
    @loadAndSave (saved) ->
      saved.stickyReward = null
      saved

  load: =>
    Myna.cache.load(@uuid)

  save: (state) =>
    Myna.cache.save(@uuid, state)

  loadAndSave: (func) =>
    Myna.cache.save(@uuid, func(Myna.cache.load(@uuid) ? {}))
