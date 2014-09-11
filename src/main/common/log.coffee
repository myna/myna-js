enabled = false

debug = (args...) ->
  if enabled
    window.console?.log(args)
  return

error = (args...) ->
  window.console?.error(args...)
  throw args

module.exports = {
  enabled
  debug
  error
}
