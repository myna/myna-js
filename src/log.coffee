LogLevel =
  SILENT: 0
  ERROR: 1
  WARN: 2
  INFO: 3
  DEBUG: 4

class Log
  constructor: (@loglevel) ->

  log: (level, message) ->
    if window.console and @loglevel >= level
      window.console.log(message)
