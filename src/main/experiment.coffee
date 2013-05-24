class Myna.Experiment extends Myna.BaseExperiment

  # -> boolean
  sticky: =>
    !!@settings.get("myna.web.sticky", true)

  # -> boolean
  autoRecord: =>
    !!@settings.get("myna.web.autoRecord", true)

  # (variant -> void) (any -> void) -> void
  suggest: (success = (->), error = (->)) =>
    sticky = @sticky()

    if sticky
      suggested = @loadStickySuggestion()
      variant = suggested ? @randomVariant()
    else
      suggested = null
      variant = @randomVariant()

    Myna.log("Myna.Experiment.suggest", @id, variant.id)

    if @trigger('beforeSuggest', variant, !!suggested) == false then return false

    if suggested?
      success.call(this, suggested, !!suggested)
    else if variant?
      if sticky then @saveStickySuggestion(variant)
      if @viewVariant({ variant, success, error, otherArgs: [ !!suggested ] }) == false then return false
    else
      error.call(this, Myna.problem("no-variants"))
      return false

    @trigger('afterSuggest', variant, !!suggested)

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

    if @trigger('beforeReward', variant, amount, !!rewarded) == false then return false

    wrappedSuccess = =>
      success.call(this, variant, amount, !!rewarded)
      @trigger('afterReward', variant, amount, !!rewarded)

    if rewarded?
      wrappedSuccess()
    else if variant?
      if sticky then @saveStickyReward(variant, amount, !!rewarded)

      delayedSuccess = =>
        if @autoRecord()
          # Call our success/error callbacks once the record is complete:
          @record(wrappedSuccess, error)
        else
          wrappedSuccess()

      if @rewardVariant({ variant, amount, success: delayedSuccess, error, otherArgs: [ !!rewarded ] }) == false then return false
    else
      error.call(this, Myna.problem("no-suggestion"))
      return false

    return

  unstick: =>
    Myna.log("Myna.Experiment.unstick", @id)
    @clearLastSuggestion()
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
