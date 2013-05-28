class Myna.Variant
  constructor: (options = {}) ->
    @id       = options.id     ? Myna.error("Myna.Variant.constructor", "no id in options", options)
    @weight   = options.weight ? Myna.error("Myna.Variant.constructor", "no weight in options", options)
    @settings = new Myna.Settings(options.settings ? {})
