class Myna.Variant
  constructor: (options = {}) ->
    @id       = options.id     ? throw "no id specified"
    @weight   = options.weight ? throw "no weight specified"
    @settings = new Myna.Settings(options.settings ? {})
