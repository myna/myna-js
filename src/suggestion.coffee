class Suggestion

  # Experiment String String -> Suggestion
  constructor: (@experiment, @choice, @token) ->

  reward: (amount = 1.0, success = @experiment.config.rewardSuccess, error = @experiment.config.error) ->
    data =
      token: @token
      amount: amount

    JsonP.doJsonP
      url: @experiment.config.baseurl + "/v1/experiment/#{@experiment.uuid}/reward"
      data: data
      success: success
      error: error

  # Record this suggestion in a cookie. Value is of the form
  # @token:@choice. We can guarantee that token doesn't contain the
  # character :, but can make no such guarantee about the choice.
  remember: ->
    Cookie.create(@experiment.config.cookieName, "#{@token}:#{@choice}", @experiment.config.cookieLifespan)