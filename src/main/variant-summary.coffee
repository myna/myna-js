class Myna.VariantSummary extends Myna.Logging
  constructor: (options = {}) ->
    @id          = options.id          ? @error("constructor", "no id in options", options)
    @weight      = options.weight      ? @error("constructor", "no weight in options", options)
    @settings    = new Myna.Settings(options.settings ? {})
