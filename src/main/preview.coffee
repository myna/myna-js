# -> boolean
Myna.preview = ->
  if window.location.hash == "#preview"
    Myna.cache.save("myna-preview", true)
    true
  else
    !!Myna.cache.load("myna-preview")
