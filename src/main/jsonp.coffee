# JSONP functions -----------------------------------------_

Myna.jsonp =
  callbacks: {}
  counter: 0

  # (
  #   success : (any ... -> undefined)
  #   error   : (json -> undefined)
  #   timeout : (U number undefined)
  #   url     : string
  #   data    : object
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

    Myna.jsonp.callbacks[callbackName] = (response) ->
      unless returned
        returned = true
        Myna.jsonp.remove(callbackName, elem)
        if response.typename == "problem" then error(response) else success(response)

    url = "#{urlRoot}?"
    for key, value of options.data
      url += "#{key}=#{value}&"
    url += "callback=Myna.jsonp.callbacks." + callbackName

    scriptElem = document.createElement("script")
    scriptElem.setAttribute("type","text/javascript")
    scriptElem.setAttribute("async", "true")
    scriptElem.setAttribute("src", url)

    # onreadystatechange is for IE
    # onload/onerror for everyone else
    scriptElem.onload = scriptElem.onreadystatechange = ->
      Myna.jsonp.remove(callbackName, scriptElem)

    document.getElementsByTagName("head")[0].appendChild(scriptElem)

    if timeout > 0
      func = ->
        unless returned
          returned = true
          Myna.jsonp.remove(callbackName, scriptElem)
          error
            typename: 'problem'
            subtype: 500
            messages:
              typename: 'timeout'
              item: "The server took longer than #{options.timeout} ms to reply"
      window.setTimeout(func, timeout)

  remove: (callbackName, scriptElem) ->
    readyState = scriptElem.readyState
    unless readyState && readyState != "complete" && readyState != "loaded"
      scriptElem.onload = null
      try
        scriptElem.parentNode.removeChild(scriptElem)
      finally
        delete Myna.jsonp.callbacks[callbackName]

