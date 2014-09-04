Promise = require('es6-promise').Promise
log     = require './log'

# JSONP functions -------------------------------

# objectOf(string, (object -> void))
window.__mynaCallbacks = {}

# string object (any -> void) -> HTMLElement
#
# This private method is factored out of jsonp.request
# so we can hook into it in unit tests. See jsonp-spec.coffee
_createCallback = (url, params, callback) ->
  # Register the callback:
  callbackId = "__mynaCallback#{new Date().getTime()}"
  window.__mynaCallbacks[callbackId] = callback

  # Insert the callback ID into the URL:
  url += if url.indexOf("?") < 0 then "?" else "&"
  for key, value of params then url += "#{key}=#{value}&"
  url += "callback=__mynaCallbacks." + callbackId

  # Create a script element to point to the URL:
  scriptElem = document.createElement("script")
  scriptElem.setAttribute("id", callbackId)
  scriptElem.setAttribute("type","text/javascript")
  scriptElem.setAttribute("async", "true")
  scriptElem.setAttribute("src", url)
  scriptElem.setAttribute("class", "myna-jsonp")
  scriptElem.setAttribute("data-callback", callbackId)

  # onreadystatechange is for IE, onload/onerror for everyone else
  scriptElem.onload = scriptElem.onreadystatechange = ->
    _removeCallback(callbackId)
    callback()
    return

  document.getElementsByTagName("head")[0].appendChild(scriptElem)

  callbackId

# string -> void
_removeCallback = (callbackId) ->
  log.debug('_removeCallback', callbackId, scriptElem, scriptElem?.parentNode)

  scriptElem = document.getElementById(callbackId)
  readyState = scriptElem?.readyState

  unless readyState && readyState != "complete" && readyState != "loaded"
    try
      if scriptElem
        scriptElem.onload = null
        scriptElem.parentNode.removeChild(scriptElem)
    finally
      delete window.__mynaCallbacks[callbackId]

  return

# string -> object
_createTimeoutError = (callbackId) ->
  return {
    typename: 'problem'
    status: 500
    messages: [
      typename: 'timeout'
      message:  'request timed out after #{timeout}ms'
      callback: callbackId
    ]
  }

# string [object] [integer] -> promiseOf(any)
request = (url, params = {}, timeout = 0) ->
  log.debug("jsonp.request", url, timeout)

  return new Promise (resolve, reject) ->
    # Safety - avoid race conditions on timeout:
    resolved = false

    onTimeout = ->
      unless resolved
        resolved = true
        log.debug("jsonp.request.onTimeout", callbackId, timeout)
        _removeCallback(callbackId)
        reject(_createTimeoutError(callbackId))
      return

    # Register callback:
    onComplete = (response) ->
      unless resolved
        resolved = true
        log.debug("jsonp.request.onComplete", callbackId, response.typename, response.typename == "problem", response)
        window.clearTimeout(timer)
        _removeCallback(callbackId)
        if response.typename == "problem"
          reject(response)
        else
          resolve(response)
      return

    # Register timeout function:
    timer      = if timeout then window.setTimeout(onTimeout, timeout) else null

    # Register callback function:
    callbackId = _createCallback(url, params, onComplete)

    return # Promise constructor

module.exports = {
  request
  # For unit tests:
  _createCallback
  _removeCallback
  callbacks: ->
    window.__mynaCallbacks
}