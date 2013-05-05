# Utility functions ---------------------------------------

extend = (dest, src) ->
  dest[key] = value for key, value of src when !dest[key]
  dest
