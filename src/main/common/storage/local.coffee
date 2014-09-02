# boolean
enabled = false

# boolean
supported =
  try
    localStorage.setItem('modernizer', 'modernizer')
    localStorage.removeItem('modernizer')
    true
  catch exn
    false

# string -> U(object null)
get = (key) ->
  str = window.localStorage.getItem("myna-" + key)
  if str?
    try
      JSON.parse(str)
    catch exn
      null
  else
    null

# string object -> void
set = (key, obj) ->
  if obj?
    window.localStorage.setItem("myna-" + key, JSON.stringify(obj))
  else
    window.localStorage.removeItem("myna-" + key)
  return

# string -> void
remove = (key) ->
  window.localStorage.removeItem("myna-" + key)
  return

module.exports = {
  enabled
  supported
  get
  set
  remove
}