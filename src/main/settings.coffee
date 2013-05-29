'use strict'

class Path
  constructor: (next = null) ->
    @next = next

class Root extends Path
  constructor: (next) ->
    super(next)

  path: =>
    @next.path().substring(1)

  get: (data) =>
    @next.get(data)

  set: (data, value) =>
    if value?
      @next.set(data, value)
    else
      @next.unset(data)

  unset: (data) =>
    @next.unset(data)

  prefixes: =>
    @next.prefixes()

class Field extends Path
  constructor: (next, name) ->
    super(next)
    @name = name

  path: =>
    ".#{@name}#{@next.path()}"

  get: (data) =>
    @next.get(data?[@name])

  set: (data, value) =>
    # Clone data:
    ans = {}
    for k, v of data then ans[k] = v

    # Assign new property:
    ans[@name] = @next.set(ans[@name], value)
    ans

  unset: (data) =>
    # Clone data:
    ans = {}
    for k, v of data then ans[k] = v

    # Delete new property:
    modified = @next.unset(ans[@name])
    if @next.unset(ans[@name])?
      ans[@name] = modified
    else
      delete ans[@name]

    ans

  prefixes: =>
    [ @name, (for prefix in @next.prefixes() then "#{@name}.#{prefix}")... ]

class Nil extends Path
  constructor: () ->
    super(null)

  path: ->
    ""

  get: (data) ->
    data

  set: (data, value) ->
    value

  unset: (data) ->
    undefined

  prefixes: ->
    []

nil = new Nil()

class Settings
  constructor: (data = {}) ->
    @data = {}
    @set(data)

  @ast: { Root, Field, Nil, nil }

  @parse: (path) =>
    path = Myna.trim(path)
    memo = nil
    unless path == ""
      for name in path.split(".") by -1
        memo = new Field(memo, name)
    new Root(memo)

  get: (path, orElse = null) =>
    Settings.parse(path).get(@data) ? orElse

  set: =>
    switch arguments.length
      when 0
        throw [ "Settings.set", "not enough arguments", arguments ]
      when 1
        for key, value of arguments[0]
          @data = Settings.parse(key).set(@data, value)
      else
        key = arguments[0]
        value = arguments[1]
        @data = Settings.parse(key).set(@data, value)
    this

  unset: (path) =>
    @data = Settings.parse(path).unset(@data)
    this

  toJson: =>
    @data

Myna.Settings = Settings