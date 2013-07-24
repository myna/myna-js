'use strict'

class Path
  @identifierRegex: /^[a-z_$][a-z0-9_$]*/i
  @integerRegex: /^[0-9]+/
  @completeIdentifierRegex: /^[a-z_$][a-z0-9_$]*$/i

  constructor: (input) ->
    if typeof input == "string"
      @nodes = @parse(input)
    else
      @nodes = input

  # string -> arrayOf(or(string, integer))
  parse: (originalPath) =>
    path = originalPath

    skip = (num) ->
      if path.length < num
        throw "bad settings path: #{originalPath}"
      else
        path = path.substring(num)
      return

    take = (num) ->
      if path.length < num
        throw "bad settings path: #{originalPath}"
      else
        ans = path.substring(0, num)
        path = path.substring(num)
        ans

    takeString = (str) ->
      path = path.substring(str.length)
      str

    identifier = ->
      match = path.match(Path.identifierRegex)
      if match then takeString(match[0]) else throw "bad settings path: #{originalPath}"

    number = ->
      match = path.match Path.integerRegex
      if match then parseInt(takeString(match[0])) else throw "bad settings path: #{originalPath}"

    string = (quote) ->
      skip(1)
      ans = ""
      terminated = false
      while !terminated
        if path[0] == quote
          terminated = true
        else if path[0] == "\\"
          skip(1)
          ans += take(1)
        else
          ans += take(1)
      skip(1)
      ans

    indexField = ->
      skip(1)
      if path[0] == "'"
        ans = string("'")
      else if path[0] == '"'
        ans = string('"')
      else
        ans = number()
      skip(1)
      ans

    topLevel = ->
      ans = []
      while path.length > 0
        if path[0] == "."
          skip(1)
          ans.push identifier()
        else if path[0] == "["
          ans.push indexField()
        else
          ans.push identifier()
      ans

    path = Myna.trim(path)
    if path == ""
      []
    else if path[0] == "." || path[0] == "["
      topLevel()
    else
      path = ".#{path}"
      topLevel()

  quote: (str) =>
    str.replace /['\"\\]/g, (quote) -> "\\#{quote}"

  path: (nodes = @nodes) =>
    ans = ""
    for node in nodes
      if typeof node == "number"
        ans += "[#{node}]"
      else if Path.completeIdentifierRegex.test(node)
        ans += ".#{node}"
      else
        ans += "[\"#{@quote(node)}\"]"
    if ans[0] == "."
      ans.substring(1)
    else
      ans

  get: (data) =>
    for node in @nodes
      data = data?[node]
    data

  set: (data, value) =>
    if value?
      if @nodes.length == 0
        value
      else
        obj = data
        [ first..., last ] = @nodes
        for node in first
          unless typeof obj[node] == "object"
            obj[node] = {}
          obj = obj[node]
        obj[last] = value
        data
    else
      @unset(data)

  unset: (data) =>
    if @nodes.length == 0
      undefined
    else
      obj = data
      [ first..., last ] = @nodes
      for node in first
        unless obj[node]?
          return data
        obj = obj[node]
      delete obj[last]
      data

  prefixes: =>
    nodes = @nodes
    ans = []
    for n in [1..nodes.length]
      ans.push @path(nodes.slice(0, n))
    ans

  toString: =>
    @path()

class Myna.Settings extends Myna.Events
  @Path: Path

  @defaultSetOptions =
    silent: false

  constructor: (data = {}) ->
    super()
    @data = {}
    @set(data)

  get: (path, orElse = undefined) =>
    ans = new Myna.Settings.Path(path).get(@data) ? orElse
    Myna.log("Myna.Settings.get", path, orElse, ans)
    ans

  # Two possible method signatures:
  # updatesObject optionsObject -> Settings
  # pathString anyValue optionsObject -> Settings
  set: =>
    if arguments.length == 0
      throw [ "Myna.Settings.set", "not enough arguments", arguments ]

    if typeof arguments[0] == "object"
      updates = arguments[0]
      options = Myna.extend({}, Myna.Settings.defaultSetOptions, arguments[1] ? {})
      Myna.log("Myna.Settings.set", updates, options)

      paths = []
      for pathStr, value of updates
        path  = new Myna.Settings.Path(pathStr)
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
