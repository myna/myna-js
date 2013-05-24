class Myna.Binder
  constructor: (options = {}) ->
    @boundHandlers = []

  bind: (expt, variant, options = {}) =>
    Myna.log("Myna.Binder.bind", expt, options)

    @unbind()

    cssClass = expt.settings.get("myna.html.cssClass") ? "myna-#{expt.id}"

    dataPrefix = expt.settings.get("myna.html.dataPrefix") ? null
    dataShow = if dataPrefix then "#{@dataPrefix}-show" else "show"
    dataBind = if dataPrefix then "#{@dataPrefix}-bind" else "bind"
    dataGoal = if dataPrefix then "#{@dataPrefix}-goal" else "goal"

    Myna.log("Myna.Binder.bind", "searchParams", cssClass, dataShow, dataBind, dataGoal)

    allElems  = if cssClass then Myna.$(".#{cssClass}") else null
    showElems = if cssClass then allElems.filter("[data-#{dataShow}]") else $("[data-#{dataShow}]")
    bindElems = if cssClass then allElems.filter("[data-#{dataBind}]") else $("[data-#{dataBind}]")
    goalElems = if cssClass then allElems.filter("[data-#{dataGoal}]") else $("[data-#{dataGoal}]")

    Myna.log("Myna.Binder.bind", "elements", allElems, showElems, bindElems, goalElems)

    bindShow = options.show ? true
    bindBind = options.bind ? true
    bindGoal = options.goal ? true

    if bindShow then showElems.each (index, elem) => @bindShow(expt, variant, dataShow, elem)
    if bindBind then bindElems.each (index, elem) => @bindBind(expt, variant, dataBind, elem)
    if bindGoal then goalElems.each (index, elem) => @bindGoal(expt, variant, dataGoal, elem)

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
    [ lhs, rhs ] = attrString.split("=")

    unless lhs && rhs then return

    switch lhs
      when "text"  then self.text(variant.settings.get(rhs) ? "")
      when "html"  then self.html(variant.settings.get(rhs) ? "")
      when "class" then self.addClass(variant.settings.get(rhs) ? "")
      else
        if lhs[0] == "@"
          self.attr(lsh.substring(1), variant.settings.get(rhs) ? "")

  bindGoal: (expt, variant, dataAttr, elem) =>
    Myna.log("Myna.Binder.bindGoal", expt, dataAttr, elem)

    self  = Myna.$(elem)
    event = self.data(dataAttr)

    unless event then return

    switch event
      when "load"
        $(=> expt.reward())
      when "click"
        handler = @createClickHandler(expt)
        @boundHandlers.push([elem, "click", handler])
        Myna.log("Myna.Binder.bindGoal", "attach", elem, "click", handler, @boundHandlers )
        self.on("click", handler)

  # (event any ... -> void) -> (event any ... -> void)
  createClickHandler: (expt, innerHandler = (->)) =>
    Myna.log("Myna.Binder.createClickHandler", expt, innerHandler)

    handler = (evt, args...) ->
      myna.log("Myna.Binder.clickHandler", evt, args...)

      elem = this
      self = $(elem)

      rewarded = expt.loadStickyReward() || expt.loadLastReward()

      if rewarded?
        myna.log("Myna.Binder.clickHandler", "pass-through")

        innerHandler.call(this, evt, args...)
      else
        myna.log("Myna.Binder.clickHandler", "pass-through")

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
