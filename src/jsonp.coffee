# JSONP functions -----------------------------------------_

# {callbacks: [(Any ...) -> Undefined ...]}
#
# List of callback functions. Must be globally scoped
window.myna = { callbacks: [] }

JsonP =
  callbackCounter: 0

  # String -> Undefined
  removeCallback: (callbackName) ->
    if this.readyState and
       this.readyState != "complete" and
       this.readyState != "loaded"
    else
      this.onload = null;
      try
        this.parentNode.removeChild(this)
      catch e
      finally
        window.myna.callbacks[callbackName] = null

  # {success: (Any ...) -> Undefined,
  #  error: (JSON) -> Undefined,
  #  timeout: (U Number Undefined)
  #  url: String,
  #  data: Hash[String, String]} -> Undefined
  #
  # TODO: Handle errors and timeouts
  doJsonP: (options) ->
    # Used to sync the callback and timeout handlers
    returned = false

    callbackName = "callback" + (JsonP.callbackCounter++)
    window.myna.callbacks[callbackName] =
      (args) ->
        if !returned
          returned = true
          options.success.apply(this, arguments)

    url = options.url + "?"
    url += "#{key}=#{value}&" for key, value of options.data
    url += "callback=window.myna.callbacks." + callbackName

    if options.timeout > 0
      window.setTimeout( ->
        if !returned
          returned = true
          JsonP.removeCallback.call(elem, callbackName)
          options.error({typename: 'problem', subtype: 500, messages: [{typename: "timeout", item: "The server took longer than #{options.timeout} ms to reply"}]})
      , options.timeout)

    elem = document.createElement("script")
    elem.setAttribute("type","text/javascript")
    elem.setAttribute("async", "true")
    # onreadystatechange is for IE, onload/onerror for everyone else
    elem.onload = elem.onreadystatechange = -> JsonP.removeCallback.call(elem, callbackName)
    elem.setAttribute("src", url)
    document.getElementsByTagName("head")[0].appendChild(elem)
