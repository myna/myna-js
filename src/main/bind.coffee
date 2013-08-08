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
        expt.suggest()

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
    dataShow = if dataPrefix then "#{@dataPrefix}-show" else "show"
    dataBind = if dataPrefix then "#{@dataPrefix}-bind" else "bind"
    dataGoal = if dataPrefix then "#{@dataPrefix}-goal" else "goal"

    Myna.log("Myna.Binder.bind", "searchParams", cssClass, dataShow, dataBind, dataGoal)

    allElems  = if cssClass then Myna.$(".#{cssClass}") else null
    showElems = if cssClass then allElems.filter("[data-#{dataShow}]") else Myna.$("[data-#{dataShow}]")
    bindElems = if cssClass then allElems.filter("[data-#{dataBind}]") else Myna.$("[data-#{dataBind}]")
    goalElems = if cssClass then allElems.filter("[data-#{dataGoal}]") else Myna.$("[data-#{dataGoal}]")

    Myna.log("Myna.Binder.bind", "elements", allElems, showElems, bindElems, goalElems)

    showElems.each (index, elem) => @bindShow(expt, variant, dataShow, elem)
    bindElems.each (index, elem) => @bindBind(expt, variant, dataBind, elem)
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

    if variant.id == path || variant.settings.get(path)
      self.show()
    else
      self.hide()

  bindBind: (expt, variant, dataAttr, elem) =>
    Myna.log("Myna.Binder.bindBind", expt, dataAttr, elem)

    self = Myna.$(elem)
    attrString = self.data(dataAttr)
    [ lhs, rhs ] = attrString.split("=")

    rhsValue = if rhs then variant.settings.get(rhs, "") else variant.id

    unless lhs then return

    switch lhs
      when "text"    then self.text(rhsValue)
      when "html"    then self.html(rhsValue)
      when "class"   then self.addClass(rhsValue)
      else
        if lhs[0] == "@"
          self.attr(lhs.substring(1), rhsValue)

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
