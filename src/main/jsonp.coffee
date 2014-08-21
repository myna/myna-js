log = require './log'

# JSONP functions -----------------------------------------_

# Globally accessible hash of JSONP callback functions:
window.__mynacallbacks = {}

# string element -> void
removeCallback = (callbackName = null, scriptElem = null) ->
  log.debug('removeCallback', callbackName, scriptElem, scriptElem?.parentNode)

  readyState = scriptElem?.readyState
  unless readyState && readyState != "complete" && readyState != "loaded"
    try
      if scriptElem
        scriptElem.onload = null
        scriptElem.parentNode.removeChild(scriptElem)
    finally
      if callbackName then delete window.__mynacallbacks[callbackName]
  return

# string string -> HTMLElement
#
# This private method is factored out of jsonp.request
# so we can hook into it in unit tests. See jsonp-spec.coffee
createScriptElem = (url, callbackName) ->
  scriptElem = document.createElement("script")
  scriptElem.setAttribute("type","text/javascript")
  scriptElem.setAttribute("async", "true")
  scriptElem.setAttribute("src", url)
  scriptElem.setAttribute("class", "myna-jsonp")
  scriptElem.setAttribute("data-callback", callbackName)

  # onreadystatechange is for IE, onload/onerror for everyone else
  scriptElem.onload = scriptElem.onreadystatechange = ->
    removeCallback(callbackName, scriptElem)

  scriptElem

# (
#   success : (any ... -> undefined)
#   error   : (json    -> undefined)
#   timeout : or(number,  undefined)
#   url     : string
#   params  : object
# ->
#   undefined
# )
request = (options = {}) ->
  urlRoot      = options.url     ? log.error("jsonp.request", "no url in options", options)
  success      = options.success ? (->)
  error        = options.error   ? (->)
  timeout      = options.timeout ? 0 # 0 means no timeout
  params       = options.params  ? {}
  callbackName = "callback#{new Date().getTime()}"
  returned     = false

  # Calculate full URL:

  url = "#{urlRoot}?"
  for key, value of params then url += "#{key}=#{value}&"
  url += "callback=__mynacallbacks." + callbackName

  log.debug("jsonp.request", url, success, error, timeout)

  # Prepare script element:

  scriptElem = createScriptElem(url, callbackName)

  # Register timeout function

  onTimeout = ->
    if returned
      log.debug("jsonp.request.onTimeout", callbackName, timeout, "already returned")
    else
      returned = true
      log.debug("jsonp.request.onTimeout", callbackName, timeout)
      removeCallback(callbackName, scriptElem)
      error
        typename: 'problem'
        status: 500
        messages: [
          typename: 'timeout'
          message:  'request timed out after #{timeout}ms'
          callback: callbackName
        ]

  if timeout > 0
    timer = window.setTimeout(onTimeout, timeout)
  else
    timer = null

  # Register callback:

  onComplete = (response) ->
    if returned
      log.debug("jsonp.request.onComplete", callbackName, "already returned")
    else
      returned = true
      log.debug("jsonp.request.onComplete", callbackName, response.typename, response.typename == "problem", response)
      window.clearTimeout(timer)
      removeCallback(callbackName, scriptElem)
      if response.typename == "problem"
        error(response)
      else
        success(response)

  window.__mynacallbacks[callbackName] = onComplete

  # Append script tag to body, initiating request:

  document.getElementsByTagName("head")[0].appendChild(scriptElem)

  return

module.exports = {
  request
  callbacks: window.__mynacallbacks
  createScriptElem # for debugging
  removeCallback
}