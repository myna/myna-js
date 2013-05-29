class Myna.Toolbar extends Myna.Logging
  constructor: (options = {}) ->
    @log("constructor")

  # Class method:
  @active: =>
    !!Myna.cache.load("myna-toolbar")

  init: =>
    @log("init")
    @initStylesheet()
    @initInspector()
    @initToolbar()
    Myna.cache.save("myna-toolbar", true)
    return

  remove: =>
    window.location.hash = ""
    Myna.cache.remove("myna-toolbar")
    window.location.reload()

  initStylesheet: =>
    @log("initStylesheet")
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

          /* Toolbar specifics */

          #myna-toolbar {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
          }

          #myna-toolbar .myna-overlay-inner {
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

          .myna-toolbar-highlight-hover,
          .myna-toolbar-highlight-toggle {
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

  initToolbar: =>
    @log("initToolbar")
    unless @Toolbar
      @toolbar        = $("<div id='myna-toolbar' class='myna-overlay-outer'>").appendTo("body")
      inner           = $("<div class='myna-overlay-inner'>").appendTo(@toolbar)

      left            = $("<div class='pull-left'>").appendTo(inner)
      brand           = $("<label><a href='http://mynaweb.com'>Myna</a></label>").appendTo(left)

      right           = $("<div class='pull-right'>").appendTo(inner)
      inspectorButton = $("<button class='inspector'>").
                          text(if @inspector.is(":visible") then 'Hide inspector' else 'Show inspector').
                          appendTo(right)
      closeButton     = $("<button class='close'>Close</button>").appendTo(right)

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
    @log("initInspector")
    unless @inspector
      @inspector = $("<div id='myna-inspector' class='myna-overlay-outer'>").appendTo("body")
      @inspectorInner = $("<div class='myna-overlay-inner'>").appendTo(@inspector)
      @inspectorTitle = $("<div class='myna-overlay-title'>Experiments</div>").appendTo(@inspectorInner)

      # Make the inspector draggable:
      lastMousePos = null
      inspectorSize = null

      mouseMove = (evt) =>
        evt.stopPropagation()
        evt.preventDefault()
        @log("initInspector.mouseMove", evt, lastMousePos)
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
        @log("initInspector.mouseDown", evt, lastMousePos)
        lastMousePos = { x: evt.clientX, y: evt.clientY }
        inspectorSize ?= @inspector.size()
        $('html').on('mousemove', mouseMove)

      @inspectorTitle.on 'mouseup', (evt) =>
        evt.stopPropagation()
        evt.preventDefault()
        @log("initInspector.mouseUp", evt, lastMousePos)
        $('html').off('mousemove', mouseMove)

    return

  addExperiment: (expt) =>
    @log("addExperiment", expt)
    wrapper        = $("<div class='myna-overlay-field'>").appendTo(@inspectorInner)
    label          = $("<label>").text(expt.id).appendTo(wrapper)
    variantSelect  = $("<select>").appendTo(wrapper)

    showButton     = $("<button>").text("Show").appendTo(wrapper)
    suggestButton  = $("<button>").text("Suggest").appendTo(wrapper)
    rewardButton   = $("<button>").text("Reward").attr("disabled", !expt.sticky?()?).appendTo(wrapper)
    unstickButton  = $("<button>").text("Unstick").attr("disabled", !expt.sticky?()?).appendTo(wrapper)

    for variantId, variant of expt.variants
      $("<option>").attr("value", variantId).text("View #{variantId}").appendTo(variantSelect)

    variantSelect.on "change", (evt) ->
      evt.stopPropagation()
      evt.preventDefault()
      expt.view(variantSelect.find("option:selected").attr("value"))
      return

    cssClass = expt.settings.get("myna.html.cssClass") ? "myna-#{expt.id}"
    showButton.on 'click', (evt) ->
      self = $(this)
      if self.is(".active")
        self.removeClass("active")
        $(".#{cssClass}").removeClass("myna-toolbar-highlight-toggle")
      else
        $(".#{cssClass}").addClass("myna-toolbar-highlight-toggle")
        self.addClass("active")

    wrapper.hover(
      => $(".#{cssClass}").addClass("myna-toolbar-highlight-hover")
      => $(".#{cssClass}").removeClass("myna-toolbar-highlight-hover")
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
