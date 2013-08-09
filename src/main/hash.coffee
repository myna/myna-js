Myna.parseHashParams = (hash = window.location.hash) ->
  hash = if !hash then "" else if hash[0] == "#" then hash.substring(1) else hash
  parts = if hash == "" then [] else hash.split("&")

  ans = {}
  for part in parts
    [ lhs, rhs ] = part.split("=")
    ans[decodeURIComponent(lhs)] = decodeURIComponent(rhs ? lhs)
  ans

Myna.hashParams = Myna.parseHashParams()

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
