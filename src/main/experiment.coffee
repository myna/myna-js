class Myna.Experiment extends Myna.BaseExperiment

  # (variant -> void) (any -> void) -> void
  suggest: (success = (->), error = (->)) =>
    try
      Myna.log("Myna.Experiment.suggest", @id)
      sticky = @sticky()

      if sticky
        suggested = @loadStickySuggestion()
        variant = suggested ? @randomVariant()
      else
        suggested = null
        variant = @randomVariant()

      Myna.log(" - suggest", suggested, variant)

      if @callback('beforeSuggest').call(this, variant, !!suggested) == false
        return

      Myna.log(" - suggest", "continuing")

      if suggested?
        ans = success(suggested)
      else if variant?
        if sticky then @saveStickySuggestion(variant)
        ans = @view(variant.id, success, error)
      else
        error()
        return

      Myna.log(" - suggest", "continued")

      @callback('afterSuggest').call(this, variant, !!suggested)
      ans
    catch exn
      error(exn)

  # number-between-0-and-1 (variant -> void) (any -> void) -> void
  reward: (amount = 1.0, success = (->), error = (->)) =>
    try
      Myna.log("Myna.Experiment.reward", @id, amount)
      sticky = @sticky()

      if sticky
        rewarded = @loadStickyReward()
        variant = rewarded ? @loadLastSuggestion()
      else
        rewarded = null
        variant = @loadLastSuggestion()

      Myna.log(" - reward", rewarded, variant, @callback('beforeReward'))

      if @callback('beforeReward').call(this, variant, !!rewarded) == false
        return

      Myna.log(" - reward", "continuing")

      if rewarded?
        ans = success()
      else if variant?
        if sticky then @saveStickyReward(variant)
        ans = @rewardVariant(variant, amount, success, error)
      else
        error()
        return

      Myna.log(" - reward", "continued")

      @callback('afterReward').call(this, variant, !!rewarded)
      ans
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
