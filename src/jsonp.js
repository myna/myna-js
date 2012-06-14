/**
 * Myna Basic Javascript Client v0.1
 * Copyright 2011 Untyped Ltd
 */

// JSONP functions -----------------------------------------

// List of callback functions. Must be globally scoped
window.myna = { callbacks: [] };

var JsonP = {

  callbackCounter: 0,

  removeCallback: function(callbackName) {
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
    window.myna.callbacks[callbackName] = null;
  },

  doJsonP: function(options) {
    var callbackName = "callback" + (JsonP.callbackCounter++);
    window.myna.callbacks[callbackName] = function(args) { options.success.apply(this, arguments) };

    var url = options.url + "?";
    for(key in options.data) {
      value = options.data[key];

      url += key + "=" + value + "&";
    }
    url += "callback=window.myna.callbacks." + callbackName;

    //myna.log(LogLevel.DEBUG, "Sending JSON-P request to " + url);

    var elem = document.createElement("script");
    elem.setAttribute("type","text/javascript");
    // onreadystatechange is for IE, onload for everyone else
    elem.onload = elem.onreadystatechange =
      function(){ JsonP.removeCallback.call(elem, callbackName); };
    elem.setAttribute("src", url);
    document.getElementsByTagName("head")[0].appendChild(elem);
  }

}
