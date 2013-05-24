class Myna.Toolbar
  constructor: (client) ->
    Myna.log("Myna.Toolbar.constructor", client)
    @client = client

  show: =>
    Myna.log("Myna.Toolbar.show")
    @attachStylesheet()
    @attachToolbar()
    return

  attachStylesheet: =>
    Myna.log("Myna.Toolbar.attachStylesheet")
    if $("#myna-toolbar-stylesheet").length == 0
      html =
        """
        <style id="myna-toolbar-stylesheet">
          body {
            margin-top: 50px;
          }

          .myna-toolbar-outer {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
          }

          .myna-toolbar-inner {
            padding: 5px 10px;
            background: #eee;
            border-bottom: 1px solid #ccc;
            font-size: 16px;
            line-height: 20px;
          }

          .myna-toolbar-field {
            display: inline-block;
            white-space: nowrap;
          }

          #myna-toolbar label,
          #myna-toolbar select,
          #myna-toolbar button {
            display: inline-block;
            box-sizing: border-box;
            height: 30px;
            margin: 0 5px;
            padding: 0 8px;
            line-height: 30px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          #myna-toolbar label {
            width: 100px;
          }

          #myna-toolbar select {
            width: 200px;
          }
        </style>
        """
      Myna.$(html).appendTo("head")
    return

  attachToolbar: =>
    Myna.log("Myna.Toolbar.attachToolbar")
    if $("#myna-toolbar").length == 0
      outer = $("<div id='myna-toolbar' class='myna-toolbar-outer'>").appendTo("body")
      inner = $("<div class='myna-toolbar-inner'>").appendTo(outer)

      for exptId, expt of @client.experiments
        do(exptId, expt) ->
          wrapper        = $("<div class='myna-toolbar-field'>").appendTo(inner)
          label          = $("<label>").text(exptId).appendTo(wrapper)
          variantSelect  = $("<select>").appendTo(wrapper)

          for variantId, variant of expt.variants
            $("<option>").attr("value", variantId).text("View #{variantId}").appendTo(variantSelect)

          variantSelect.on "change", (evt) ->
            expt.preview(variantSelect.find("option:selected").attr("value"))
            return

          expt.on 'afterView', (variant) ->
            Myna.log(" - toolbar afterView", variant)
            variantSelect.find("[value=#{variant.id}]").prop("selected", true)
            return

          suggestButton = $("<button>").text("Suggest").appendTo(wrapper)
          suggestButton.on "click", -> expt.suggest()

          rewardButton = $("<button>").text("Reward").attr("disabled", !expt.sticky?()?).appendTo(wrapper)
          rewardButton.on "click", -> expt.reward?()

          unstickButton = $("<button>").text("Unstick").attr("disabled", !expt.sticky?()?).appendTo(wrapper)
          unstickButton.on "click", -> expt.unstick?()

          return
    return
