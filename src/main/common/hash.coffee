log = require './log'

parse = (hash) ->
  hash = if !hash then "" else if hash[0] == "#" then hash.substring(1) else hash

  ans = {}
  for part in hash.split("&") when part != ""
    [ lhs, rhs ] = part.split("=")
    ans[decodeURIComponent(lhs)] = decodeURIComponent(rhs ? lhs)

  log.debug("hash.parse", ans)

  ans

params = parse(window.location.hash)

module.exports = {
  parse
  params
}
