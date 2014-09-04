enabled = true

debug = (args...) ->
  if enabled
    window.console?.log(args)
  return

error = (args...) ->
  if enabled
    window.console?.error(args)
  throw args

module.exports = {
  enabled
  debug
  error
}
