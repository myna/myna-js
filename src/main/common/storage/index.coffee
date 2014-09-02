storage = {}

cookie = require './cookie'
local  = require './local'

# Top-level methods -----------------------------

# string -> object
get = (key) =>
  if localStorage.supported && localStorage.enabled
    localStorage.get(key)
  else
    cookie.get(key)

# string object -> void
set = (key, value) =>
  if localStorage.supported && localStorage.enabled
    localStorage.set(key, value)
  else
    cookie.set(key, value)
  return

# string object -> void
remove = (key) =>
  if localStorage.supported && localStorage.enabled
    localStorage.remove(key)
  else
    cookie.remove(key)
  return

module.exports = {
  get
  set
  remove
}