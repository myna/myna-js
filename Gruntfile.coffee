#global module:false
module.exports = (grunt) ->
  grunt.loadNpmTasks 'grunt-browserify'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-karma'

  minify      = grunt.option('minify') ? false

  pkg         = grunt.file.readJSON("package.json")
  name        = pkg.name
  series      = pkg.version.split("\.")[0]
  version     = pkg.version
  homepage    = pkg.homepage
  license     = (for license in pkg.licenses then license.type).join(", ")
  today       = grunt.template.today("yyyy-mm-dd")
  thisYear    = grunt.template.today("yyyy")

  mynaJsBanner =
    """
    /*! Myna JS v#{version} - #{today}
     * #{homepage}
     * Copyright (c) #{thisYear} Myna Limited; Licensed #{license}
     */

    """

  mynaHtmlBanner =
    """
    /*! Myna HTML v#{version} - #{today}
     * #{homepage}
     * Copyright (c) #{thisYear} Myna Limited; Licensed #{license}
     */

    """

  mynaJsSrcMain         = "src/main/myna-js.coffee"
  mynaJsTempMain        = "temp/myna.js"
  mynaJsDistMain        = "dist/myna-#{version}.js"
  mynaJsDistMainMin     = "dist/myna-#{version}.min.js"
  mynaJsDistLatest      = "dist/myna-#{series}.latest.js"
  mynaJsDistLatestMin   = "dist/myna-#{series}.latest.min.js"

  mynaHtmlSrcMain       = "src/main/myna-html.coffee"
  mynaHtmlTempMain      = "temp/myna-html.js"
  mynaHtmlDistMain      = "dist/myna-html-#{version}.js"
  mynaHtmlDistMainMin   = "dist/myna-html-#{version}.min.js"
  mynaHtmlDistLatest    = "dist/myna-html-#{series}.latest.js"
  mynaHtmlDistLatestMin = "dist/myna-html-#{series}.latest.min.js"

  testSrcMain           = "src/test/**/*.coffee"
  testDistMain          = "temp/test/myna-spec.js"

  browserifyOptions     =
    watch     : true
    transform : [ 'coffeeify', 'partialify' ]
    keepAlive : false
    browserifyOptions:
      debug      : true   # generate source maps
      extensions : [ '.coffee' ]

  grunt.renameTask "watch", "watchImpl"

  grunt.registerTask "build", [
    "browserify"
    "uglify"
    "copy"
  ]

  grunt.registerTask "default", [
    "build"
    "karma:single"
  ]

  grunt.registerTask "watchCycle", [
    "build"
    "karma:watch:run"
  ]

  grunt.registerTask "watch", [
    "karma:watch:start"
    "watchCycle"
    "watchImpl"
  ]

  grunt.initConfig
    pkg: pkg
    meta: { mynaJsBanner }

    browserify:
      mynaJs:
        src     : mynaJsSrcMain
        dest    : mynaJsTempMain
        options : browserifyOptions
      mynaHtml:
        src     : mynaHtmlSrcMain
        dest    : mynaHtmlTempMain
        options : browserifyOptions
      test:
        src     : testSrcMain
        dest    : testDistMain
        options : browserifyOptions

    uglify:
      mynaJsDist:
        src     : [ mynaJsTempMain ]
        dest    : mynaJsDistMain
        options :
          banner   : mynaJsBanner
          beautify : true
      mynaHtmlDist:
        src     : [ mynaHtmlTempMain ]
        dest    : mynaHtmlDistMain
        options :
          banner   : mynaJsBanner
          beautify : true
      mynaJsDistMin:
        src     : [ mynaJsTempMain ]
        dest    : mynaJsDistMainMin
        options :
          banner   : mynaHtmlBanner
          beautify : false
      mynaHtmlDistMin:
        src     : [ mynaHtmlTempMain ]
        dest    : mynaHtmlDistMainMin
        options :
          banner   : mynaHtmlBanner
          beautify : false

    copy:
      mynaJsDistLatest:      { src: [ mynaJsDistMain      ], dest: mynaJsDistLatest      }
      mynaHtmlDistLatest:    { src: [ mynaHtmlDistMain    ], dest: mynaHtmlDistLatest    }
      mynaJsDistLatestMin:   { src: [ mynaJsDistMainMin   ], dest: mynaJsDistLatestMin   }
      mynaHtmlDistLatestMin: { src: [ mynaHtmlDistMainMin ], dest: mynaHtmlDistLatestMin }

    karma:
      single:
        configFile : 'karma.conf.coffee'
        background : false
        singleRun  : true
        autoWatch  : false
      watch:
        configFile : 'karma.conf.coffee'
        background : true
        singleRun  : false
        autoWatch  : false

    watchImpl:
      main:
        files : [ "src/**/*.coffee" ]
        tasks : [ "watchCycle" ]
