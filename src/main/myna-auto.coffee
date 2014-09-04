MynaUiClient   = require './client/myna-ui'
bootstrap      = require './bootstrap'

module.exports = bootstrap.create (experiment, settings) ->
  new MynaUiClient(experiment, settings)
