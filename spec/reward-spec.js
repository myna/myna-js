describe("Suggestion.reward", function() {
  var testUuid = "45923780-80ed-47c6-aa46-15e2ae7a0e8c";
  var experiment;

  beforeEach(function() {
    experiment = new Experiment(testUuid);
  })

  it("should return ok when correctly rewarding", function() {
    var flag = false;
    var result = false;

    runs(function () {
      experiment.suggest(
        function(suggestion) { flag = true; result = suggestion },
        function(error) { flag = true; result = error})
    })

    waitsFor(function() { return flag; }, "the suggestion to return", 5000)

    runs(function() {
      expect(result.choice).toBeTruthy();
      expect(result.token).toBeTruthy();

      var suggestion = result;
      flag = false;
      result = false;
      suggestion.reward(
        function(ok) { flag = true; result = ok; },
        function(error) { flag = true; result = err; }
      )
    })

    waitsFor(function() { return flag; }, "the reward to return", 5000)

    runs(function() {
      expect(result.typename).toBe("ok");
    })
  })

  it("should allow amount to be specified", function() {
    var flag = false;
    var result = false;

    runs(function () {
      experiment.suggest(
        function(suggestion) { flag = true; result = suggestion },
        function(error) { flag = true; result = error})
    })

    waitsFor(function() { return flag; }, "the suggestion to return", 5000)

    runs(function() {
      expect(result.choice).toBeTruthy();
      expect(result.token).toBeTruthy();

      var suggestion = result;
      flag = false;
      result = false;
      suggestion.reward(
        0.5,
        function(ok) { flag = true; result = ok; },
        function(error) { flag = true; result = err; }
      )
    })

    waitsFor(function() { return flag; }, "the reward to return", 5000)

    runs(function() {
      expect(result.typename).toBe("ok");
    })
  })

  it("should handle errors on an invalid token", function() {
    var flag = false;
    var result = false;

    runs(function () {
      experiment.suggest(
        function(suggestion) { flag = true; result = suggestion },
        function(error) { flag = true; result = error})
    })

    waitsFor(function() { return flag; }, "the suggestion to return", 5000)

    runs(function() {
      var suggestion = result;
      flag = false;
      result = false;
      suggestion.token = "ha-ha"
      suggestion.reward(
        function(ok) { flag = true; result = ok; },
        function(error) { flag = true; result = err; }
      )
    })

    waitsFor(function() { return flag; }, "the reward to return", 5000)

    runs(function() {
      expect(result.typename).toBe("problem");
      expect(result.code).toBe(400);
    })
  })

  it("should handle errors on an invalid amount", function() {
    var flag = false;
    var result = false;

    runs(function () {
      experiment.suggest(
        function(suggestion) { flag = true; result = suggestion },
        function(error) { flag = true; result = error})
    })

    waitsFor(function() { return flag; }, "the suggestion to return", 5000)

    runs(function() {
      var suggestion = result;
      flag = false;
      result = false;
      suggestion.reward(
        2.0,
        function(ok) { flag = true; result = ok; },
        function(error) { flag = true; result = err; }
      )
    })

    waitsFor(function() { return flag; }, "the reward to return", 5000)

    runs(function() {
      expect(result.typename).toBe("problem");
      expect(result.code).toBe(400);
    })
  })

})
