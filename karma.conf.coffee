module.exports = (config) ->
  config.set
    basePath        : 'temp/test'
    files           : [ '**/*.js' ]
    reporters       : [ 'progress' ]
    colors          : true
    logLevel        : config.LOG_DEBUG
    browsers        : [ 'PhantomJS' ]
    frameworks      : [ 'jasmine' ]
