DefaultClient  = require './client/default'
bootstrap      = require './bootstrap'

module.exports = bootstrap.create (experiment, settings) ->
  new DefaultClient(experiment, settings)
