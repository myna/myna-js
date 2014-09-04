DefaultClient  = require './client/default'
bootstrap      = require './bootstrap'

###
Myna client library
===================

This is the main entry point for `myna.js`, a Myna library
for use by Javascript developers. The contents of this file
are exported by Browserify as the global variable `Myna`.

Getting started
---------------

Use one of the following methods to initialise a Myna client:

    # Create a Myna client from a remote deployment configuration URL. For example:
    #
    #     http://deploy.mynaweb.com/<deploymentUuid>/myna.json
    #
    # NOTE that the file extension is `.json` (the raw deployment configuration),
    # not `.js` (a script packaging a pre-configured Myna client with the deployment).
    Myna.initRemote(url, [timeout]) -> promiseOf(client)

    # Create a Myna client from a local deployment configuration:
    Myna.initLocal(deploymentJson) -> promiseOf(client)

Running experiments
-------------------

Once you have a client, use the following methods to suggest/view/reward experiments:

    # Ask for a suggestion for `experimentId`.
    # Myna will:
    #  - select a variant;
    #  - behave correctly if the variant is marked as `sticky`;
    #  - record a view event if appropriate;
    #  - record a view event on Google Analytics if enabled/appropriate;
    #  - cache the view event if there is no network connection,
    #    and resubmit it on next call to suggest/view/reward.
    #
    # The user is responsible for setting the page up according to the
    # variant's settings.
    client.suggest(experimentId) -> promiseOf(variant)

    # Ask Myna to view the specified variant of `experimentId`.
    # Myna will do all the tasks listed above for `suggest()`.
    #
    # The user is responsible for setting the page up according to the
    # variant's settings.
    client.view(experimentId) -> promiseOf(variant)

    # Ask Myna to reward the last variant returned by `suggest()` or `view()`.
    # Myna will:
    #  - record a view event if appropriate;
    #  - record a view event on Google Analytics if enabled/appropriate;
    #  - cache the view event if there is no network connection,
    #    and resubmit it on next call to suggest/view/reward.
    client.view(experimentId, [rewardAmountFrom0To1]) -> promiseOf(variant)

    # Clear any cached information for `experimentId`, including
    # any previously viewed and/or sticky variants.
    client.clear(experimentId) -> promiseOf(null)
###

module.exports = bootstrap.create (experiment, settings) ->
  new DefaultClient(experiment, settings)
