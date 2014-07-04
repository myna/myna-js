log      = require './log'
Settings = require './settings'

class Variant
  constructor: (options = {}) ->
    @id       = options.id     ? log.error("Variant.constructor", "no id in options", options)
    @name     = options.name   ? @id
    @weight   = options.weight ? log.error("Variant.constructor", "no weight in options", options)
    @settings = new Settings(options.settings ? {})

module.exports = Variant