# JSONP functions -----------------------------------------_

Myna.jsonp =
  callbacks: {}
  counter: 0

  # (
  #   success : (any ... -> undefined)
  #   error   : (json    -> undefined)
  #   timeout : or(number,  undefined)
  #   url     : string
  #   params  : object
  # ->
  #   undefined
  # )
  request: (options = {}) ->
    urlRoot      = options.url     ? throw "no URL specified"
    success      = options.success ? (->)
    error        = options.error   ? (->)
    timeout      = options.timeout ? 0 # 0 means don't time out
    callbackName = "callback" + (Myna.jsonp.counter++)
    returned     = false

    # Calculate full URL:

    url = "#{urlRoot}?"
    for key, value of options.params then url += "#{key}=#{value}&"
    url += "callback=Myna.jsonp.callbacks." + callbackName

    Myna.log("Myna.jsonp.request", url, success, error, timeout)

    # Prepare script element:

    scriptElem = document.createElement("script")
    scriptElem.setAttribute("type","text/javascript")
    scriptElem.setAttribute("async", "true")
    scriptElem.setAttribute("src", url)
    scriptElem.setAttribute("class", "myna-jsonp")
    scriptElem.setAttribute("data-callback", callbackName)
    # onreadystatechange is for IE, onload/onerror for everyone else
    scriptElem.onload = scriptElem.onreadystatechange = ->
      Myna.jsonp.remove(callbackName, scriptElem)

    # Register timeout function

    if timeout? && timeout > 0
      timer = window.setTimeout(
        ->
          unless returned
            returned = true
            Myna.jsonp.remove(callbackName, scriptElem)
            error
              typename: 'problem'
              subtype: 500
              messages: [
                typename: 'timeout'
                message:  'request timed out after #{timeout}ms'
                callback: callbackName
                timeout:  timeout
              ]
        timeout
      )
    else
      timer = null

    # Register callback:

    Myna.jsonp.callbacks[callbackName] = (response) ->
      unless returned
        returned = true
        window.clearTimeout(timer)
        Myna.jsonp.remove(callbackName, scriptElem)
        if response.typename == "problem"
          error(response)
        else
          success(response)

    # Append script tag to body:

    document.getElementsByTagName("head")[0].appendChild(scriptElem)
    return

  # string element -> void
  remove: (callbackName = null, scriptElem = null) ->
    readyState = scriptElem?.readyState
    unless readyState && readyState != "complete" && readyState != "loaded"
      try
        if scriptElem
          scriptElem.onload = null
          scriptElem.parentNode.removeChild(scriptElem)
      finally
        if callbackName then delete Myna.jsonp.callbacks[callbackName]
    return

