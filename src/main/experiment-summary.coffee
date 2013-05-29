class Myna.ExperimentSummary extends Myna.ExperimentBase
  # -> boolean
  sticky: =>
    !!@settings.get("myna.js.sticky", true)

  # -> boolean
  loadVariantsForSuggest: =>
    if @sticky()
      sticky = @loadStickySuggestion()
      { variant: sticky ? @randomVariant(), viewed: sticky }
    else
      super()

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
    @log("unstick", @id)
    @clearLastView()
    @clearLastReward()
    @clearStickySuggestion()
    @clearStickyReward()

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
