# class Suggestion

#   # Experiment String String -> Suggestion
#   constructor: (@experiment, @choice, @token) ->

#   reward: (amount = 1.0, success = @experiment.config.rewardSuccess, error = @experiment.config.error) ->
#     doOnReward = (result) =>
#       f(this, amount, result) for f in Myna.onreward

#     data =
#       token: @token
#       amount: amount

#     successWrapper = (data) =>
#       doOnReward(data)
#       success(data)

#     errorWrapper = (data) =>
#       @experiment.logger.log(LogLevel.ERROR, "Suggestion.reward errorWrapper called")
#       @experiment.logger.log(LogLevel.ERROR, data)

#       doOnReward(data)
#       if error
#         error(data)

#     options =
#       url: @experiment.config.baseurl + "/v1/experiment/#{@experiment.uuid}/reward"
#       data: data
#       success: successWrapper
#       error: errorWrapper

#     JsonP.doJsonP(extend(options, @experiment.config))

#   # Record this suggestion in a cookie. Value is of the form
#   # @token:@choice. We can guarantee that token doesn't contain the
#   # character :, but can make no such guarantee about the choice.
#   remember: ->
#     Cookie.create(@experiment.config.cookieName, "#{@token}:#{@choice}", @experiment.config.cookieLifespan)

#   # Element String -> Undefined
#   #
#   # Special case for rewarding Myna when a link is clicked. Waits for
#   # Myna to return from reward before forwarding the user to the new
#   # location. If this is not done, the request to Myna will be
#   # cancelled when the user navigates away from the current page.
#   #
#   # Any existing onClick handler is overridden.
#   rewardOnClick: (elt, location, amount = 1.0) ->
#     redirect = () ->
#       window.location = location
#       return
#     handler = (evt) =>
#       # Get the event in IE
#       if !evt
#         evt = window.event

#       # Don't do default action (following the link)
#       if evt.stopPropagation
#         evt.stopPropagation()
#       if evt.returnValue
#         evt.returnValue = false

#       this.reward(amount, redirect, redirect)

#       false

#     elt.onclick = handler
#     return