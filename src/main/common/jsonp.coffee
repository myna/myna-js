Promise = require('es6-promise').Promise
log     = require './log'

module.exports = jsonp = {}

# JSONP functions -------------------------------

# objectOf(string, (object -> void))
window.__mynaCallbacks = {}

# string [object] [integer] -> promiseOf(any)
jsonp.request = (url, params = {}, timeout = 0) ->
  log.debug("jsonp.request", url, params, timeout)

  return new Promise (resolve, reject) ->
    # Safety - avoid race conditions on timeout:
    resolved = false

    onTimeout = ->
      log.debug("jsonp.request.onTimeout", callbackId, timeout, resolved)
      unless resolved
        resolved = true
        jsonp._removeCallback(callbackId)
        reject(jsonp._createTimeoutError(callbackId))
      return

    # Register callback:
    onComplete = (response) ->
      log.debug("jsonp.request.onComplete", callbackId, response, resolved)
      unless resolved
        resolved = true
        window.clearTimeout(timer)
        if response.typename == "problem"
          reject(response)
        else
          resolve(response)
      return

    # Register timeout and completion handlers:
    timer      = if timeout then window.setTimeout(onTimeout, timeout) else null
    callbackId = jsonp._createCallback(url, params, onComplete)

    return # Promise constructor

# string object (any -> void) -> HTMLElement
#
# This private method is factored out of jsonp.request
# so we can hook into it in unit tests. See jsonp-spec.coffee
jsonp._createCallback = (url, params, callback) ->
  log.debug("jsonp._createCallback", url, params, callback)

  # Register the callback:
  callbackId = "__mynaCallback#{new Date().getTime()}"
  window.__mynaCallbacks[callbackId] = callback

  # Insert the callback ID into the URL:
  url += if url.indexOf("?") < 0 then "?" else "&"
  for key, value of params then url += "#{key}=#{value}&"
  url += "callback=__mynaCallbacks." + callbackId

  # Create a script element to point to the URL:
  scriptElem = jsonp._createScriptElem(url, callbackId)
  document.getElementsByTagName("head")[0].appendChild(scriptElem)

  callbackId

# string -> void
jsonp._removeCallback = (callbackId) ->
  log.debug('jsonp._removeCallback', callbackId)

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

# string string -> element
jsonp._createScriptElem = (url, callbackId) ->
  log.debug("jsonp._createScriptElem", url, callbackId)

  scriptElem = document.createElement("script")

  scriptElem.setAttribute("id", callbackId)
  scriptElem.setAttribute("type","text/javascript")
  scriptElem.setAttribute("async", "true")
  scriptElem.setAttribute("src", url)
  scriptElem.setAttribute("class", "myna-jsonp")
  scriptElem.setAttribute("data-callback", callbackId)

  # onreadystatechange is for IE, onload/onerror for everyone else
  scriptElem.onload = scriptElem.onreadystatechange = ->
    jsonp._removeCallback(callbackId)
    return

  scriptElem

# string -> object
jsonp._createTimeoutError = (callbackId) ->
  return {
    typename: 'problem'
    status: 500
    messages: [
      typename: 'timeout'
      message:  'request timed out after #{timeout}ms'
      callback: callbackId
    ]
  }
