describe "Experiment.recallOrSuggest", ->
  testUuid = "45923780-80ed-47c6-aa46-15e2ae7a0e8c"
  experiment = null

  beforeEach ->
    experiment = new Experiment(testUuid)
    if experiment.recall() then experiment.forget()

  it "call suggest if there's nothing to recall", ->
    flag = false
    result = false

    runs ->
      experiment.recallOrSuggest(
        (suggestion) ->
          flag = true
          result = suggestion
          return
        (error) ->
          flag = true
          result = error
          return
      )

    waitsFor (-> flag), "The suggestion should return", 500

    runs ->
      expect(result.choice).toBeTruthy()
      expect(result.token).toBeTruthy()

  it "recall previously remembered suggestion", ->
    flag = false
    firstResult = false
    secondResult = false

    runs ->
      experiment.suggest (firstSuggestion) ->
        firstResult = firstSuggestion
        firstSuggestion.remember()
        experiment.recallOrSuggest(
          (secondSuggestion) ->
            flag = true
            secondResult = secondSuggestion
            return
          (error) ->
            flag = true
            secondResult = error
            return
        )

    waitsFor (-> flag), "The suggestion should return", 500

    runs ->
      console.log(JSON.stringify(firstResult))
      console.log(JSON.stringify(secondResult))
      expect(firstResult.choice).toBe(secondResult.choice)
      expect(firstResult.token).toBe(secondResult.token)
