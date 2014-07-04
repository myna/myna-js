$          = require 'jquery'
Experiment = require '../app/experiment'
Client     = require '../app/client'
Binder     = require '../app/bind'
Recorder   = require '../app/recorder'

initialHtml = $("#experiments").html()

initialized = (fn) ->
  ->
    $("#experiments").html(initialHtml)

    expt1 = new Experiment
      uuid:     "45923780-80ed-47c6-aa46-15e2ae7a0e8c"
      id:       "expt1"
      settings: "myna.web.sticky": false
      variants: [
        { id: "variant1", name: "Variant 1.1", weight: 0.5, settings: { title: "title1", cssClass: "class1", html: "<v1>" }  }
        { id: "variant2", name: "Variant 1.2", weight: 0.5, settings: { title: "title2", cssClass: "class2", html: "<v2>" }  }
      ]

    expt2 = new Experiment
      uuid:     "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      id:       "expt2"
      settings: "myna.web.sticky": true
      variants: [
        { id: "variant1", name: "Variant 2.1", weight: 0.5, settings: { style: "display: inline-block", url: "example.com" } }
        { id: "variant2", name: "Variant 2.2", weight: 0.5, settings: { style: "display: block", url: "example.com" } }
      ]

    expt1.unstick()
    expt2.unstick()

    client = new Client
      apiKey: testApiKey
      apiRoot: testApiRoot
      experiments: [ expt1, expt2 ]

    binder = new Binder client
    binder.init { all: true }

    recorder = new Recorder client
    recorder.clearQueuedEvents()
    recorder.init()

    fn(client, binder, recorder)

describe "data-show,data-hide", ->
  it "should show/hide elements", initialized (client, binder, recorder) ->
    $("#experiments").html(
      '''
      <span id="v1" class="myna-expt1" data-show="variant1">V1</span>
      <span id="v2" class="myna-expt1" data-show="variant2">V2</span>
      <span id="v3" class="myna-expt2" data-hide="variant1">V3</span>
      <span id="v4" class="myna-expt2" data-hide="variant2">V4</span>
      '''
    )

    window.client = client

    expect($("#v1").is(":visible")).toEqual(true)
    expect($("#v2").is(":visible")).toEqual(true)
    expect($("#v3").is(":visible")).toEqual(true)
    expect($("#v4").is(":visible")).toEqual(true)

    client.experiments.expt1.view("variant1")
    expect($("#v1").is(":visible")).toEqual(true)
    expect($("#v2").is(":visible")).toEqual(false)
    expect($("#v3").is(":visible")).toEqual(true)
    expect($("#v4").is(":visible")).toEqual(true)

    client.experiments.expt1.view("variant2")
    expect($("#v1").is(":visible")).toEqual(false)
    expect($("#v2").is(":visible")).toEqual(true)
    expect($("#v3").is(":visible")).toEqual(true)
    expect($("#v4").is(":visible")).toEqual(true)

    client.experiments.expt2.view("variant1")
    expect($("#v1").is(":visible")).toEqual(false)
    expect($("#v2").is(":visible")).toEqual(true)
    expect($("#v3").is(":visible")).toEqual(false)
    expect($("#v4").is(":visible")).toEqual(true)

    client.experiments.expt2.view("variant2")
    expect($("#v1").is(":visible")).toEqual(false)
    expect($("#v2").is(":visible")).toEqual(true)
    expect($("#v3").is(":visible")).toEqual(true)
    expect($("#v4").is(":visible")).toEqual(false)

    return

  it "should work with multiple experiments", initialized (client, binder, recorder) ->
    $("#experiments").html(
      '''
      <span id="v1" class="myna-expt1" data-show="variant1">V1</span>
      <span id="v2" class="myna-expt1" data-show="variant2">V2</span>
      <span id="v3" class="myna-expt2" data-hide="variant1">V3</span>
      <span id="v4" class="myna-expt2" data-hide="variant2">V4</span>
      '''
    )

    expect($("#v1").is(":visible")).toEqual(true)
    expect($("#v2").is(":visible")).toEqual(true)
    expect($("#v3").is(":visible")).toEqual(true)
    expect($("#v4").is(":visible")).toEqual(true)

    client.experiments.expt1.view("variant1")
    expect($("#v1").is(":visible")).toEqual(true)
    expect($("#v2").is(":visible")).toEqual(false)
    expect($("#v3").is(":visible")).toEqual(true)
    expect($("#v4").is(":visible")).toEqual(true)

    client.experiments.expt2.view("variant2")
    expect($("#v1").is(":visible")).toEqual(true)
    expect($("#v2").is(":visible")).toEqual(false)
    expect($("#v3").is(":visible")).toEqual(true)
    expect($("#v4").is(":visible")).toEqual(false)

    client.experiments.expt1.view("variant2")
    expect($("#v1").is(":visible")).toEqual(false)
    expect($("#v2").is(":visible")).toEqual(true)
    expect($("#v3").is(":visible")).toEqual(true)
    expect($("#v4").is(":visible")).toEqual(false)

    return

