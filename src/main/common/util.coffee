# Adapted from jQuery:
trim = (str) ->
  if str == null then "" else str.replace /^\s+|\s+$/g, ''

# From underscore.js:
isArray = Array.isArray || (obj) ->
  Object.prototype.toString.call(obj) == '[object Array]'

# From underscore.js:
isObject = (obj) ->
  obj == Object(obj)

isEmptyObject = (obj) ->
  if isObject(obj)
    hasOwnProperty = Object.prototype.hasOwnProperty
    for key of obj when hasOwnProperty.call(obj, key) then return false
    return true
  else false

extend = (des, sources...) ->
  for src in sources
    for key, value of src
      des[key] = value
  des

deleteKeys = (obj, keys...) ->
  ans = extend({}, obj)
  for key in keys then delete ans[key]
  ans

dateToString = (date) ->
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

problem = (msg) ->
  new Error(msg)

# This allows us to mock out actions that redirect
redirect = (url) ->
  window.location.replace(url)

module.exports = {
  trim
  isArray
  isObject
  isEmptyObject
  extend
  deleteKeys
  dateToString
  problem
  redirect
}