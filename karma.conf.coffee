module.exports = (config) ->
  config.set
    basePath        : 'src'
    files           : [ 'test/**/*' ]
    reporters       : [ 'progress' ]
    colors          : true
    logLevel        : config.LOG_DEBUG
    browsers        : [ 'PhantomJS' ]
    frameworks      : [ 'browserify', 'jasmine' ]
    preprocessors   :
      '**/*'        : [ 'browserify' ]
    browserify      :
      debug         : true
      watch         : true
      extensions    : [ '.coffee' ]
      transform     : [ 'coffeeify', 'partialify' ]
