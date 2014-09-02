log     = require './common/log'
storage = require './common/storage'
hash    = require './common/hash'

# -> boolean
enabled = ->
  if hash.params.myna?
    storage.set("myna-ui", true)
    true
  else
    !!storage.get("myna-ui")

# boolean -> void
setEnabled = (preview) ->
  storage.set("myna-ui", !!preview)
  return

module.exports = {
  parse # for tests
  params
  enabled
  setEnabled
}
