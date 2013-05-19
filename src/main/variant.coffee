class Myna.Variant
  constructor: (@id, options = {}) ->
    @settings = new Myna.Settings(options.settings ? {})
    @weight   = options.weight ? throw "no weight provided"
    @views    = 0
    @reward   = 0
