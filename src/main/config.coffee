# class Config
#   # String -> Config
#   constructor: (uuid) ->

#     protocol = if 'https:' == document.location.protocol then 'https' else 'http'

#     # number (lifespan of the cookie in days from now)
#     @cookieLifespan = 365

#     # string
#     @cookieName = "myna" + uuid

#     # natural (ms)
#     @timeout = 1200

#     # string (url)
#     @baseurl = "#{protocol}://api.mynaweb.com"

#     # natural: See LogLevel for values
#     @loglevel = LogLevel.ERROR

#     # json -> undefined: Default function used for reward success callback
#     @rewardSuccess = (ok) -> undefined

#     # json -> undefined: Default function used for error callback
#     @error = (problem) -> undefined

#   extend: (options) ->
#     extend(extend({}, options), this)
