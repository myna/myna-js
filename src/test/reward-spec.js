describe("Suggestion.reward", function() {
  var testUuid = "45923780-80ed-47c6-aa46-15e2ae7a0e8c";
  var experiment;

  var timeout = 1000; // How long, in ms, do we wait for calls to Myna

  // Useful debugging stuff
  var debug = true;
  function log(msg) {
    if(debug) {
      console.log("------------------------------------------------------------\n");
      console.log(msg);
      console.log("\n------------------------------------------------------------\n");
    }
  }

  function promiseTest(promise) {
      var _this = {
        ready: false,  // (U "success" "error" false)
        result: null   // Any
      };
      
      runs(function() {
        promise.fork(
          function(data) {
            _this.ready = "success";
            _this.result = data;
          },
          function(error) {
            _this.ready = "error";
            _this.result = error;
          }
        );
      });

      waitsFor(
        function() { return _this.ready !== false; },
        "promise to evaluate",
        timeout
      );

      runs(function() {
        expect(_this.ready).toBe("success");
      });
  }


  function makeSuggestion() {
    return new Promise(function(success, error) {
        experiment.suggest(success, error);
    });
  }

  function makeReward(amount) {
    return function(suggestion) {
      if(amount) {
        return new Promise(function(success, error) {
          suggestion.reward(
            amount,
            success,
            error
          );
        });
      } else {
        return new Promise(function(success, error) {
            suggestion.reward(
              1.0,
              success,
              error
            );
        });
      }
    };
  }

  beforeEach(function() {
    experiment = new Experiment(testUuid);
  });

  it("should return ok when correctly rewarding", function() {
    promiseTest(makeSuggestion().chain(makeReward()));
  });

  it("should allow amount to be specified", function() {
    promiseTest(makeSuggestion().chain(makeReward(1.0)));
  });

  it("should handle errors on an invalid token", function() {
    promiseTest(makeSuggestion().chain(function(suggestion) {
      suggestion.token = "ha-ha";
      return new Promise(function(success, error) {
        suggestion.reward(
          1.0,
          // Success is failure in this case
          function(ok) { error(ok); },
          function(problem) { 
            if(problem.typename === "problem" && problem.subtype === 400) {
              success(problem); 
            } else {
              error(problem);
            }
          }
        );
      });
    }));
  });

  it("should handle errors on an invalid amount", function() {
    promiseTest(makeSuggestion().chain(function(suggestion) {
      return new Promise(function(success, error) {
        suggestion.reward(
          2.0,
          // Success is failure in this case
          function(ok) { error(ok); },
          function(problem) { 
            if(problem.typename === "problem" && problem.subtype === 400) {
              success(problem); 
            } else {
              error(problem);
            }
          }
        );
      });
    }));
  });

  it("should run reward event handlers when making a reward", function() {
    var flag = false;
    var result = false;
    var suggestion;
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

    waitsFor(function() { return flag; }, "the suggestion to return", timeout)

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

    waitsFor(function() { return flag; }, "the reward to return", timeout)

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
    var suggestion;
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

    waitsFor(function() { return flag; }, "the suggestion to return", timeout)

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

    waitsFor(function() { return flag; }, "the reward to return", timeout)

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
