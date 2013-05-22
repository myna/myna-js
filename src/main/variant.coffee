class Myna.Variant
  constructor: (@id, options = {}) ->
    @weight   = options.weight ? throw "no weight provided"
    @settings = new Myna.Settings(options.settings ? {})
