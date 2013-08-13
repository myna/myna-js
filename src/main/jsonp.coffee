# JSONP functions -----------------------------------------_

Myna.jsonp =
  callbacks: {}
  counter: 0

  # string string -> HTMLElement
  #
  # This private method is factored out of Myna.jsonp.request
  # so we can hook into it in unit tests. See jsonp-spec.coffee
  createScriptElem: (url, callbackName) ->
    scriptElem = document.createElement("script")
    scriptElem.setAttribute("type","text/javascript")
    scriptElem.setAttribute("async", "true")
    scriptElem.setAttribute("src", url)
    scriptElem.setAttribute("class", "myna-jsonp")
    scriptElem.setAttribute("data-callback", callbackName)

    # onreadystatechange is for IE, onload/onerror for everyone else
    scriptElem.onload = scriptElem.onreadystatechange = ->
      Myna.jsonp.remove(callbackName, scriptElem)

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
  request: (options = {}) ->
    urlRoot      = options.url     ? Myna.error("Myna.jsonp.request", "no url in options", options)
    success      = options.success ? (->)
    error        = options.error   ? (->)
    timeout      = options.timeout ? 0 # 0 means no timeout
    params       = options.params  ? {}
    callbackName = "callback#{Myna.jsonp.counter++}"
    returned     = false

    # Calculate full URL:

    url = "#{urlRoot}?"
    for key, value of params then url += "#{key}=#{value}&"
    url += "callback=Myna.jsonp.callbacks." + callbackName

    Myna.log("Myna.jsonp.request", url, success, error, timeout)

    # Prepare script element:

    scriptElem = Myna.jsonp.createScriptElem(url, callbackName)

    # Register timeout function

    onTimeout = ->
      if returned
        Myna.log("Myna.jsonp.request.onTimeout", callbackName, timeout, "already returned")
      else
        returned = true
        Myna.log("Myna.jsonp.request.onTimeout", callbackName, timeout)
        Myna.jsonp.remove(callbackName, scriptElem)
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
        Myna.log("Myna.jsonp.request.onComplete", callbackName, "already returned")
      else
        returned = true
        Myna.log("Myna.jsonp.request.onComplete", callbackName, response.typename, response.typename == "problem", response)
        window.clearTimeout(timer)
        Myna.jsonp.remove(callbackName, scriptElem)
        if response.typename == "problem"
          error(response)
        else
          success(response)

    Myna.jsonp.callbacks[callbackName] = onComplete

    # Append script tag to body, initiating request:

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

