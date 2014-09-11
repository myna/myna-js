# global module: false

###
Myna build script
-----------------

This script builds two main libraries for use with Browserify:

 - myna.js -- a library for JS developers to use to run Myna experiments.
   This is the codebase you get if you require Myna from NPM.

 - myna-auto.js -- a library for our internal use that loads myna.js and
   automatically runs relevant exoeriments.

The script publishes minified and unminified verions of each library
to the `dist` directory.
###

module.exports = (grunt) ->
  grunt.loadNpmTasks 'grunt-browserify'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-karma'

  pkg      = grunt.file.readJSON("package.json")
  name     = pkg.name
  series   = pkg.version.split("\.")[0]
  version  = pkg.version
  homepage = pkg.homepage
  license  = (for license in pkg.licenses then license.type).join(", ")
  today    = grunt.template.today("yyyy-mm-dd")
  thisYear = grunt.template.today("yyyy")
  banner   =
    """
    /*! Myna v#{version} - #{today}
     * #{homepage}
     * Copyright (c) #{thisYear} Myna Limited; Licensed #{license}
     */

    """

  mynaSrcMain       = "src/main/myna.coffee"
  mynaTempMain      = "temp/myna.js"
  mynaDistMain      = "dist/myna-#{version}.js"
  mynaDistMainMin   = "dist/myna-#{version}.min.js"
  mynaDistLatest    = "dist/myna-#{series}.latest.js"
  mynaDistLatestMin = "dist/myna-#{series}.latest.min.js"

  autoSrcMain       = "src/main/myna-auto.coffee"
  autoTempMain      = "temp/myna-auto.js"
  autoDistMain      = "dist/myna-auto-#{version}.js"
  autoDistMainMin   = "dist/myna-auto-#{version}.min.js"
  autoDistLatest    = "dist/myna-auto-#{series}.latest.js"
  autoDistLatestMin = "dist/myna-auto-#{series}.latest.min.js"

  testSrcMain       = "src/test/**/*.coffee"
  testDistMain      = "temp/myna-spec.js"

  browserifyOptions = (publicModuleName = undefined) ->
    watch     : true
    transform : [ 'coffeeify', 'partialify' ]
    keepAlive : false
    browserifyOptions:
      debug      : true   # generate source maps
      extensions : [ '.coffee' ]
      standalone : publicModuleName

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

  grunt.registerTask "watch", [
    "karma:watch:start"
    "watchCycle"
    "watchImpl"
  ]

  grunt.registerTask "watchCycle", [
    "build"
    "karma:watch:run"
  ]

  grunt.initConfig
    pkg: pkg
    meta: { banner }

    browserify:
      myna:
        src     : mynaSrcMain
        dest    : mynaTempMain
        options : browserifyOptions("Myna")
      auto:
        src     : autoSrcMain
        dest    : autoTempMain
        options : browserifyOptions("Myna")
      test:
        src     : testSrcMain
        dest    : testDistMain
        options : browserifyOptions(undefined)

    uglify:
      mynaDist:
        src     : [ mynaTempMain ]
        dest    : mynaDistMain
        options :
          banner   : banner
          beautify : true
          mangle   : false
      autoDist:
        src     : [ autoTempMain ]
        dest    : autoDistMain
        options :
          banner   : banner
          beautify : true
          mangle   : false
      mynaDistMin:
        src     : [ mynaTempMain ]
        dest    : mynaDistMainMin
        options :
          banner   : banner
          beautify : false
          mangle   : true
      autoDistMin:
        src     : [ autoTempMain ]
        dest    : autoDistMainMin
        options :
          banner   : banner
          beautify : false
          mangle   : true

    copy:
      mynaDistLatest:    { src: [ mynaDistMain    ], dest: mynaDistLatest    }
      autoDistLatest:    { src: [ autoDistMain    ], dest: autoDistLatest    }
      mynaDistLatestMin: { src: [ mynaDistMainMin ], dest: mynaDistLatestMin }
      autoDistLatestMin: { src: [ autoDistMainMin ], dest: autoDistLatestMin }

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
