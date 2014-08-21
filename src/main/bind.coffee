$    = require 'jquery'
log  = require './log'
hash = require './hash'

class Binder
  constructor: (client) ->
    log.debug("Binder.constructor", client)

    @client = client

    @boundHandlers = []

  # Detect experiments and suggest variants.
  #
  # Pass options.all == true to suggest variants for all experiments,
  # regardless of whether or not they appear on the page.
  init: (options = {}) =>
    for id, expt of @client.experiments
      if options.all || @detect(expt)
        @listenTo(expt)
        variantId = hash.params[expt.id]
        if variantId && expt.variants[variantId]
          expt.view(variantId)
        else
          expt.suggest()
    return

  listenTo: (expt) =>
    log.debug("Binder.listenTo", expt)
    expt.on 'view', (variant) => @bind(expt, variant)

  # experiment -> boolean
  detect: (expt) =>
    cssClass = expt.settings.get("myna.html.cssClass") ? "myna-#{expt.id}"
    $(".#{cssClass}").length > 0

  bind: (expt, variant) =>
    log.debug("Binder.bind", expt)

    @unbind()

    cssClass = expt.settings.get("myna.html.cssClass") ? "myna-#{expt.id}"

    dataPrefix = expt.settings.get("myna.html.dataPrefix") ? null
    dataShow     = if dataPrefix then "#{@dataPrefix}-show" else "show"
    dataHide     = if dataPrefix then "#{@dataPrefix}-hide" else "hide"
    dataBind     = if dataPrefix then "#{@dataPrefix}-bind" else "bind"
    dataGoal     = if dataPrefix then "#{@dataPrefix}-goal" else "goal"
    dataRedirect = if dataPrefix then "#{@dataPrefix}-redirect" else "redirect"

    log.debug("Binder.bind", "searchParams", cssClass, dataShow, dataHide, dataBind, dataGoal)

    allElems      = if cssClass then $(".#{cssClass}") else null
    showElems     = if cssClass then allElems.filter("[data-#{dataShow}]") else $("[data-#{dataShow}]")
    hideElems     = if cssClass then allElems.filter("[data-#{dataHide}]") else $("[data-#{dataHide}]")
    bindElems     = if cssClass then allElems.filter("[data-#{dataBind}]") else $("[data-#{dataBind}]")
    redirectElems = if cssClass then allElems.filter("[data-#{dataRedirect}]") else $("[data-#{dataRedirect}]")
    goalElems     = if cssClass then allElems.filter("[data-#{dataGoal}]") else $("[data-#{dataGoal}]")


    log.debug("Binder.bind", "elements", allElems, showElems, hideElems, bindElems, goalElems)

    showElems.each (index, elem) => @bindShow(expt, variant, dataShow, elem)
    hideElems.each (index, elem) => @bindHide(expt, variant, dataHide, elem)
    bindElems.each (index, elem) => @bindBind(expt, variant, dataBind, elem)
    redirectElems.each (index, elem) => @bindRedirect(expt, variant, dataRedirect, elem)
    goalElems.each (index, elem) => @bindGoal(expt, variant, dataGoal, elem)

  unbind: =>
    log.debug("Binder.unbind", @boundHandlers)
    for [ elem, event, handler ] in @boundHandlers
      log.debug("Binder.unbind", elem, event, handler)
      $(elem).off(event, handler)

  bindShow: (expt, variant, dataAttr, elem) =>
    log.debug("Binder.bindShow", expt, dataAttr, elem)

    self = $(elem)
    path = self.data(dataAttr)

    if variant.id == path || variant.settings.get(path) then self.show() else self.hide()

  bindHide: (expt, variant, dataAttr, elem) =>
    log.debug("Binder.bindHide", expt, dataAttr, elem)

    self = $(elem)
    path = self.data(dataAttr)

    if variant.id == path || variant.settings.get(path) then self.hide() else self.show()

  bindBind: (expt, variant, dataAttr, elem) =>
    log.debug("Binder.bindBind", expt, dataAttr, elem)

    self = $(elem)
    attrString = self.data(dataAttr)
    [ lhs, rhs ] = attrString.split("=")

    rhsValue =
      switch rhs
        when "id"
          variant.id
        when "name", "", null, undefined
          variant.name
        else
          variant.settings.get(rhs, "")

    unless lhs then return

    switch lhs
      when "text"  then self.text(rhsValue)
      when "html"  then self.html(rhsValue)
      when "class" then self.addClass(rhsValue)
      else
        if lhs[0] == "@"
          self.attr(lhs.substring(1), rhsValue)

  bindRedirect: (expt, variant, dataAttr, elem) =>
    log.debug("Binder.bindRedirect", expt, dataAttr, elem)

    attr = elem.data(dataAttr)

    dest =
      switch attr
        when "id"
          variant.id
        when "name"
          variant.name
        else
          variant.settings.get(attr, false)

    if dest
      window.location.replace(dest)

  bindGoal: (expt, variant, dataAttr, elem) =>
    log.debug("Binder.bindGoal", expt, dataAttr, elem)

    self  = $(elem)
    event = self.data(dataAttr)

    unless event then return

    switch event
      when "load"
        $(=> expt.reward())
      when "click"
        handler = @createClickHandler(expt)
        @boundHandlers.push([elem, "click", handler])
        log.debug("Binder.bindGoal", "attach", elem, "click", handler, @boundHandlers )
        self.on("click", handler)

  # (event any ... -> void) -> (event any ... -> void)
  createClickHandler: (expt, innerHandler = (->)) =>
    log.debug("Binder.createClickHandler", expt, innerHandler)

    handler = (evt, args...) ->
      log.debug("Binder.clickHandler", evt, args...)

      elem = this
      self = $(elem)

      rewarded = expt.loadStickyReward() || expt.loadLastReward()

      if rewarded?
        log.debug("Binder.clickHandler", "pass-through")

        innerHandler.call(this, evt, args...)
      else
        log.debug("Binder.clickHandler", "pass-through")

        evt.stopPropagation()
        evt.preventDefault()

        complete = ->
          if elem[evt.type]
            window.setTimeout( (-> elem[evt.type]()), 0 )
          else
            self.trigger(evt.type)
          return

        expt.reward(1.0, complete, complete)
      return

module.exports = Binder