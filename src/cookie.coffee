# Cookie code adapted from quirksmode.org

Cookie =
  createCookie: (name, value, days) ->
    expires =
      if days
        date = new Date()
        date.setTime(date.getTime()+(days*24*60*60*1000))
        "; expires="+date.toGMTString()
      else
        ""
    document.cookie = "#{name}=#{value+expires}; path=/"

  readCookie: (name) ->
    nameEQ = name + "="
    isNameEQCookie = (cookie) ->
      i = cookie.indexOf(nameEQ)
      i >=0 and cookie.substring(0,i).match('\s*')
    cookieValue = (cookie) ->
      i = cookie.indexOf(nameEQ)
      cookie.substring(i + nameEQ.length, str.length)
    cookies = document.cookie.split(';')
    cookieValue(cookie) for cookie in cookies when isNameEQCookie(cookie)

  eraseCookie: (name) ->
    createCookie(name, "", -1)
