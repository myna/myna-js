describe("Experiment.suggest", function() {
  var testUuid = "45923780-80ed-47c6-aa46-15e2ae7a0e8c";
  var experiment;

  beforeEach(function() {
    experiment = new Experiment(testUuid);
  })

  it("should return a suggestion when asked to", function() {
    var flag = false;
    var result = false;

    runs(function () {
      experiment.suggest(
        function(suggestion) { flag = true; result = suggestion },
        function(error) { flag = true; result = error}
      )
    })

    waitsFor(function() { return flag; }, "The suggestion should return", 500)

    runs(function() {
      expect(result.choice).toBeTruthy();
      expect(result.token).toBeTruthy();
    })
  })

  it("should handle errors on an invalid UUID", function() {
    var flag = false;
    var result = false;

    runs(function () {
      new Experiment("br0ken").suggest(
        function(suggestion) { flag = true; result = suggestion },
        function(error) { flag = true; result = error})
    })

    waitsFor(function() { return flag; }, "the suggestion to return", 500)

    runs(function() {
      console.log(result)
      expect(result.typename).toBe('problem');
      expect(result.subtype).toBe(400);
      expect(result.messages).toBeTruthy();
    })
  })

  it("should handle timeouts when the server doesn't respond", function() {
    var flag = false;
    var result = false;

    runs(function () {
      new Experiment("br0ken", {baseurl: "http://example.com/"}).suggest(
        function(suggestion) { flag = true; result = suggestion },
        function(error) { flag = true; result = error})
    })

    waitsFor(function() { return flag; }, "the suggestion to return", 1400)

    runs(function() {
      console.log(result)
      expect(result.typename).toBe('problem');
      expect(result.subtype).toBe(500);
      expect(result.messages).toBeTruthy();
      expect(result.messages[0].typename).toBe('timeout')
    })
  })

  it("should run suggest event handlers when making a suggestion", function() {
    var count = 0;
    var evts = [];
    var flag = false;
    var result = undefined;

    runs(function () {
      var handler = function(expt, suggestion) { count++; evts.push([expt, suggestion]) };
      Myna.onsuggest.push(handler, handler);

      experiment.suggest(
        function(suggestion) { flag = true; result = suggestion },
        function(error) { flag = true; result = error})
    })

    waitsFor(function() { return flag; }, "The suggestion should return", 500)

    runs(function() {
      Myna.onsuggest.pop(); Myna.onsuggest.pop();
      expect(count).toBe(2);
      expect(evts.length).toBe(2);
      expect(evts[0]).toEqual([experiment, result]);
      expect(evts[1]).toEqual([experiment, result]);
    })
  })

  it("should run suggest event handlers on error", function() {
    var count = 0;
    var evts = [];
    var flag = false;
    var result = undefined;
    var experiment = new Experiment("br0ken");

    runs(function () {
      var handler = function(expt, suggestion) { count++; evts.push([expt, suggestion]) };
      Myna.onsuggest.push(handler, handler);

      experiment.suggest(
        function(suggestion) { flag = true; result = suggestion },
        function(error) { flag = true; result = error})
    })

    waitsFor(function() { return flag; }, "The suggestion should return", 500)

    runs(function() {
      expect(count).toBe(2);
      expect(evts.length).toBe(2);
      expect(evts[0]).toEqual([experiment, result]);
      expect(evts[1]).toEqual([experiment, result]);
    })
  })
})
