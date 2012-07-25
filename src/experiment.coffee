class Experiment

  # String Hash -> Experiment
  constructor: (@uuid, options = {}) ->
    @config = new Config(@uuid).extend(options)
    @logger = new Log(@config.loglevel)

  # (Suggestion -> A) (JSON -> B) -> Undefined
  suggest: (success, error = @config.error) ->
    # (U Suggestion JSON) -> Undefined
    doOnSuggest = (data) =>
      f(this, data) for f in Myna.onsuggest

    # JSON -> A
    successWrapper = (data) =>
      @logger.log(LogLevel.DEBUG, "Experiment.suggest successWrapper called")
      @logger.log(LogLevel.DEBUG, data)

      if data.typename == "suggestion"
        @logger.log(LogLevel.INFO, "Myna suggested " + data.choice)
        @logger.log(LogLevel.DEBUG, "Response token is " + data.token)
        suggestion = new Suggestion(this, data.choice, data.token)
        doOnSuggest(suggestion)

        if success
          success(suggestion)
        else
          @logger.log(LogLevel.WARN, "You should pass a success function to Experiment.suggest. See the docs for details.")
      else if data.typename == "problem"
        @logger.log(LogLevel.ERROR, "Experiment.suggest returned an API error: #{data.subtype} #{data.messages}")
        errorWrapper(data)
      else
        @logger.log(LogLevel.ERROR, "Experiment.suggest did something unexpected")
        @logger.log(LogLevel.ERROR, data)

        errorWrapper
          typename: 'problem',
          subtype: 400
          messages: [{typename: "unexpected", item: data}]

      # JSON -> B
    errorWrapper = (data) =>
      @logger.log(LogLevel.ERROR, "Experiment.suggest errorWrapper called")
      @logger.log(LogLevel.ERROR, data)

      doOnSuggest(data)
      if error
        error(data)

    options =
      url: @config.baseurl + "/v1/experiment/#{@uuid}/suggest"
      data: {}
      success: successWrapper
      error: errorWrapper

    JsonP.doJsonP(extend(options, @config))

  # -> (U Undefined Suggestion)
  recall: ->
    cookie = Cookie.read(@config.cookieName)
    if cookie
      i = cookie.indexOf(':')
      if i >= 0
        token = cookie.substring(0,i)
        choice = cookie.substring(i+1, cookie.length)
        new Suggestion(this, choice, token)
      else
        undefined
    else
      undefined

  # -> Undefined
  forget: -> Cookie.erase(@config.cookieName)

window.Myna.Experiment = Experiment