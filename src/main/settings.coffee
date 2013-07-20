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

class Myna.Settings extends Myna.Events
  constructor: (data = {}) ->
    super()
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

  get: (path, orElse = undefined) =>
    ans = Settings.parse(path).get(@data) ? orElse
    Myna.log("Myna.Settings.get", path, orElse, ans)
    ans

  @defaultSetOptions =
    silent: false

  # Two possible method signatures:
  # updatesObject optionsObject -> Settings
  # pathString anyValue optionsObject -> Settings
  set: =>
    if arguments.length == 0
      throw [ "Settings.set", "not enough arguments", arguments ]

    if typeof arguments[0] == "object"
      updates = arguments[0]
      options = Myna.extend({}, Settings.defaultSetOptions, arguments[1] ? {})
      Myna.log("Myna.Settings.set", updates, options)

      paths = []
      for pathStr, value of updates
        path  = Settings.parse(pathStr)
        @data = path.set(@data, value)
        paths.push(path)

      unless options.silent
        @triggerChange(paths)
    else
      updates = {}
      updates[arguments[0]] = arguments[1]
      options = arguments[2]
      @set(updates, options)

    this

  unset: (path, options) =>
    updates = {}
    updates[path] = undefined
    @set(updates, options)

  pathValuePairs: =>
    ans = []

    normalize = (path) ->
      if path[0] == "." then path.substring(1) else path

    visit = (value, path = "") ->
      if Myna.isArray(value)
        for i, v in value
          visit(v, path + "[" + i + "]")
      else if Myna.isObject(value)
        for k, v of value
          visit(v, path + "." + k)
      else
        ans.push({ path: normalize(path), value })

    visit(@data)

    Myna.log("Myna.Settings.pathValuePairs", ans)

    ans

  paths: =>
    _.map(@pathValuePairs(), (pvp) -> pvp.path)

  triggerChange: (paths) =>
    Myna.log("Myna.Settings.triggerChange", paths, @data, @_events)
    for path in paths
      for prefix in path.prefixes()
        @trigger("change:#{prefix}", @get(prefix))
    @trigger("change")

  toJSON: (options = {}) =>
    @data
