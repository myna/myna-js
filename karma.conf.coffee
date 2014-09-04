module.exports = (config) ->
  config.set
    basePath        : 'temp'
    files           : [ 'myna-spec.js' ]
    reporters       : [ 'progress' ]
    colors          : true
    logLevel        : config.LOG_DEBUG
    browsers        : [ 'PhantomJS' ]
    frameworks      : [ 'jasmine' ]
