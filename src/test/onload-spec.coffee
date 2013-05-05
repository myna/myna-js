describe "Myna.onload", ->
  it "should be fired when Myna loads or immediately", ->
    loaded = false
    runs ->
      Myna.onload.push ->
        loaded = true
        return

    waitsFor (-> loaded), "The onload handler to fire", 500

    runs ->
      expect(loaded).toBe(true)
