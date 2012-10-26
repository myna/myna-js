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

    waitsFor(function() { return flag; }, "the suggestion to return", 500)

    runs(function() {
      expect(result.choice).toBeTruthy();
      expect(result.token).toBeTruthy();

      var suggestion = result;
      flag = false;
      result = false;
      suggestion.reward(
        1.0,
        function(ok) { flag = true; result = ok; },
        function(error) { flag = true; result = error; }
      )
    })

    waitsFor(function() { return flag; }, "the reward to return", 500)

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

    waitsFor(function() { return flag; }, "the suggestion to return", 500)

    runs(function() {
      expect(result.choice).toBeTruthy();
      expect(result.token).toBeTruthy();

      var suggestion = result;
      flag = false;
      result = false;
      suggestion.reward(
        0.5,
        function(ok) { flag = true; result = ok; },
        function(error) { flag = true; result = error; }
      )
    })

    waitsFor(function() { return flag; }, "the reward to return", 500)

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

    waitsFor(function() { return flag; }, "the suggestion to return", 500)

    runs(function() {
      var suggestion = result;
      flag = false;
      result = false;
      suggestion.token = "ha-ha"
      suggestion.reward(
        1.0,
        function(ok) { flag = true; result = ok; },
        function(error) { flag = true; result = error; }
      )
    })

    waitsFor(function() { return flag; }, "the reward to return", 500)

    runs(function() {
      expect(result.typename).toBe("problem");
      expect(result.subtype).toBe(400);
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

    waitsFor(function() { return flag; }, "the suggestion to return", 500)

    runs(function() {
      var suggestion = result;
      flag = false;
      result = false;
      suggestion.reward(
        2.0,
        function(ok) { flag = true; result = ok; },
        function(error) { flag = true; result = error; }
      )
    })

    waitsFor(function() { return flag; }, "the reward to return", 500)

    runs(function() {
      expect(result.typename).toBe("problem");
      expect(result.subtype).toBe(400);
    })
  })

  it("should run reward event handlers when making a reward", function() {
    var flag = false;
    var result = false;
    var suggestion = undefined;
    var count = 0;
    var evts = [];
    var handler = function(suggestion, amount, result) {
      count++;
      evts.push([suggestion, amount, result]);
    }

    runs(function () {
      experiment.suggest(
        function(s) { flag = true; suggestion = s; },
        function(error) { flag = true; suggestion = error; })
    })

    waitsFor(function() { return flag; }, "the suggestion to return", 500)

    runs(function() {
      Myna.onreward.push(handler); Myna.onreward.push(handler);
      flag = false;
      result = false;
      suggestion.reward(
        1.0,
        function(ok) { flag = true; result = ok; },
        function(error) { flag = true; result = error; }
      )
    })

    waitsFor(function() { return flag; }, "the reward to return", 500)

    runs(function() {
      Myna.onreward.pop(); Myna.onreward.pop();
      expect(evts.length).toBe(2);
      expect(evts[0][0].experiment.uuid).toEqual(suggestion.experiment.uuid)
      expect(evts[0][1]).toBe(1.0);
      expect(evts[0][2]).toBe(result);
      expect(evts[1][0].experiment.uuid).toEqual(suggestion.experiment.uuid)
      expect(evts[1][1]).toBe(1.0);
      expect(evts[1][2]).toBe(result);
    })
  })

  it("should run reward event handlers on error", function() {
    var flag = false;
    var result = false;
    var suggestion = undefined;
    var count = 0;
    var evts = [];
    var handler = function(suggestion, amount, result) {
      count++;
      evts.push([suggestion, amount, result]);
    }

    runs(function () {
      experiment.suggest(
        function(s) { flag = true; suggestion = s; },
        function(error) { flag = true; suggestion = error; })
    })

    waitsFor(function() { return flag; }, "the suggestion to return", 500)

    runs(function() {
      Myna.onreward.push(handler); Myna.onreward.push(handler);
      flag = false;
      result = false;
      suggestion.reward(
        2.0,
        function(ok) { flag = true; result = ok; },
        function(error) { flag = true; result = error; }
      )
    })

    waitsFor(function() { return flag; }, "the reward to return", 500)

    runs(function() {
      Myna.onreward.pop(); Myna.onreward.pop();
      expect(evts.length).toBe(2);
      expect(evts[0][0].experiment.uuid).toEqual(suggestion.experiment.uuid)
      expect(evts[0][1]).toBe(2.0);
      expect(evts[0][2]).toBe(result);
      expect(evts[1][0].experiment.uuid).toEqual(suggestion.experiment.uuid)
      expect(evts[1][1]).toBe(2.0);
      expect(evts[1][2]).toBe(result);
    })
  })


})
