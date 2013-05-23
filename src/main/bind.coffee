class Myna.Binder
  bind: (expt, options = {}) =>
    Myna.log("Myna.Binder.bind", expt, options)

    cssClass = expt.settings.get("myna.html.cssClass") ? "myna-#{expt.id}"

    dataPrefix = expt.settings.get("myna.html.dataPrefix") ? null
    dataShow = if dataPrefix then "#{@dataPrefix}-show" else "show"
    dataBind = if dataPrefix then "#{@dataPrefix}-bind" else "bind"
    dataGoal = if dataPrefix then "#{@dataPrefix}-goal" else "goal"

    allElems  = if cssClass then Myna.$(".#{cssClass}") else null
    showElems = if cssClass then allElems.filter("[data-#{dataShow}]") else $("[data-#{dataShow}]")
    bindElems = if cssClass then allElems.filter("[data-#{dataBind}]") else $("[data-#{dataBind}]")
    goalElems = if cssClass then allElems.filter("[data-#{dataGoal}]") else $("[data-#{dataGoal}]")

    bindShow = options.show ? true
    bindBind = options.bind ? true
    bindGoal = options.goal ? true

    if bindShow then showElems.each (index, elem) => @bindShow(expt, dataShow, elem)
    if bindBind then bindElems.each (index, elem) => @bindBind(expt, dataBind, elem)
    if bindGoal then goalElems.each (index, elem) => @bindGoal(expt, dataGoal, elem)

  bindShow: (expt, dataAttr, elem) =>
    Myna.log("Myna.Binder.bindShow", expt, dataAttr, elem)

    self = Myna.$(elem)
    path = self.data(dataAttr)

    unless path then return

    expt.suggest (variant) ->
      if variant.id == path || variant.settings.get(path)
        self.show()
      else
        self.hide()

  bindBind: (expt, dataAttr, elem) =>
    Myna.log("Myna.Binder.bindBind", expt, dataAttr, elem)

    self = Myna.$(elem)
    [ lhs, rhs ] = attrString.split("=")

    unless lhs && rhs then return

    expt.suggest (variant) ->
      switch lhs
        when "text"  then self.text(variant.settings.get(rhs) ? "")
        when "html"  then self.html(variant.settings.get(rhs) ? "")
        when "class" then self.addClass(variant.settings.get(rhs) ? "")
        else
          if lhs[0] == "@"
            self.attr(lsh.substring(1), variant.settings.get(rhs) ? "")

  bindGoal: (expt, dataAttr, elem) =>
    Myna.log("Myna.Binder.bindGoal", expt, dataAttr, elem)

    self  = Myna.$(elem)
    event = self.data(dataAttr)

    unless event then return

    switch event
      when "load"  then $(=> expt.reward())
      when "click" then self.on("click", @createClickHandler(expt))

  # (event any ... -> void) -> (event any ... -> void)
  createClickHandler: (expt, handler = (->)) =>
    Myna.log("Myna.Binder.createClickHandler", expt, handler)

    (evt, args...) ->
      myna.log("Myna.Binder.clickHandler", evt, args...)

      elem = this
      self = $(elem)

      rewarded = expt.loadStickyReward() || expt.loadLastReward()

      if rewarded?
        myna.log("Myna.Binder.clickHandler", "pass-through")

        handler.call(this, evt, args...)
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
