DefaultClient = require './default'
ui            = require '../engine/myna-ui'

module.exports = class MynaUiClient extends DefaultClient
  # arrayOf(experiment) settings -> AutoClient
  constructor: (experiments = [], settings = {}) ->
    super(experiments, settings)

    # When Myna UI applies a set of changes to a page, it returns an
    # undo() function that we can use to restore the page to normal.
    #
    # We cache these functions here so we can switch variants on the
    # fly without re-rendering the page.
    #
    # Note: Be careful when using this functionality. It assumes
    # that the page remains more or less static between calls to suggest/view.
    #
    # objectOf(experimentId, (-> void))
    @_undoFuncs  = {}
    @_changesKey = "myna.web.changes"

  # string -> promiseOf(variant)
  suggest: (exptId) =>
    super(expt).then (variant) ->
      @_apply(exptId, variant)

  # string or(string, variant) -> promiseOf(variant)
  view: (exptId, variantOrId) =>
    super(expt, variantOrId).then (variant) ->
      @_apply(exptId, variant)

  # Apply Myna UI changes to the current page for `expt` and `variant`.
  #
  # If `expt` doesn't use Myna UI, do nothing.
  #
  # variant -> variant
  _apply: (exptId, variant) ->
    changes = settings.get(variant.settings, @_changesKey, [])
    # Undo previous changes (if applicable):
    @_undoFuncs[exptId]?()
    # Apply new changes to the page
    @_undoFuncs[exptId] = ui.apply changes, =>
      @reward(exptId, variant)
    variant
