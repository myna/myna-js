log = {
  enabled: false

  debug: (args...) ->
    if log.enabled
      window.console?.log(args)
    return

  error: (args...) ->
    if log.enabled
      window.console?.error(args)
    throw args
}

module.exports = log
