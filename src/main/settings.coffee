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
    @next.set(data, value)

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

class Nil extends Path
  constructor: () ->
    super(null)

  path: ->
    ""

  get: (data) ->
    data

  set: (data, value) ->
    value

nil = new Nil()

class Myna.Settings
  constructor: (data = {}) ->
    @data = {}
    @set(data)

  get: (path, orElse = null) =>
    ans = @parse(path).get(@data) ? orElse
    Myna.log("Myna.Settings.get", path, ans)
    ans


  set: =>
    switch arguments.length
      when 2
        key = arguments[0]
        value = arguments[1]
        Myna.log("Myna.Settings.set", key, value)
        @data = @parse(key).set(@data, value)
      when 1
        for key, value of arguments[0]
          Myna.log("Myna.Settings.set", key, value)
          @data = @parse(key).set(@data, value)
      else
        throw ["wrong number of arguments", arguments]
    this

  parse: (path) =>
    memo = nil
    for name in path.split(".") by -1
      memo = new Field(memo, name)
    new Root(memo)

  toJson: =>
    @data

Myna.cache = new Myna.Settings
