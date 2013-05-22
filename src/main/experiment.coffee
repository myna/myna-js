class Myna.Experiment extends Myna.BaseExperiment

  # (variant -> void) (any -> void) -> void
  suggest: (success = (->), error = (->)) =>
    Myna.log("Myna.Experiment.suggest", @id)

    sticky = @sticky()

    if sticky
      suggested = @loadStickySuggestion()
      variant = suggested ? @randomVariant()
    else
      suggested = null
      variant = @randomVariant()

    if @callback('beforeSuggest').call(this, variant, !!suggested) == false then return false

    if suggested?
      success.call(this, suggested, !!suggested)
    else if variant?
      if sticky then @saveStickySuggestion(variant)
      if @viewVariant({ variant, success, error, otherArgs: [ !!suggested ] }) == false then return false
    else
      error.call(this, Myna.problem("no-variants"))
      return false

    @callback('afterSuggest').call(this, variant, !!suggested)

    if @autoRecord() then @record()

    return

  # number-between-0-and-1 (variant amount boolean -> void) (any -> void) -> void
  reward: (amount = 1.0, success = (->), error = (->)) =>
    Myna.log("Myna.Experiment.reward", @id, amount)

    sticky = @sticky()

    if sticky
      rewarded = @loadStickyReward()
      variant = rewarded ? @loadLastSuggestion()
    else
      rewarded = null
      variant = @loadLastSuggestion()

    if @callback('beforeReward').call(this, variant, amount, !!rewarded) == false then return false

    if rewarded?
      success.call(this, variant, amount, !!rewarded)
    else if variant?
      if sticky then @saveStickyReward(variant, amount, !!rewarded)
      if @rewardVariant({ variant, amount, success, error, otherArgs: [ !!rewarded ] }) == false then return false
    else
      error.call(this, Myna.problem("no-suggestion"))
      return false

    @callback('afterReward').call(this, variant, amount, !!rewarded)

    return

  # -> boolean
  sticky: =>
    ans = !!@settings.get("myna.web.sticky", true)
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
