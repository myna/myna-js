/**
 * @preseerve Myna Basic Javascript Client v0.1
 * Copyright 2011 Untyped Ltd
 */

/*
 * Example usage:
 *
 * var myna = Myna(agentUUID, [options])
 * myna.suggest(success, [error])
 */
function Myna(agent, options) {

  /** @const */
  var defaults = {
    // number (lifespan of the cookie in days from now)
    cookieLifespan: 365,
    // string
    cookieName: "myna" + agent,
    // natural (ms)
    timeout: 1000,
    // string (url)
    baseurl: "http://api.mynaweb.com",
    // natural: 0 = silent, 1 = error, 2 = warn, 3 = info, 4 = debug
    loglevel: 1
  };

  /** @enum {number} */
  var LogLevel = {
    SILENT: 0,
    ERROR: 1,
    WARN: 2,
    INFO: 3,
    DEBUG: 4
  };

  // Utilities -------------------------------------------

  function extend(dest, src) {
    for(name in src) {
      if(src[name] && !dest[name]) {
        dest[name] = src[name];
      }
    }
    return dest;
  }

  function removeCallback(callbackName) {
    if(this.readyState &&
       this.readyState !== "complete" &&
       this.readyState !== "loaded") {
      return;
    }

    // Prevent memory leaks
    this.onload = null;
    try {
      this.parentNode.removeChild(this);
    } catch (e) {}
    Myna.callbacks[callbackName] = null;
  }

  var callbackCounter = 0;
  Myna.callbacks = []
  function doJsonP(options) {
    var callbackName = "callback" + (callbackCounter++);
    Myna.callbacks[callbackName] = function(args) { options.success.apply(this, arguments) };

    var url = options.url + "?";
    for(key in options.data) {
      value = options.data[key];

      url += key + "=" + value + "&";
    }
    url += "callback=Myna.callbacks." + callbackName;

    myna.log(LogLevel.DEBUG, "Sending JSON-P request to " + url);

  var elem = document.createElement("script");
  elem.setAttribute("type","text/javascript");
    // onreadystatechange is for IE, onload for everyone else
  elem.onload = elem.onreadystatechange =
      function(){ removeCallback.call(elem, callbackName); };
  elem.setAttribute("src", url);
  document.getElementsByTagName("head")[0].appendChild(elem);
  }

  /** @type { function(string): Object.<string> } **/
  function parseSuggestResponse(content) {
    return { token: content.token, choice: content.choice };
  }

  /** @type { function(string): Object.<number, string> } **/
  function parseErrorResponse(content) {
    var parts = content.split(/[\r\n]+/);
    var code = parseInt(parts[0].replace(/ERROR: /, ""));
    var message = parts[1];
    return { code: code, message: message };
  }

  // Cookie code from quirksmode.org

  function createCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else var expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
  }

  function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
  }

  function eraseCookie(name) {
  createCookie(name,"",-1);
  }


  // Myna client -----------------------------------------

  // The object we return
  var myna  = {}
  myna.options = extend(extend({}, defaults), options);
  myna.agent = agent;

  /** @type { function(number, string) } */
  myna.log = function(level, message) {
    if (window.console && myna.options.loglevel >= level) {
      window.console.log(message);
    }
  }

  /** @type { ?string } */
  myna.token = null;

  /**
   * @type {
   *   function(string,
   *      Object.<string>,
   *      function(string, string, Object),
   *      function(Object, string, string),
   *      Object)
   * }
   */
  myna.doAjax = function(path, data, success, error) {
    myna.log(LogLevel.DEBUG, "myna.doAjax called");

    var ajaxOptions = extend(extend({}, myna.options), {
      url: myna.options.baseurl + path,
      data: data,
      success: success,
      error: error
    });

    myna.log(LogLevel.DEBUG, ajaxOptions);

    doJsonP(ajaxOptions);
  }

  /** @type { function(string, function(string), ?function(number, string)) } */
  myna.suggest = function(success, error) {
    myna.log(LogLevel.DEBUG, "myna.suggest called");

    var data = { agent: myna.agent };

    // object string xhr -> void
    function successWrapper(data, msg, xhr) {
      myna.log(LogLevel.DEBUG, "myna.suggest successWrapper called");
      myna.log(LogLevel.DEBUG, data);

      if(data.typename === "suggestion") {
        var response = parseSuggestResponse(data);
        myna.log(LogLevel.INFO, "Myna suggested " + response.suggestion);

        myna.log(LogLevel.DEBUG, "Response token stored " + response.token);
        myna.token = response.token;

        if(success) {
          success(response);
        } else {
          myna.log(LogLevel.WARN, "You should pass a success function to myna.suggest. See the docs for details.");
        }
      } else if(data.typename === "mynaapierror") {
        myna.log(LogLevel.ERROR, "Myna.suggest returned an API error: " + data.code + " " + data.message);

        if(error) {
          error(data.code, data.message);
        }
      } else {
        myna.log(LogLevel.ERROR, "Myna.suggest did something unexpected");
        myna.log(LogLevel.ERROR, data);
        if(error) {
          error(400, "The Myna client didn't handle this data: " + data);
        }
      }
    }

      // xhr string string -> void
      function errorWrapper(xhr, text, error) {
        myna.log(LogLevel.DEBUG, "myna.suggest errorWrapper called");

        var response = parseErrorResponse(xhr.responseText);
        myna.log(LogLevel.ERROR, xhr);
        myna.log(LogLevel.ERROR, text);
        myna.log(LogLevel.ERROR, error);
        myna.log(LogLevel.ERROR, response);
        myna.log(LogLevel.ERROR, "myna.suggest failed: error " + response.code + " " + response.message);

        if(error) {
          error(response.code, response.message);
        }
      }

    myna.doAjax("/suggest", data, successWrapper, errorWrapper);
  };

  /** @type { function(number, function(), ?function(number, string)) } */
  myna.reward = function(amount, success, error) {
    myna.log(LogLevel.DEBUG, "myna.reward called");

    // If this function is used directly as an event handler,
    // the first argument will be an event object.
    // In this case amount, success, and error will actually be undefined.
    if(typeof(amount) == "object" && amount.target) {
      myna.log(LogLevel.WARN, "You used myna.reward directly as an event handler, which is strictly speaking bad.");
      myna.log(LogLevel.WARN, "To suppress this message, wrap the call to myna.reward in an anonymous function, e.g.:");
      myna.log(LogLevel.WARN, "  $(\"foo\").click(function() { myna.reward(); });");
      amount = null;
      success = null;
      error = null;
    }

    if(!myna.token) {
      myna.log(LogLevel.ERROR, "You must call suggest before you call reward.");
      return;
    }

    var data = {
      agent: agent,
      token: myna.token,
      amount: amount || 1.0
    };

    // string string xhr -> void
    function successWrapper(data, msg, xhr) {
      myna.log(LogLevel.DEBUG, "myna.reward successWrapper called");

      myna.token = null;
      myna.log(LogLevel.INFO, "myna.reward succeeded");

      if(success) {
        success();
      }
    }

    // xhr string string -> void
    function errorWrapper(xhr, text, error) {
      myna.log(LogLevel.DEBUG, "myna.reward errorWrapper called");

      var response = parseErrorResponse(xhr.responseText);
      myna.log(LogLevel.ERROR, "myna.reward failed: error " + response.code + " " + response.message);

      if(error) {
        error(response.code, response.message);
      }
    }

    myna.doAjax("/reward", data, successWrapper, errorWrapper);
  };

  myna.saveToken = function(token) {
    myna.log(LogLevel.DEBUG, "myna.saveToken called with token" + token);
    token = token || myna.token;

    if(token) {
      createCookie(myna.options.cookieName, token, myna.options.cookieLifespan);
    } else {
      myan.log(LogLevel.WARN, "myna.saveToken called with empty token and myna.token also empty");
    }
  }

  myna.loadToken = function() {
    var token = readCookie(myna.options.cookieName);

    if (!token) {
      myna.log(LogLevel.WARN, "myna.loadToken loaded empty token");
    }
  }

  myna.clearToken = function() {
    clearCookie(myna.options.cookieName);
  }

  return myna;
};
