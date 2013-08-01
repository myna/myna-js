class Myna.Inspector
  constructor: (client, binder = null) ->
    Myna.log("Myna.Inspector.constructor")

    @client = client
    @binder = binder

  init: =>
    Myna.log("Myna.Inspector.init")
    @initStylesheet()
    @initInspector()
    @initNavbar()
    Myna.cache.save("myna-inspector", { visible: true})

    for id, expt of @client.experiments
      if @binder == null || @binder.detect(expt)
        @addExperiment(expt)

    return

  remove: =>
    window.location.hash = ""
    Myna.cache.remove("myna-inspector")
    window.location.reload()

  initStylesheet: =>
    Myna.log("Myna.Inspector.initStylesheet")
    unless @stylesheet
      @stylesheet = Myna.$(
        """
        <style id="myna-stylesheet">
          html {
            margin-top: 40px;
          }

          /* Clearfix */

          .myna-overlay-inner {
            *zoom: 1;
          }

          .myna-overlay-inner:before,
          .myna-overlay-inner:after {
            display: table;
            content: "";
            line-height: 0;
          }

          .myna-overlay-inner:after {
            clear: both;
          }

          /* Structure */

          .myna-overlay-inner {
            font-size: 16px;
            line-height: 20px;
          }

          .myna-overlay-inner .pull-left {
            float: left;
          }

          .myna-overlay-inner .pull-right {
            float: right;
          }

          .myna-overlay-title {
            padding: 5px 10px;
            cursor: pointer;
            font-weight: bold;
            line-height: 150%;
          }

          .myna-overlay-field {
            padding: 0 10px 5px;
            white-space: nowrap;
          }

          .myna-overlay-inner label,
          .myna-overlay-inner select,
          .myna-overlay-inner button {
            display: inline-block;
            box-sizing: border-box;
            height: 30px;
            margin: 0 5px;
            padding: 0 8px;
            font-size: 16px;
            line-height: 30px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            -webkit-border-radius: 5px;
            -moz-border-radius: 5px;
            border-radius: 5px;
          }

          .myna-overlay-inner label {
            width: 160px;
            padding: 0;
          }

          .myna-overlay-inner select {
            width: 200px;
          }

          /* Navbar specifics */

          #myna-navbar {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
          }

          #myna-navbar .myna-overlay-inner {
            padding: 5px 10px;
          }

          /* Inspector specifics */

          #myna-inspector {
            position: fixed;
            bottom: 20px;
            right: 20px;
            -webkit-border-radius: 10px;
            -moz-border-radius: 10px;
            border-radius: 10px;
          }

          #myna-inspector .myna-overlay-inner {
            padding: 0 0 5px;
          }

          /* Highlight */

          .myna-inspector-highlight-hover,
          .myna-inspector-highlight-toggle {
            outline: 5px solid #55f;
          }

          /* Themes */

          .myna-overlay-outer {
            -webkit-box-shadow: 0px 0px 10px rgba(50, 50, 50, 0.5);
            -moz-box-shadow:    0px 0px 10px rgba(50, 50, 50, 0.5);
            box-shadow:         0px 0px 10px rgba(50, 50, 50, 0.5);
          }

          .myna-overlay-outer {
            background: #000;
            background: rgba(0, 0, 0, 0.75);
            color: #fff;
          }

          .myna-overlay-inner select,
          .myna-overlay-inner button {
            background: #333;
            background: -moz-linear-gradient(top, #444 0%, #222 100%);
            background: -webkit-linear-gradient(top, #444 0%, #222 100%);
            background: -o-linear-gradient(top, #444 0%, #222 100%);
            background: -ms-linear-gradient(top, #444 0%, #222 100%);
            background: linear-gradient(to bottom, #444 0%, #222 100%);
            border: 1px solid #555;
            color: #fff;
          }

          .myna-overlay-inner select.active,
          .myna-overlay-inner button.active,
          .myna-overlay-inner select:active,
          .myna-overlay-inner button:active {
            background: -moz-linear-gradient(top, #222 0%, #444 100%);
            background: -webkit-linear-gradient(top, #222 0%, #444 100%);
            background: -o-linear-gradient(top, #222 0%, #444 100%);
            background: -ms-linear-gradient(top, #222 0%, #444 100%);
            background: linear-gradient(to bottom, #222 0%, #444 100%);
          }

          .myna-overlay-outer a {
            color: #fff;
            text-decoration: none;
          }

          .myna-overlay-outer.myna-overlay-light {
            background: #fff;
            background: rgba(255, 255, 255, 0.75);
            color: #000;
          }

          .myna-overlay-outer.myna-overlay-light a {
            color: #000;
            text-decoration: none;
          }
        </style>
        """).appendTo("head")
    return

  initNavbar: =>
    Myna.log("Myna.Inspector.initNavbar")
    unless @Inspector
      @navbar       = Myna.$("<div id='myna-navbar' class='myna-overlay-outer'>").appendTo("body")
      inner           = Myna.$("<div class='myna-overlay-inner'>").appendTo(@navbar)

      left            = Myna.$("<div class='pull-left'>").appendTo(inner)
      brand           = Myna.$("<label><a href='http://mynaweb.com'>Myna</a></label>").appendTo(left)

      right           = Myna.$("<div class='pull-right'>").appendTo(inner)
      inspectorButton = Myna.$("<button class='inspector'>").
                          text(if @inspector.is(":visible") then 'Hide inspector' else 'Show inspector').
                          appendTo(right)
      closeButton     = Myna.$("<button class='close'>Close</button>").appendTo(right)

      inspectorButton.on 'click', =>
        if @inspector.is(":visible")
          @inspector.hide()
          inspectorButton.text('Show inspector')
        else
          @inspector.show()
          inspectorButton.text('Hide inspector')

      closeButton.on 'click', =>
        @remove()

      return

  initInspector: =>
    Myna.log("Myna.Inspector.initInspector")
    unless @inspector
      @inspector      = Myna.$("<div id='myna-inspector' class='myna-overlay-outer'>").appendTo("body")
      @inspectorInner = Myna.$("<div class='myna-overlay-inner'>").appendTo(@inspector)
      @inspectorTitle = Myna.$("<div class='myna-overlay-title'>Experiments</div>").appendTo(@inspectorInner)

      # Make the inspector draggable:
      lastMousePos = null
      inspectorSize = null

      mouseMove = (evt) =>
        evt.stopPropagation()
        evt.preventDefault()
        Myna.log("Myna.Inspector.initInspector.mouseMove", evt, lastMousePos)
        currMousePos = { x: evt.clientX, y: evt.clientY }
        inspectorPos = @inspector.position()
        @inspector.css
          top:    inspectorPos.top  + currMousePos.y - lastMousePos.y
          left:   inspectorPos.left + currMousePos.x - lastMousePos.x
          bottom: "auto"
          right:  "auto"
          width:  inspectorSize.width
          height: inspectorSize.height
        lastMousePos = currMousePos

      @inspectorTitle.on 'mousedown', (evt) =>
        evt.stopPropagation()
        evt.preventDefault()
        Myna.log("Myna.Inspector.initInspector.mouseDown", evt, lastMousePos)
        lastMousePos = { x: evt.clientX, y: evt.clientY }
        inspectorSize ?= @inspector.size()
        Myna.$('html').on('mousemove', mouseMove)

      @inspectorTitle.on 'mouseup', (evt) =>
        evt.stopPropagation()
        evt.preventDefault()
        Myna.log("Myna.Inspector.initInspector.mouseUp", evt, lastMousePos)
        Myna.$('html').off('mousemove', mouseMove)

    return

  addExperiment: (expt) =>
    Myna.log("Myna.Inspector.addExperiment", expt)
    wrapper        = Myna.$("<div class='myna-overlay-field'>").appendTo(@inspectorInner)
    label          = Myna.$("<label>").text(expt.id).appendTo(wrapper)
    variantSelect  = Myna.$("<select>").appendTo(wrapper)

    showButton     = Myna.$("<button>").text("Show").appendTo(wrapper)
    suggestButton  = Myna.$("<button>").text("Suggest").appendTo(wrapper)
    rewardButton   = Myna.$("<button>").text("Reward").attr("disabled", !expt.sticky?()?).appendTo(wrapper)
    unstickButton  = Myna.$("<button>").text("Unstick").attr("disabled", !expt.sticky?()?).appendTo(wrapper)

    for variantId, variant of expt.variants
      Myna.$("<option>").attr("value", variantId).text("View #{variantId}").appendTo(variantSelect)

    variantSelect.on "change", (evt) ->
      evt.stopPropagation()
      evt.preventDefault()
      expt.view(variantSelect.find("option:selected").attr("value"))
      return

    cssClass = expt.settings.get("myna.html.cssClass") ? "myna-#{expt.id}"
    showButton.on 'click', (evt) ->
      self = Myna.$(this)
      if self.is(".active")
        self.removeClass("active")
        Myna.$(".#{cssClass}").removeClass("myna-inspector-highlight-toggle")
      else
        Myna.$(".#{cssClass}").addClass("myna-inspector-highlight-toggle")
        self.addClass("active")

    wrapper.hover(
      => Myna.$(".#{cssClass}").addClass("myna-inspector-highlight-hover")
      => Myna.$(".#{cssClass}").removeClass("myna-inspector-highlight-hover")
    )

    suggestButton.on "click", (evt) ->
      expt.suggest()
      return

    rewardButton.on  "click", (evt) ->
      expt.reward()
      return

    unstickButton.on "click", (evt) ->
      expt.unstick()
      return

    expt.on 'view', (variant) ->
      Myna.log(" - inspector view", variant)
      variantSelect.find("[value=#{variant.id}]").prop("selected", true)
      return

    return
