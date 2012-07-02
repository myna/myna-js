describe("Suggestion.remember", function() {

  it("should record suggestion value in a cookie", function() {
    var experiment = new Experiment("45923780-80ed-47c6-aa46-15e2ae7a0e8c")
    if(experiment.recall()) {
      experiment.forget()
    }

    expect(experiment.recall()).toBe(undefined)

    var suggestion = new Suggestion(experiment, "choice", "token")
    suggestion.remember()

    var recalled = experiment.recall()
    expect(recalled.choice).toBe("choice")
    expect(recalled.token).toBe("token")
    expect(recalled.experiment).toBe(experiment)
  })

})
