# Config holds general configuration, like the name suggests
class Config
  # String -> Config
  constructor: (uuid) ->
    # number (lifespan of the cookie in days from now)
    @cookieLifespan = 365
    # string
    @cookieName = "myna" + uuid
    # natural (ms)
    @timeout = 1000
    # string (url)
    @baseurl = "http://api.mynaweb.com"
    # natural: See LogLevel for values
    @loglevel = LogLevel.ERROR
    # json ->

  extend: (options) ->
    extend(extend({}, this), options)
