# Utility functions ---------------------------------------

extend = (dest, src) ->
  dest[name] = src[name] for name in src when src[name] and !dest[name]
  dest
