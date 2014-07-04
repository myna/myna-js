log   = require './log'
log   = require './log'
cache = require './cache'

parse = (hash = window.location.hash) ->
  hash = if !hash then "" else if hash[0] == "#" then hash.substring(1) else hash

  ans = {}
  for part in hash.split("&") when part != ""
    [ lhs, rhs ] = part.split("=")
    ans[decodeURIComponent(lhs)] = decodeURIComponent(rhs ? lhs)

  log.debug("hash.parse", ans)

  ans

params = parse()

if params["debug"]
  log.enabled = true

# -> boolean
preview = ->
  if params["preview"]
    cache.save("myna-preview", true)
    true
  else
    !!cache.load("myna-preview")

# boolean -> void
setPreview = (preview) ->
  cache.save("myna-preview", !!preview)
  return

module.exports = {
  params
  preview
  setPreview
}