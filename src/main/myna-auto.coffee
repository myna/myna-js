hash         = require './common/hash'
MynaUiClient = require './client/myna-ui'
boot         = require './bootstrap'

###
Auto-executing Myna client library
==================================

This is the client library used in pre-built deployments created on the Myna dashboard.
It is not intended for direct use by Javascript developers.

The code in this file behaves the same as in `myna.coffee`, except that it automatically
boostraps experiments created using the visual experiment editor.

After the call to `initLocal` or `initRemote`, the client is also exposed as `window.Myna.client`.

Adding '#mynaui' to the end of the URL loads Myna UI *instead of* running experiments as usual.
###

_initLocal = boot.createLocalInit (experiment, settings) ->
  new MynaUiClient(experiment, settings)

initLocal = (deployment) ->
  if _mynaUiRequested()
    _loadMynaUi(deployment)
  else
    _initLocal(deployment).then (client) ->
      window.Myna?.client = client
      return client

initRemote = boot.createRemoteInit(initLocal)

# If the user puts ?mynaui on the end of the URL
_mynaUiRequested = ->
  !!hash.params.mynaui

_loadMynaUi = (deployment) ->
  scriptElem = document.createElement('script')
  scriptElem.setAttribute('src', 'myna-ui.js')
  scriptElem.onload = scriptElem.onreadystatechange = ->
    if !scriptElem.readyState || scriptElem.readyState == 'complete'
      window.MynaUi.init(deployment)

  document.getElementsByTagName('head')[0].appendChild(scriptElem)

  return

module.exports = {
  initLocal
  initRemote
}
