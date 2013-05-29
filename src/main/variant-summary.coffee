class Myna.VariantSummary extends Myna.Events
  directAttributes: [ "id", "weight" ]

  constructor: (options = {}) ->
    @id          = options.id          ? @error("constructor", "no id in options", options)
    @weight      = options.weight      ? @error("constructor", "no weight in options", options)
    @settings    = new Myna.Settings(options.settings ? {})

  getCustom: (name) =>
    if ( [ _, path ] = name.match /^settings[.](.*)$/ )
      @settings.get(path)
    else
      super(name)

  # string any -> this
  setCustom: (name, value) =>
    match = name.match /^settings[.](.*)$/
    if match
      path = match[1]
      @settings.set(path, value)
      for prefix in @settings.constructor.parse(path).prefixes() by -1
        @trigger("change:settings.#{prefix}", this, @settings.get(prefix))
      @trigger("change:settings", this, @settings.data)
    else
      super(name, value)