describe "data-bind", ->
  it "should alter an element's text", initialized (client, binder, recorder) ->
    $("#experiments").html(
      '''
      <span id="v1a" class="myna-expt1" data-bind="text"></span>
      <span id="v1b" class="myna-expt1" data-bind="text=html"></span>
      <span id="v1c" class="myna-expt1" data-bind="text=name"></span>
      <span id="v1d" class="myna-expt1" data-bind="text=id"></span>
      '''
    )

    expect($("#v1a").html()).toEqual("")
    expect($("#v1b").html()).toEqual("")
    expect($("#v1c").html()).toEqual("")
    expect($("#v1d").html()).toEqual("")

    client.experiments.expt1.view("variant1")
    expect($("#v1a").html()).toEqual("Variant 1.1")
    expect($("#v1b").html()).toEqual("&lt;v1&gt;")
    expect($("#v1c").html()).toEqual("Variant 1.1")
    expect($("#v1d").html()).toEqual("variant1")

    client.experiments.expt1.view("variant2")
    expect($("#v1a").html()).toEqual("Variant 1.2")
    expect($("#v1b").html()).toEqual("&lt;v2&gt;")
    expect($("#v1c").html()).toEqual("Variant 1.2")
    expect($("#v1d").html()).toEqual("variant2")

    return

  it "should alter an element's html", initialized (client, binder, recorder) ->
    $("#experiments").html(
      '''
      <span id="v1a" class="myna-expt1" data-bind="html"></span>
      <span id="v1b" class="myna-expt1" data-bind="html=html"></span>
      <span id="v1c" class="myna-expt1" data-bind="html=name"></span>
      <span id="v1d" class="myna-expt1" data-bind="html=id"></span>
      '''
    )

    expect($("#v1a").html()).toEqual("")
    expect($("#v1b").html()).toEqual("")
    expect($("#v1c").html()).toEqual("")
    expect($("#v1d").html()).toEqual("")

    client.experiments.expt1.view("variant1")
    expect($("#v1a").html()).toEqual("Variant 1.1")
    expect($("#v1b").html()).toEqual("<v1></v1>")
    expect($("#v1c").html()).toEqual("Variant 1.1")
    expect($("#v1d").html()).toEqual("variant1")

    client.experiments.expt1.view("variant2")
    expect($("#v1a").html()).toEqual("Variant 1.2")
    expect($("#v1b").html()).toEqual("<v2></v2>")
    expect($("#v1c").html()).toEqual("Variant 1.2")
    expect($("#v1d").html()).toEqual("variant2")

    return

  it "should add to an element's class", initialized (client, binder, recorder) ->
    $("#experiments").html(
      '''
      <span id="v1a" class="myna-expt1" data-bind="class"></span>
      <span id="v1b" class="myna-expt1" data-bind="class=cssClass"></span>
      <span id="v1c" class="myna-expt1" data-bind="class=name"></span>
      <span id="v1d" class="myna-expt1" data-bind="class=id"></span>
      '''
    )

    expect($("#v1a").attr("class")).toEqual("myna-expt1")
    expect($("#v1b").attr("class")).toEqual("myna-expt1")
    expect($("#v1c").attr("class")).toEqual("myna-expt1")
    expect($("#v1d").attr("class")).toEqual("myna-expt1")

    client.experiments.expt1.view("variant1")
    expect($("#v1a").attr("class")).toEqual("myna-expt1 Variant 1.1")
    expect($("#v1b").attr("class")).toEqual("myna-expt1 class1")
    expect($("#v1c").attr("class")).toEqual("myna-expt1 Variant 1.1")
    expect($("#v1d").attr("class")).toEqual("myna-expt1 variant1")

    client.experiments.expt1.view("variant2")
    expect($("#v1a").attr("class")).toEqual("myna-expt1 Variant 1.1 1.2")
    expect($("#v1b").attr("class")).toEqual("myna-expt1 class1 class2")
    expect($("#v1c").attr("class")).toEqual("myna-expt1 Variant 1.1 1.2")
    expect($("#v1d").attr("class")).toEqual("myna-expt1 variant1 variant2")

    return

  it "should alter an element's title attribute", initialized (client, binder, recorder) ->
    $("#experiments").html(
      '''
      <span id="v1a" class="myna-expt1" data-bind="@title"></span>
      <span id="v1b" class="myna-expt1" data-bind="@title=title"></span>
      <span id="v1c" class="myna-expt1" data-bind="@title=name"></span>
      <span id="v1d" class="myna-expt1" data-bind="@title=id"></span>
      '''
    )

    expect($("#v1a").attr("title")).toEqual(null)
    expect($("#v1b").attr("title")).toEqual(null)
    expect($("#v1c").attr("title")).toEqual(null)
    expect($("#v1d").attr("title")).toEqual(null)

    client.experiments.expt1.view("variant1")
    expect($("#v1a").attr("title")).toEqual("Variant 1.1")
    expect($("#v1b").attr("title")).toEqual("title1")
    expect($("#v1c").attr("title")).toEqual("Variant 1.1")
    expect($("#v1d").attr("title")).toEqual("variant1")

    client.experiments.expt1.view("variant2")
    expect($("#v1a").attr("title")).toEqual("Variant 1.2")
    expect($("#v1b").attr("title")).toEqual("title2")
    expect($("#v1c").attr("title")).toEqual("Variant 1.2")
    expect($("#v1d").attr("title")).toEqual("variant2")

    return

  it "should work with multiple experiments", initialized (client, binder, recorder) ->
    $("#experiments").html(
      '''
      <span id="v1" class="myna-expt1" data-bind="@title=title"></span>
      <span id="v2" class="myna-expt2" data-bind="@style=style"></span>
      '''
    )

    expect($("#v1").attr("title")).toEqual(null)
    expect($("#v1").css("display")).toEqual("inline")
    expect($("#v2").attr("title")).toEqual(null)
    expect($("#v2").css("display")).toEqual("inline")

    client.experiments.expt1.view("variant1")
    expect($("#v1").attr("title")).toEqual("title1")
    expect($("#v1").css("display")).toEqual("inline")
    expect($("#v2").attr("title")).toEqual(null)
    expect($("#v2").css("display")).toEqual("inline")

    client.experiments.expt2.view("variant1")
    expect($("#v1").attr("title")).toEqual("title1")
    expect($("#v1").css("display")).toEqual("inline")
    expect($("#v2").attr("title")).toEqual(null)
    expect($("#v2").css("display")).toEqual("inline-block")

    client.experiments.expt1.view("variant2")
    expect($("#v1").attr("title")).toEqual("title2")
    expect($("#v1").css("display")).toEqual("inline")
    expect($("#v2").attr("title")).toEqual(null)
    expect($("#v2").css("display")).toEqual("inline-block")

    client.experiments.expt2.view("variant2")
    expect($("#v1").attr("title")).toEqual("title2")
    expect($("#v1").css("display")).toEqual("inline")
    expect($("#v2").attr("title")).toEqual(null)
    expect($("#v2").css("display")).toEqual("block")

    return

  return

