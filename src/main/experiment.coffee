class Myna.Experiment extends Myna.ExperimentSummary
  directAttributes: [ "uuid", "id", "accountId", "name", "visibility", "created" ]

  constructor: (options = {}) ->
    super(options)
    @accountId  = options.accountId  ? undefined
    @name       = options.name       ? undefined
    @visibility = options.visibility ? "draft"
    @created    = if options.created? then Myna.stringToDate(options.created) else new Date()

  createVariant: (data) ->
    new Myna.Variant(data)

  toJSON: =>
    settingsJSON = Myna.extend({ "": null }, @settings.data)

    variantJSON = {}
    for id, variant of @variants then variantJSON[id] = variant.toJSON()

    typename   : "experiment"
    uuid       : @uuid
    id         : @id
    accountId  : @accountId
    name       : @name
    visibility : @visibility
    created    : if @created then Myna.dateToString(@created) else null
    settings   : settingsJSON
    variants   : variantJSON
