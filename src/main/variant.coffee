class Myna.Variant extends Myna.VariantSummary
  directAttributes: [ "id", "name", "views", "totalReward", "weight" ]

  constructor: (options = {}) ->
    super(options)
    @name        = options.name        ? undefined
    @views       = options.views       ? undefined
    @totalReward = options.totalReward ? undefined

  averageReward: =>
    if @views? && @totalReward?
      if @views == 0 then 1.0 else @totalReward / @views
    else
      undefined

  toJSON: =>
    settingsJSON = Myna.extend({ "": null }, @settings.data)

    typename    : "variant"
    id          : @id
    name        : @name
    views       : @views
    totalReward : @totalReward
    weight      : @weight
    settings    : settingsJSON
