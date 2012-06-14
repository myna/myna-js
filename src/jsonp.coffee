// JSONP functions -----------------------------------------

// List of callback functions. Must be globally scoped
window.myna = { callbacks: [] }

JsonP =
  callbackCounter: 0

  removeCallback: (callbackName) ->
    if this.readyState and
       this.readyState !== "complete" and
       this.readyState !== "loaded"
    else
      this.onload = null;
      try
        this.parentNode.removeChild(this)
      catch e
      finally
        window.myna.callbacks[callbackName] = null

  doJsonP: (options) ->
    callbackName = "callback" + (JsonP.callbackCounter++)
    window.myna.callbacks[callbackName] =
      (args) -> options.success.apply(this, arguments)

    url = options.url + "?"
    url += key + "=" + options.data[key] + "&" for key in options.data
    url += "callback=window.myna.callbacks." + callbackName

    //myna.log(LogLevel.DEBUG, "Sending JSON-P request to " + url);

    elem = document.createElement("script")
    elem.setAttribute("type","text/javascript")
    // onreadystatechange is for IE, onload for everyone else
    elem.onload = elem.onreadystatechange =
      () -> JsonP.removeCallback.call(elem, callbackName)
    elem.setAttribute("src", url)
    document.getElementsByTagName("head")[0].appendChild(elem)
