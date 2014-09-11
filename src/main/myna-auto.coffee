hash           = require './common/hash'
MynaUiClient   = require './client/myna-ui'
bootstrap      = require './bootstrap'

###
Auto-executing Myna client library
==================================

This is the client library used in pre-built deployments created on the Myna dashboard.
It is not intended for direct use by Javascript developers.

The code in this file behaves the same as in `myna.coffee`, except that it automatically
boostraps experiments created using the visual experiment editor.

Adding '#mynaui' to the end of the URL loads Myna UI *instead of* running experiments as usual.
###

initLocal = (deployment) ->
  if _mynaUiRequested()
    _loadMynaUi()
  else
    _initLocal(deployment)

initRemote = (url, timeout = 0) ->
  if _mynaUiRequested()
    _loadMynaUi()
  else
    _initRemote(url, timeout)

# Internal implementation of initLocal and initRemote:
{ _initLocal, _initRemote } = bootstrap.create (experiment, settings) ->
  new MynaUiClient(experiment, settings)

# If the user puts ?mynaui on the end of the URL
_mynaUiRequested = ->
  !!hash.params.mynaui

_loadMynaUi = ->
  scriptElem = document.createElement(script)
  scriptElem.setAttribute('src', 'myna-ui.js')
  document.appendChild(scriptElem)

module.exports = {
  initLocal
  initRemote
}
