# Code adapted from Quirksmode

encodeCookieValue = (obj) ->
  encodeURIComponent(JSON.stringify(obj))

decodeCookieValue = (str) ->
  if str.indexOf('"') == 0
    # This is a quoted cookie as according to RFC2068: unescape.
    JSON.parse(decodeURIComponent(str.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\')))
  else
    JSON.parse(decodeURIComponent(str))

# string object [integer] -> void
set = (name, obj, days = 365) ->
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
get = (name) ->
  nameEQ = "myna-" + name + "="
  isNameEQCookie = (cookie) ->
    i = cookie.indexOf(nameEQ)
    i >=0 and cookie.substring(0,i).match('^\\s*$')
  cookieValue = (cookie) ->
    i = cookie.indexOf(nameEQ)
    cookie.substring(i + nameEQ.length, cookie.length)

  cookies = document.cookie.split(';')
  for cookie in cookies when isNameEQCookie(cookie)
    if (str = cookieValue(cookie))?
      return decodeCookieValue(str)

  return null

# string -> void
remove = (name) ->
  set(name, "", -1)
  return

module.exports = {
  get
  set
  remove
}
