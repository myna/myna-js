class Myna.Binder
  constructor: (client) ->
    Myna.log("Myna.Binder.constructor", client)

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
        variantId = Myna.hashParams[expt.id]
        if variantId && expt.variants[variantId]
          expt.view(variantId)
        else
          expt.suggest()
    return

  listenTo: (expt) =>
    Myna.log("Myna.Binder.listenTo", expt)
    expt.on 'view', (variant) => @bind(expt, variant)

  # experiment -> boolean
  detect: (expt) =>
    cssClass = expt.settings.get("myna.html.cssClass") ? "myna-#{expt.id}"
    Myna.$(".#{cssClass}").length > 0

  bind: (expt, variant) =>
    Myna.log("Myna.Binder.bind", expt)

    @unbind()

    cssClass = expt.settings.get("myna.html.cssClass") ? "myna-#{expt.id}"

    dataPrefix = expt.settings.get("myna.html.dataPrefix") ? null
    dataShow     = if dataPrefix then "#{@dataPrefix}-show" else "show"
    dataHide     = if dataPrefix then "#{@dataPrefix}-hide" else "hide"
    dataBind     = if dataPrefix then "#{@dataPrefix}-bind" else "bind"
    dataGoal     = if dataPrefix then "#{@dataPrefix}-goal" else "goal"
    dataRedirect = if dataPrefix then "#{@dataPrefix}-redirect" else "redirect"

    Myna.log("Myna.Binder.bind", "searchParams", cssClass, dataShow, dataHide, dataBind, dataGoal)

    allElems      = if cssClass then Myna.$(".#{cssClass}") else null
    showElems     = if cssClass then allElems.filter("[data-#{dataShow}]") else Myna.$("[data-#{dataShow}]")
    hideElems     = if cssClass then allElems.filter("[data-#{dataHide}]") else Myna.$("[data-#{dataHide}]")
    bindElems     = if cssClass then allElems.filter("[data-#{dataBind}]") else Myna.$("[data-#{dataBind}]")
    redirectElems = if cssClass then allElems.filter("[data-#{dataRedirect}]") else Myna.$("[data-#{dataRedirect}]")
    goalElems     = if cssClass then allElems.filter("[data-#{dataGoal}]") else Myna.$("[data-#{dataGoal}]")


    Myna.log("Myna.Binder.bind", "elements", allElems, showElems, hideElems, bindElems, goalElems)

    showElems.each (index, elem) => @bindShow(expt, variant, dataShow, elem)
    hideElems.each (index, elem) => @bindHide(expt, variant, dataHide, elem)
    bindElems.each (index, elem) => @bindBind(expt, variant, dataBind, elem)
    redirectElems.each (index, elem) => @bindRedirect(expt, variant, dataRedirect, elem)
    goalElems.each (index, elem) => @bindGoal(expt, variant, dataGoal, elem)

  unbind: =>
    Myna.log("Myna.Binder.unbind", @boundHandlers)
    for [ elem, event, handler ] in @boundHandlers
      Myna.log("Myna.Binder.unbind", elem, event, handler)
      Myna.$(elem).off(event, handler)

  bindShow: (expt, variant, dataAttr, elem) =>
    Myna.log("Myna.Binder.bindShow", expt, dataAttr, elem)

    self = Myna.$(elem)
    path = self.data(dataAttr)

    if variant.id == path || variant.settings.get(path) then self.show() else self.hide()

  bindHide: (expt, variant, dataAttr, elem) =>
    Myna.log("Myna.Binder.bindHide", expt, dataAttr, elem)

    self = Myna.$(elem)
    path = self.data(dataAttr)

    if variant.id == path || variant.settings.get(path) then self.hide() else self.show()

  bindBind: (expt, variant, dataAttr, elem) =>
    Myna.log("Myna.Binder.bindBind", expt, dataAttr, elem)

    self = Myna.$(elem)
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
    Myna.log("Myna.Binder.bindRedirect", expt, dataAttr, elem)

    self = Myna.$(elem)
    attr = self.data(dataAttr)

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
    Myna.log("Myna.Binder.bindGoal", expt, dataAttr, elem)

    self  = Myna.$(elem)
    event = self.data(dataAttr)

    unless event then return

    switch event
      when "load"
        Myna.$(=> expt.reward())
      when "click"
        handler = @createClickHandler(expt)
        @boundHandlers.push([elem, "click", handler])
        Myna.log("Myna.Binder.bindGoal", "attach", elem, "click", handler, @boundHandlers )
        self.on("click", handler)

  # (event any ... -> void) -> (event any ... -> void)
  createClickHandler: (expt, innerHandler = (->)) =>
    Myna.log("Myna.Binder.createClickHandler", expt, innerHandler)

    handler = (evt, args...) ->
      Myna.log("Myna.Binder.clickHandler", evt, args...)

      elem = this
      self = Myna.$(elem)

      rewarded = expt.loadStickyReward() || expt.loadLastReward()

      if rewarded?
        Myna.log("Myna.Binder.clickHandler", "pass-through")

        innerHandler.call(this, evt, args...)
      else
        Myna.log("Myna.Binder.clickHandler", "pass-through")

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