describe "data-goal", ->
  it "should detect click events", initialized (client, binder, recorder) ->
    $("#experiments").html(
      '''
      <button id="v1" class="myna-expt1" data-goal="click">V1</button>
      '''
    )

    successful = []
    unsuccessful = []

    recorder.on "sync", (succ, unsucc) ->
      successful = successful.concat(succ)
      unsuccessful = unsuccessful.concat(unsucc)
      return

    runs ->
      client.experiments.expt1.view("variant1")
      return

    waitsFor ->
      successful.length == 1

    runs ->
      $("#v1").click()
      return

    waitsFor ->
      successful.length == 2

    runs ->
      expect(successful.length).toEqual(2)
      expect(unsuccessful.length).toEqual(0)
      return

    return

  it "should not interrupt links loading pages", initialized (client, binder, recorder) ->
    hashToRestore = window.location.hash || "#"
    window.location.hash = "#foo"

    $("#experiments").html(
      '''
      <a id="v1" href="#bar" class="myna-expt1" data-goal="click">V1</a>
      '''
    )

    successful = []
    unsuccessful = []

    recorder.on "sync", (succ, unsucc) ->
      successful = successful.concat(succ)
      unsuccessful = unsuccessful.concat(unsucc)
      return

    runs ->
      client.experiments.expt1.view("variant1")
      $("#v1").click()
      return

    waitsFor ->
      successful.length == 2

    runs ->
      expect(successful.length).toEqual(2)
      expect(unsuccessful.length).toEqual(0)
      return

    waitsFor ->
      window.location.hash == "#bar"

    runs ->
      expect(window.location.hash).toEqual("#bar")
      window.location.hash = hashToRestore
      return

    return

  # it "should detect page load events", initialized (client, binder, recorder) ->
  #   # Not sure how to implement this one yet:
  #   expect("tests for data-goal=\"load\"").toEqual("written")

describe "data-redirect", ->
  it "should stay on the same page when no url in variants", initialized (client, binder, recorder) ->
    spyOn(Myna, 'redirect').andCallFake (->)

    $("#experiments").html(
      '''
      <div id="v1" class="myna-expt1" data-redirect="url"></div>
      '''
    )

    window.client = client

    expect(util.redirect.callCount).toEqual(0)

  it "should redirect when a url is present", initialized (client, binder, recorder) ->
    spyOn(Myna, 'redirect').andCallFake (->)

    $("#experiments").html(
      '''
      <div id="v1" class="myna-expt2" data-redirect="url"></div>
      '''
    )

    window.client = client

    expect(util.redirect.callCount).toEqual(1)
    expect(util.redirect.mostRecentCall.args).toEqual("example.com")
