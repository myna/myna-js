storage = {}

cookie = require './cookie'
local  = require './local'

# Top-level methods -----------------------------

# string -> object
get = (key) =>
  if local.supported && local.enabled
    local.get(key)
  else
    cookie.get(key)

# string object -> object
set = (key, value) =>
  if local.supported && local.enabled
    local.set(key, value)
  else
    cookie.set(key, value)
  return

# string object -> void
remove = (key) =>
  if local.supported && local.enabled
    local.remove(key)
  else
    cookie.remove(key)
  return

module.exports = {
  get
  set
  remove
}
