describe("Myna.onload", function() {

  it("should be fired when Myna loads or immediately", function() {
    var loaded = false;
    runs(function() { Myna.onload.push(function() { loaded = true; }) });

    waitsFor(function() { return loaded; }, "The onload handler to fire", 500);

    runs(function() {
      expect(loaded).toBe(true);
    });
  })

})
