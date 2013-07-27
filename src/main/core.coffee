window.Myna ?= {}

Myna.debug = true

Myna.log = (args...) ->
  if Myna.debug
    window.console?.log(args)
  return

Myna.error = (args...) ->
  if Myna.debug
    window.console?.error(args)
  throw args

# Adapted from jQuery:
Myna.trim = (str) ->
  if str == null then "" else str.replace /^\s+|\s+$/g, ''

# From underscore.js:
Myna.isArray = Array.isArray || (obj) ->
  Object.prototype.toString.call(obj) == '[object Array]'

# From underscore.js:
Myna.isObject = (obj) ->
  obj == Object(obj)

Myna.extend = (des, sources...) ->
  for src in sources
    for key, value of src
      des[key] = value
  des

Myna.deleteKeys = (obj, keys...) ->
  ans = Myna.extend({}, obj)
  for key in keys then delete ans[key]
  ans

Myna.dateToString = (date) ->
  if Date.prototype.toISOString
    date.toISOString()
  else
    pad = (num, len) ->
      str = "#{num}"
      while str.length < len
        str = '0' + str
      str

    year   = pad(date.getUTCFullYear(), 4)
    month  = pad(date.getUTCMonth() + 1, 2)
    day    = pad(date.getUTCDate(), 2)
    hour   = pad(date.getUTCHours(), 2)
    minute = pad(date.getUTCMinutes(), 2)
    second = pad(date.getUTCSeconds(), 2)
    milli  = pad(date.getUTCMilliseconds(), 2)

    "#{year}-#{month}-#{day}T#{hour}:#{minute}:#{second}.#{milli}Z"

Myna.problem = (msg) ->
  msg

Myna.$ = window.jQuery ? null
