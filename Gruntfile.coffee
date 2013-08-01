#global module:false
module.exports = (grunt) ->

  pkg = grunt.file.readJSON("package.json")

  name        = pkg.name
  series      = pkg.series
  version     = pkg.version

  homepage    = pkg.homepage
  maintainer  = pkg.maintainers[0].name
  license     = (for license in pkg.licenses then license.type).join(", ")
  today       = grunt.template.today("yyyy-mm-dd")
  thisYear    = grunt.template.today("yyyy")

  jasminePort = 8001

  mynaJsBanner =
    """
    /*! Myna JS v#{version} - #{today}
     * #{homepage}
     * Copyright (c) #{thisYear} #{maintainer}; Licensed #{license}
     */
    """

  mynaHtmlBanner =
    """
    /*! Myna HTML v#{version} - #{today}
     * #{homepage}
     * Copyright (c) #{thisYear} #{maintainer}; Licensed #{license}
     */
    """

  mainSources = (intro, outro) ->
    [
      intro...
      "core.coffee"
      "jsonp.coffee"
      "events.coffee"
      "settings.coffee"
      "cache.coffee"
      "variant.coffee"
      "base-experiment.coffee"
      "experiment.coffee"
      "recorder.coffee"
      "google-analytics.coffee"
      "client.coffee"
      "preview.coffee"
      outro...
    ]

  testSources = (outro) ->
    [
      "common.coffee"
      "core-spec.coffee"
      "jsonp-spec.coffee"
      "settings-spec.coffee"
      "variant-spec.coffee"
      "experiment-spec.coffee"
      "suggest-spec.coffee"
      "reward-spec.coffee"
      "recorder-spec.coffee"
      "google-analytics-spec.coffee"
      "event-spec.coffee"
      outro...
    ]

  mynaJsMainSources   = mainSources [ ], [
    "js-init.coffee"
  ]

  mynaJsTestSources   = testSources [ ], [
    "js-init-spec.coffee"
  ]

  mynaHtmlMainSources = mainSources [ ], [
    "bind.coffee"
    "inspector.coffee"
    "html-init.coffee"
  ]

  mynaHtmlTestSources = testSources [ ], [
    "html-init-spec.coffee"
  ]

  sources = (dir, sources, ext = null) ->
    for source in sources
      filename =
        if ext then source.replace(/[.][a-z]+$/g, ext) else source
      "#{ dir }/#{ filename }"

  mynaJsDistMain      = "dist/myna-#{version}.js"
  mynaJsDistMainMin   = "dist/myna-#{version}.min.js"
  mynaJsDistLatest    = "dist/myna-#{series}.latest.js"
  mynaJsDistLatestMin = "dist/myna-#{series}.latest.min.js"

  mynaHtmlDistMain      = "dist/myna-html-#{version}.js"
  mynaHtmlDistMainMin   = "dist/myna-html-#{version}.min.js"
  mynaHtmlDistLatest    = "dist/myna-html-#{series}.latest.js"
  mynaHtmlDistLatestMin = "dist/myna-html-#{series}.latest.min.js"

  # Project configuration.
  grunt.initConfig({
    pkg: pkg
    meta: { mynaJsBanner }

    coffee:
      options: bare: false
      main: { expand: true, cwd: "src/main/", src: [ "**/*.coffee" ], dest: "temp/main/", ext: ".js" }
      test: { expand: true, cwd: "src/test/", src: [ "**/*.coffee" ], dest: "temp/test/", ext: ".js" }

    copy:
      main: { expand: true, cwd: "src/main/", src: [ "**/*.js" ], dest: "temp/main/" }
      test: { expand: true, cwd: "src/test/", src: [ "**/*.js" ], dest: "temp/test/" }

    concat:
      mynaJsDist:     { src: sources("temp/main", mynaJsMainSources,   ".js"), dest: mynaJsDistMain,     options: { mynaJsBanner } }
      mynaJsLatest:   { src: sources("temp/main", mynaJsMainSources,   ".js"), dest: mynaJsDistLatest,   options: { mynaJsBanner } }
      mynaHtmlDist:   { src: sources("temp/main", mynaHtmlMainSources, ".js"), dest: mynaHtmlDistMain,   options: { mynaJsBanner } }
      mynaHtmlLatest: { src: sources("temp/main", mynaHtmlMainSources, ".js"), dest: mynaHtmlDistLatest, options: { mynaJsBanner } }

    jshint:
      options: { asi: true, eqnull: true, eqeqeq: false }
      mynaJsMain:   { src: mynaJsDistMain   }
      mynaJsTest:   { src: sources("temp/test", mynaJsTestSources, ".js") }
      mynaHtmlMain: { src: mynaHtmlDistMain }
      mynaHtmlTest: { src: sources("temp/test", mynaHtmlTestSources, ".js") }

    connect:
      jasmineSite:
        options:
          port: jasminePort
          base: "."

    jasmine:
      mynaJs:
        src: mynaJsDistMain
        options:
          host:       "http://127.0.0.1:#{jasminePort}/"
          specs:      sources("temp/test", mynaJsTestSources, ".js")
          outfile:    "myna-js-specrunner.html"
          keepRunner: true
      mynaHtml:
        src: mynaHtmlDistMain
        options:
          host:       "http://127.0.0.1:#{jasminePort}/"
          specs:      sources("temp/test", mynaHtmlTestSources, ".js")
          outfile:    "myna-html-specrunner.html"
          keepRunner: true

    uglify:
      mynaJsDist:     { src: [ mynaJsDistMain     ], dest: mynaJsDistMainMin     }
      mynaJsLatest:   { src: [ mynaJsDistLatest   ], dest: mynaJsDistLatestMin   }
      mynaHtmlDist:   { src: [ mynaHtmlDistMain   ], dest: mynaHtmlDistMainMin   }
      mynaHtmlLatest: { src: [ mynaHtmlDistLatest ], dest: mynaHtmlDistLatestMin }

    watch:
      main: { files: sources("src/maintest", mynaJsMainSources, ".coffee"), tasls: [ "myna-js", "myna-html" ] }
  })

  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-contrib-connect"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-jasmine"
  grunt.loadNpmTasks "grunt-contrib-jshint"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-watch"

  grunt.registerTask "myna-js", [
    "coffee"
    "copy"
    "concat:mynaJsDist"
    "concat:mynaJsLatest"
    # "jshint:mynaJsMain"
    # "jshint:mynaJsTest"
    # "connect"
    # "jasmine:mynaJs"
    "uglify:mynaJsDist"
    "uglify:mynaJsLatest"
  ]

  grunt.registerTask "myna-html", [
    "coffee"
    "copy"
    "concat:mynaHtmlDist"
    "concat:mynaHtmlLatest"
    # "jshint:mynaHtmlMain"
    # "jshint:mynaHtmlTest"
    # "connect"
    # "jasmine:mynaHtml"
    "uglify:mynaHtmlDist"
    "uglify:mynaHtmlLatest"
  ]

  grunt.registerTask "default", [
    "myna-js"
    "myna-html"
  ]
