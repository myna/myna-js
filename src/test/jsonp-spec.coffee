describe "Myna.jsonp.request", ->
  it "should fetch data", ->
    data  = null
    error = null

    runs ->
      Myna.jsonp.request
        url: "#{testApiRoot}/v1/version"
        success: (d) -> data  = d
        error:   (e) -> error = e

      expect(Myna.jsonp.callbacks).not.toEqual({})
      expect(document.getElementsByClassName('myna-jsonp').length).toEqual(1)

    waitsFor -> data || error

    runs ->
      expect(error).toEqual(null)

      expect(typeof data).toEqual("object")
      expect(data.version).toMatch(/^[a-z0-9]{40}$/)

      expect(Myna.jsonp.callbacks).toEqual({})
      expect(document.getElementsByClassName('myna-jsonp').length).toEqual(0)

  it "should call the error callback if the request times out", ->
    data  = null
    error = null

    runs ->
      Myna.jsonp.request
        url:     "#{testApiRoot}/v1/version"
        success: (d) -> data  = d
        error:   (e) -> error = e
        timeout: 1

    waitsFor -> data || error

    runs ->
      expect(data).toEqual(null)

      expect(typeof error).toEqual("object")
      expect(error.messages[0].typename).toEqual("timeout")

      expect(Myna.jsonp.callbacks).toEqual({})
      expect(document.getElementsByClassName('myna-jsonp').length).toEqual(0)

describe "Myna.jsonp.remove", ->
  it "should remove a callback even if the scriptElem argument is null", ->
    Myna.jsonp.callbacks.a = (->)
    expect(Myna.jsonp.callbacks).not.toEqual({})

    Myna.jsonp.remove('a', null)
    expect(Myna.jsonp.callbacks).toEqual({})

  it "should remove a script tag even if the callbackName argument is null", ->
    scriptElem = document.createElement("script")
    scriptElem.id = 'myscript'
    document.getElementsByTagName("head")[0].appendChild(scriptElem)
    expect(document.getElementById('myscript')).toEqual(scriptElem)

    Myna.jsonp.remove(null, scriptElem)
    expect(document.getElementById('myscript')).toEqual(null)
