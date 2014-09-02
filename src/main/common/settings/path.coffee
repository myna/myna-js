util = require '../util'

module.exports = class Path
  @identifierRegex: /^[a-z_$][a-z0-9_$]*/i
  @integerRegex: /^[0-9]+/
  @completeIdentifierRegex: /^[a-z_$][a-z0-9_$]*$/i
  @permissiveIdentifierRegex: /^[^[.]+/

  constructor: (input) ->
    if typeof input == "string"
      @nodes = Path.parse(input)
    else
      @nodes = input

  # string -> boolean
  @isValid: (path) =>
    try
      Path.parse(path)
      true
    catch exn
      false

  # string -> string
  @normalize: (path) =>
    try
      new Path(path).toString()
    catch exn
      path

  # string -> arrayOf(or(string, integer))
  @parse: (originalPath) =>
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
      match = path.match(Path.permissiveIdentifierRegex)
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

    path = util.trim(path)
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

  isPrefixOf: (path) =>
    a = this.nodes
    b = path.nodes

    if a.length > b.length
      return false

    for num in [0...a.length]
      unless a[num] == b[num]
        return false

    true

  take: (num) =>
    new Path _.take @nodes, num

  drop: (num) =>
    new Path _.drop @nodes, num

  toString: =>
    @path()
