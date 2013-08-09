Myna.parseHashParams = (hash = window.location.hash) ->
  hash = if !hash then "" else if hash[0] == "#" then hash.substring(1) else hash

  ans = {}
  for part in hash.split("&") when part != ""
    [ lhs, rhs ] = part.split("=")
    ans[decodeURIComponent(lhs)] = decodeURIComponent(rhs ? lhs)

  Myna.log("parseHashParams", ans)

  ans

Myna.hashParams = Myna.parseHashParams()

if Myna.hashParams["debug"]
  Myna.debug = true

# -> boolean
Myna.preview = ->
  if Myna.hashParams["preview"]
    Myna.cache.save("myna-preview", true)
    true
  else
    !!Myna.cache.load("myna-preview")

# boolean -> void
Myna.setPreview = (preview) ->
  Myna.cache.save("myna-preview", !!preview)
  return
