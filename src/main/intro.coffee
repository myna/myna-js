window.Myna ?= {}

Myna.debug = false

Myna.log = (args...) ->
  if Myna.debug
    window.console?.log(for item in args then JSON.stringify(item))
  return

Myna.error = (args...) ->
  throw args

Myna.extend = (des, src) ->
  for key, value of src when !des[key]
    des[key] = value
  des
