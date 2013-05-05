describe("Experiment.recallOrSuggest", function() {
  var testUuid = "45923780-80ed-47c6-aa46-15e2ae7a0e8c";
  var experiment;

  beforeEach(function() {
    experiment = new Experiment(testUuid);
    if(experiment.recall()) {
      experiment.forget();
    }
  });

  it("call suggest if there's nothing to recall", function() {
    var flag = false;
    var result = false;

    runs(function () {
      experiment.recallOrSuggest(
        function(suggestion) { flag = true; result = suggestion },
        function(error) { flag = true; result = error }
      )
    })

    waitsFor(function() { return flag; }, "The suggestion should return", 500)

    runs(function() {
      expect(result.choice).toBeTruthy();
      expect(result.token).toBeTruthy();
    })
  });

  // it("recall previously remembered suggestion", function() {
  //   var flag = false;
  //   var firstResult = false;
  //   var secondResult = false;

  //   runs(function () {
  //     experiment.suggest(function(firstSuggestion) {
  //       firstResult = firstSuggestion;

  //       experiment.recallOrSuggest(
  //         function(secondSuggestion) {
  //           flag = true;
  //           secondResult = secondSuggestion
  //         },
  //         function(error) {
  //           flag = true;
  //           secondResult = error
  //         }
  //       );
  //     });
  //   });

  //   waitsFor(function() { return flag; }, "The suggestion should return", 500);

  //   runs(function() {
  //     expect(firstResult.choice).toBeEqual(secondResult.choice);
  //     expect(firstResult.token).toBeEqual(secondResult.token);
  //   });
  // });
});
