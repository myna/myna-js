class Suggestion

  # Experiment String String -> Suggestion
  constructor: (@experiment, @choice, @token) ->

  reward: (amount = 1.0, success, error) ->
    data =
      token: @token
      amount: amount

    JsonP.doJsonP
      url: @experiment.config.baseurl + "/v1/experiment/#{@experiment.uuid}/reward"
      data: data
      success: success
      error: error