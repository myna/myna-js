MynaUiClient   = require './client/myna-ui'
bootstrap      = require './bootstrap'

###
Auto-run Myna client library
----------------------------

This is the client code used in pre-built deployments created on the Myna dashboard.
This file is not intended for direct use by developers.

The code in this file behaves the same as in `myna.coffee`, except that it automatically
boostraps experiments created using the visual experiment editor.
###

module.exports = bootstrap.create (experiment, settings) ->
  new MynaUiClient(experiment, settings)
