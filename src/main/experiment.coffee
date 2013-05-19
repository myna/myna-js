class Myna.BaseExperiment
  constructor: (options = {}) ->
    Myna.log("Myna.BaseExperiment.constructor", options)

    @uuid = options.uuid ? Myna.error("Myna.Experiment.constructor", @id, "no UUID in options", options)
    @id   = options.id   ? Myna.error("Myna.Experiment.constructor", @id, "no ID in options", options)
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
      @clearLastReward()
      @enqueueView(variant)
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
      rewarded = @loadLastReward()
      Myna.log(" - rewarded", rewarded)
      if rewarded?
        error()
      else
        @clearLastSuggestion()
        @saveLastReward(variant)
        @enqueueReward(variant, amount)
        success(variant)
    catch exn
      error(exn)

  # -> double
  totalWeight: =>
    ans = 0.0
    for id, variant of @variants then ans += variant.weight
    ans

  randomVariant: =>
    Myna.log("Myna.BaseExperiment.randomVariant", @id)
    total = @totalWeight()
    random = Math.random() * total
    for id, variant of @variants
      total -= variant.weight
      if total <= random
        Myna.log("Myna.BaseExperiment.randomVariant", @id, variant.id)
        return variant
    Myna.log("Myna.BaseExperiment.randomVariant", @id, null)
    return null

  # => U(variant null)
  loadLastSuggestion: =>
    @loadVariant('lastSuggestion')

  # variant => void
  saveLastSuggestion: (variant) =>
    @saveVariant('lastSuggestion', variant)
    @clearVariant('lastReward')

  # => void
  clearLastSuggestion: =>
    @clearVariant('lastSuggestion')
    # @clearVariant('lastReward')

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
    Myna.log("Myna.BaseExperiment.loadVariant", @id, cacheKey, id)
    if id? then @variants[id] else null

  saveVariant: (cacheKey, variant) =>
    @loadAndSave (saved) ->
      Myna.log("Myna.BaseExperiment.saveVariant", @id, cacheKey, variant, saved)
      if variant?
        saved[cacheKey] = variant.id
      else
        delete saved[cacheKey]
      saved

  clearVariant: (cacheKey) =>
    @saveVariant(cacheKey, null)

  loadQueuedEvents: =>
    ans = @load().queuedEvents ? []
    Myna.log("Myna.BaseExperiment.loadQueuedEvents", @id, ans)
    ans

  clearQueuedEvents: =>
    Myna.log("Myna.BaseExperiment.clearQueuedEvents", @id)
    @loadAndSave (saved) ->
      delete saved.queuedEvents
      saved

  enqueueEvent: (evt) =>
    Myna.log("Myna.BaseExperiment.enqueueEvent", @id, JSON.stringify(evt))
    @loadAndSave (saved) ->
      if saved.queuedEvents?
        saved.queuedEvents.push(evt)
      else
        saved.queuedEvents = [ evt ]
      saved

  enqueueView: (variant) =>
    Myna.log("Myna.BaseExperiment.enqueueView", @id, variant)
    @enqueueEvent
      typename:  "view"
      variant:   variant.id
      timestamp: new Date().getTime()

  enqueueReward: (variant, amount) =>
    Myna.log("Myna.BaseExperiment.enqueueReward", @id, variant, amount)
    @enqueueEvent
      typename:  "reward"
      variant:   variant.id
      amount:    amount
      timestamp: new Date().getTime()

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
        suggested = @loadStickySuggestion()
        variant = suggested ? @randomVariant()
        if !suggested?
          @saveStickySuggestion(variant)
      else
        suggested = null
        variant = @randomVariant()

      if suggested?
        success(suggested)
      else if variant?
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
        rewarded = @loadStickyReward()
        variant = rewarded ? @loadLastSuggestion()
        if !rewarded?
          @saveStickyReward(variant)
      else
        rewarded = null
        variant = @loadLastSuggestion()

      if rewarded?
        success()
      else if variant?
        @rewardVariant(variant, amount, success, error)
      else
        error()
    catch exn
      error(exn)

  # -> boolean
  sticky: =>
    ans = !!@settings.get("myna.sticky", true)
    Myna.log("Myna.Experiment.sticky", @id, ans)
    ans

  unstick: =>
    Myna.log("Myna.Experiment.unstick", @id)
    @clearLastSuggestion()
    @clearLastReward()
    @clearStickySuggestion()

  # => U(variant null)
  loadStickySuggestion: =>
    @loadVariant('stickySuggestion')

  # variant => void
  saveStickySuggestion: (variant) =>
    @saveVariant('stickySuggestion', variant)
    @clearVariant('stickyReward')

  # => void
  clearStickySuggestion: =>
    @clearVariant('stickySuggestion')
    @clearVariant('stickyReward')

  # => U(variant null)
  loadStickyReward: =>
    @loadVariant('stickyReward')

  # variant => void
  saveStickyReward: (variant) =>
    @saveVariant('stickyReward', variant)

  # => void
  clearStickyReward: =>
    @clearVariant('stickyReward')
