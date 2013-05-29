window.Myna ?= {}

Myna.debug = true

Myna.trim = (str) ->
  if String.prototype.trim
    str.trim()
  else
    str.replace(/^\s+|\s+$/g, '')

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
  Myna.log("Myna.dateToString", date)
  try
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
  catch exn
    null

Myna.stringToDate = (str) ->
  Myna.log("Myna.stringToDate", str)
  try
    if str instanceof Date
      str
    else
      [ _, year, month, day, hour, minute, second, millisecond ] =
        str.match(/([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2}).([0-9]{3})Z/)

      unless year && month && day && hour && minute && second && millisecond
        return null

      # Work around cross-browser issues parsing numbers with leading zeroes:
      safeParseInt = (str) ->
        if str[0] == '0'
          safeParseInt(str.substring(1))
        else
          parseInt(str)

      new Date(Date.UTC(
        safeParseInt(year),
        safeParseInt(month) - 1,
        safeParseInt(day),
        safeParseInt(hour),
        safeParseInt(minute),
        safeParseInt(second),
        safeParseInt(millisecond)
      ))
  catch exn
    Myna.log(exn)
    null

Myna.problem = (msg) ->
  msg

Myna.$ = window.jQuery ? null