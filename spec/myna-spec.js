describe("Myna", function() {
  var testUuid = "45923780-80ed-47c6-aa46-15e2ae7a0e8c";
  var experiment;

  beforeEach(function() {
    experiment = new Myna(testUuid);
  })

  it("should return a suggestion when asked to", function() {
    var flag = false;
    var result = false;

    runs(function () {
      experiment.suggest(
        function(suggestion) { flag = true; result = suggestion },
        function(error) { flag = true; result = error})
    })

    waitsFor(function() { return flag; }, "The suggestion should return", 1000)

    runs(function() {
      expect(result.choice).toBeTruthy();
      expect(result.token).toBeTruthy();
    })
  })
})
