// Utility functions ---------------------------------------

extend = (dest, src) ->
  dest[name] = src[name] for name in src when src[name] && !dest[name]
  dest
