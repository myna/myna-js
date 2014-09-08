jsonp = require '../../main/common/jsonp'
base  = require '../spec-base'

describe "jsonp.request", ->
  it "should fetch data", (done) ->
    expect(window.__mynaCallbacks).toEqual({})

    promise = jsonp.request("#{base.testApiRoot}/v1/version")

    expect(window.__mynaCallbacks).not.toEqual({})
    expect(document.getElementsByClassName('myna-jsonp').length).toEqual(1)

    promise.catch(@fail).then (data) ->
      expect(typeof data).toEqual("object")
      expect(data.version).toMatch(/^[a-z0-9]{40}$/)


      expect(window.__mynaCallbacks).toEqual({})
      expect(document.getElementsByClassName('myna-jsonp').length).toEqual(0)


      done()

  it "should call the error callback if the request times out", (done) ->
    original = jsonp._createCallback

    # Replace createScriptElem with a method that creates an invalid script tag:
    spy = spyOn(jsonp, "_createScriptElem").and.callFake (url, callbackId) ->
      scriptElem = document.createElement("script")
      scriptElem.setAttribute("id", callbackId)
      scriptElem.setAttribute("class", "myna-jsonp")
      scriptElem

    promise = jsonp.request("#{base.testApiRoot}/v1/version", {}, 50)

    expect(window.__mynaCallbacks).not.toEqual({})
    expect(document.getElementsByClassName('myna-jsonp').length).toEqual(1)

    promise.then(@fail).catch (error) ->
      expect(typeof error).toEqual("object")
      expect(error.messages[0].typename).toEqual("timeout")

      expect(window.__mynaCallbacks).toEqual({})
      expect(document.getElementsByClassName('myna-jsonp').length).toEqual(0)

      done()

describe "jsonp._removeCallback", ->
  it "should remove a callback by name", (done) ->
    func = (->)
    window.__mynaCallbacks.a = func

    dummyScript = document.createElement('script')
    dummyScript.setAttribute('id', 'a')
    document.getElementsByTagName("head")[0].appendChild(dummyScript)

    expect(window.__mynaCallbacks).toEqual({ a: func })
    expect(document.getElementById('a')).toEqual(dummyScript)

    jsonp._removeCallback('a')

    expect(window.__mynaCallbacks).toEqual({})
    expect(document.getElementById('a')).toEqual(null)

    done()
