class Myna.Experiment extends Myna.BaseExperiment

  # -> boolean
  sticky: =>
    !!@settings.get("myna.web.sticky", true)

  # -> boolean
  loadVariantsForSuggest: =>
    sticky = @loadStickySuggestion()
    { variant: sticky ? @randomVariant(), viewed: sticky ? null }

  loadVariantsForView: (variant) =>
    super(variant)

  saveVariantFromView: (variant) =>
    if @sticky()
      @saveStickySuggestion(variant)
    super(variant)

  loadVariantsForReward: =>
    if @sticky()
      { variant: @loadLastView(), rewarded: @loadStickyReward() }
    else
      super()

  saveVariantFromReward: (variant) =>
    if @sticky()
      @saveStickyReward(variant)
    super(variant)

  unstick: =>
    Myna.log("Myna.Experiment.unstick", @id)
    @clearLastView()
    @clearLastReward()
    @clearStickySuggestion()
    @clearStickyReward()

  # => U(variant null)
  loadStickySuggestion: =>
    if @sticky() then @loadVariant('stickySuggestion') else null

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
    if @sticky() then @loadVariant('stickyReward') else null

  # variant => void
  saveStickyReward: (variant) =>
    @saveVariant('stickyReward', variant)

  # => void
  clearStickyReward: =>
    @clearVariant('stickyReward')
