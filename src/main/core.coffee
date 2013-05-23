window.Myna ?= {}

Myna.debug = true

Myna.log = (args...) ->
  if Myna.debug
    window.console?.log(args)
  return

Myna.extend = (des, sources...) ->
  for src in sources
    for key, value of src when !des[key]
      des[key] = value
  des

Myna.dateToString = (date) ->
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