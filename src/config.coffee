# Config holds general configuration, like the name suggests
class Config
  # String -> Config
  constructor: (uuid) ->
    # number (lifespan of the cookie in days from now)
    @cookieLifespan = 365
    # string
    @cookieName = "myna" + uuid
    # natural (ms)
    @timeout = 400
    # string (url)
    @baseurl = "http://api.mynaweb.com"
    # natural: See LogLevel for values
    @loglevel = LogLevel.ERROR
    # json -> undefined: Default function used for reward success callback
    @rewardSuccess = (ok) -> undefined
    # json -> undefined: Default function used for error callback
    @error = (problem) -> undefined

  extend: (options) ->
    extend(extend({}, this), options)
