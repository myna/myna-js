Myna.extend = (dest, src) ->
  for key, value of src when !dest[key]
    dest[key] = value
  dest

# Stolen from Modernizr:
Myna.feature.localStorage =
  try
    localStorage.setItem('modernizer', 'modernizer')
    localStorage.removeItem('modernizer')
    true
  catch exn
    false
