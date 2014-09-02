util = require '../util'
Path = require './path'

create = (updates) ->
  _setAll({}, updates)

# object string [any] -> any
get = (data, path, orElse = undefined) ->
  new Path(path).get(data) ? orElse

# object changes -> void
# object string any -> void
set = (data) ->
  if arguments.length < 2
    throw [ "settings.set", "not enough arguments", arguments ]

  if typeof arguments[1] == "object"
    _setAll(data, arguments[1])
  else
    _setOne(data, arguments[1], arguments[2])

_setAll = (data, updates) ->
  for path, value of updates
    data = _setOne(data, path, value)
  data

_setOne = (data, path, value) ->
  new Path(path).set(data, value)

unset = (data, path) ->
  new Path(path).unset(data)

flatten = (data) ->
  ans = []

  normalize = (path) ->
    if path[0] == "." then path.substring(1) else path

  visit = (value, path = "") ->
    if util.isArray(value)
      for i, v in value
        visit(v, path + "[" + i + "]")
    else if util.isObject(value)
      for k, v of value
        visit(v, path + "." + k)
    else
      ans.push([ normalize(path), value ])

  visit(@data)

  ans

paths = (data) ->
  _.map(flatten(data), (pair) -> pair[0])

  toJSON: (options = {}) =>
    @data

module.exports = {
  Path # for unit testing
  create
  get
  set
  unset
  flatten
  paths
}