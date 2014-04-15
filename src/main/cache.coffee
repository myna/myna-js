Myna.cache ?= {}

Myna.cache.localStorageSupported =
  try
    localStorage.setItem('modernizer', 'modernizer')
    localStorage.removeItem('modernizer')
    true
  catch exn
    false

# Manually disable local storage by setting this to false:
Myna.cache.localStorageEnabled =
  true

# Local storage ---------------------------------

# string -> U(object null)
readLocalStorage = (key) ->
  str = window.localStorage.getItem("myna-" + key)
  if str?
    try
      JSON.parse(str)
    catch exn
      null
  else
    null

# string object -> void
writeLocalStorage = (key, obj) ->
  if obj?
    window.localStorage.setItem("myna-" + key, JSON.stringify(obj))
  else
    window.localStorage.removeItem("myna-" + key)
  return

# string -> void
removeLocalStorage = (key) ->
  window.localStorage.removeItem("myna-" + key)
  return

# Cookie ----------------------------------------

# Code adapted from Quirksmode

encodeCookieValue = (obj) ->
  encodeURIComponent(JSON.stringify(obj))

decodeCookieValue = (str) ->
  str = if str.indexOf('"') == 0
    # This is a quoted cookie as according to RFC2068: unescape.
    str.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\')
  else
    str

  JSON.parse(decodeURIComponent(str.replace(/\+/g, ' ')))

# string object [integer] -> void
writeCookie = (name, obj, days = 365) ->
  value = "myna-" + name + "=" + encodeCookieValue(obj)

  expires =
    if days
      date = new Date()
      date.setTime(date.getTime()+(days*24*60*60*1000))
      "; expires="+date.toGMTString()
    else
      ""

  path = "; path=/"

  document.cookie = "#{value}#{expires}#{path}"

  return

# string -> U(object, null)
readCookie = (name) ->
  nameEQ = "myna-" + name + "="

  isNameEQCookie = (cookie) ->
    i = cookie.indexOf(nameEQ)
    i >=0 and cookie.substring(0,i).match('^\\s*$')

  cookieValue = (cookie) ->
    i = cookie.indexOf(nameEQ)
    cookie.substring(i + nameEQ.length, cookie.length)

  cookies = document.cookie.split(';')
  for cookie in cookies when isNameEQCookie(cookie)
    if cookieValue(cookie)? then return decodeCookieValue(str)

  return null

# string -> void
removeCookie = (name) ->
  writeCookie(name, "", -1)
  return

# Top-level methods -----------------------------

# string -> object
Myna.cache.load = (key) =>
  if Myna.cache.localStorageSupported && Myna.cache.localStorageEnabled
    readLocalStorage(key)
  else
    readCookie(key)

# string object -> void
Myna.cache.save = (key, value) =>
  if Myna.cache.localStorageSupported && Myna.cache.localStorageEnabled
    writeLocalStorage(key, value)
  else
    writeCookie(key, value)
  return

# string object -> void
Myna.cache.remove = (key) =>
  if Myna.cache.localStorageSupported && Myna.cache.localStorageEnabled
    removeLocalStorage(key)
  else
    removeCookie(key)
  return
