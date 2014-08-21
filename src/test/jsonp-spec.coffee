jsonp = require '../main/jsonp'

describe "jsonp.request", ->
  it "should fetch data", ->
    data  = null
    error = null

    runs ->
      jsonp.request
        url: "#{testApiRoot}/v1/version"
        success: (d) -> data  = d
        error:   (e) -> error = e

      expect(jsonp.callbacks()).not.toEqual({})
      expect(document.getElementsByClassName('myna-jsonp').length).toEqual(1)

    waitsFor -> data || error

    runs ->
      expect(error).toEqual(null)

      expect(typeof data).toEqual("object")
      expect(data.version).toMatch(/^[a-z0-9]{40}$/)

      expect(jsonp.callbacks()).toEqual({})
      expect(document.getElementsByClassName('myna-jsonp').length).toEqual(0)

  it "should call the error callback if the request times out", ->
    data  = null
    error = null

    # Replace createScriptElem with a method that creates an invalid script tag:
    spyOn(jsonp, "createScriptElem").andCallFake (url, callbackName) ->
      scriptElem = document.createElement("script")
      scriptElem.setAttribute("type","text/javascript")
      scriptElem.setAttribute("class", "myna-jsonp")
      scriptElem.setAttribute("data-callback", callbackName)
      scriptElem

    runs ->
      jsonp.request
        url:     "#{testApiRoot}/v1/version"
        success: (d) -> data  = d
        error:   (e) -> error = e
        timeout: 1

    waitsFor -> data || error

    runs ->
      @removeAllSpies()

      expect(data).toEqual(null)

      expect(typeof error).toEqual("object")
      expect(error.messages[0].typename).toEqual("timeout")

      expect(jsonp.callbacks()).toEqual({})
      expect(document.getElementsByClassName('myna-jsonp').length).toEqual(0)

describe "jsonp.removeCallback", ->
  it "should remove a callback even if the scriptElem argument is null", ->
    jsonp.callbacks().a = (->)
    expect(jsonp.callbacks()).not.toEqual({})

    jsonp.removeCallback('a', null)
    expect(jsonp.callbacks()).toEqual({})

  it "should remove a script tag even if the callbackName argument is null", ->
    scriptElem = document.createElement("script")
    scriptElem.id = 'myscript'
    document.getElementsByTagName("head")[0].appendChild(scriptElem)
    expect(document.getElementById('myscript')).toEqual(scriptElem)

    jsonp.removeCallback(null, scriptElem)
    expect(document.getElementById('myscript')).toEqual(null)
