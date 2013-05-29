Myna.phantomJs =
  /PhantomJS/.test(navigator.userAgent)

Myna.log = (args...) ->
  if Myna.debug
    if Myna.phantomJs
      window.console?.log(JSON.stringify(args))
    else
      window.console?.log(args)
  return

Myna.error = (args...) ->
  if Myna.phantomJs
    throw JSON.stringify(args)
  else
    throw args

class Myna.Logging
  logEnabled: true

  log: (method, args...) =>
    if @logEnabled then Myna.log("#{@constructor.name}.#{method}", args...)

  error: (method, args...) =>
    Myna.error("#{@constructor.name}.#{method}", args...)
