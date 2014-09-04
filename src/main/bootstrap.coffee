log   = require './common/log'
hash  = require './common/hash'
jsonp = require './common/jsonp'

# clientConstructor -> { init: localInit, initRemote: remoteInit }
#
# where clientConstructor : arrayOf(experiment) settings -> client
#       localInit         : deployment -> client
#       remoteInit        : string [number] -> promiseOf(client)
create = (createClient) ->
  init       = createLocalInit(createClient)
  initRemote = createRemoteInit(init)
  { init, initRemote }

# clientConstructor -> localInit
createLocalInit = (createClient) ->
  (deployment) ->
    if hash.params.debug? then log.enabled = true

    log.debug("myna.initLocal", deployment)

    unless deployment.typename == "deployment"
      log.error(
        "myna.initLocal"
        """
        Myna needs a deployment to initialise. The given JSON is not a deployment.
        It has a typename of "#{typename}". Check you are initialising Myna with the
        correct UUID if you are calling initRemote
        """
        deployment
      )

    experiments = deployment.experiments

    apiKey      = deployment.apiKey  ? log.error("myna.init", "no apiKey in deployment", deployment)
    apiRoot     = deployment.apiRoot ? "//api.mynaweb.com"
    settings    = util.extends(deployment.settings, { apiKey, apiRoot })

    createClient(experiments, settings)

# localInit -> remoteInit
createRemoteInit = (localInit) ->
  (url, timeout = 0) ->
    log.debug("myna.initRemote", url, timeout)
    jsonp.request(url, {}, timeout).then(localInit)

module.exports = {
  create
  createLocalInit
  createRemoteInit
}
