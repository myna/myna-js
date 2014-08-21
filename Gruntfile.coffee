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

  mynaJsSrcMain         = "src/main/myna-js.coffee"
  mynaJsDistMain        = "dist/myna-#{version}.js"
  mynaJsDistMainMin     = "dist/myna-#{version}.min.js"
  mynaJsDistLatest      = "dist/myna-#{series}.latest.js"
  mynaJsDistLatestMin   = "dist/myna-#{series}.latest.min.js"

  mynaHtmlSrcMain       = "src/main/myna-html.coffee"
  mynaHtmlDistMain      = "dist/myna-html-#{version}.js"
  mynaHtmlDistMainMin   = "dist/myna-html-#{version}.min.js"
  mynaHtmlDistLatest    = "dist/myna-html-#{series}.latest.js"
  mynaHtmlDistLatestMin = "dist/myna-html-#{series}.latest.min.js"

  testSrcDir            = "src/test/"
  testSrcFiles          = "**/*.coffee"
  testDistDir           = "temp/test/"

  browserifyOptions     =
    watch     : true
    transform : [ 'coffeeify', 'partialify' ]
    keepAlive : false
    browserifyOptions:
      debug      : true    # generate source maps
      extensions : [ '.coffee' ]

  grunt.renameTask "watch", "watchImpl"

  grunt.registerTask "build", [
    "browserify"
    "uglify"
    "copy"
  ]

  grunt.registerTask "default", [
    "build"
    "karma:single:run"
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
        dest    : mynaJsDistMain
        options : browserifyOptions
      mynaHtml:
        src     : mynaHtmlSrcMain
        dest    : mynaHtmlDistMain
        options : browserifyOptions
      test:
        expand  : true
        cwd     : testSrcDir
        src     : testSrcFiles
        dest    : testDistDir
        options : browserifyOptions
        ext     : ".js"

    uglify:
      mynaJsDistMin:     { src: [ mynaJsDistMain      ], dest: mynaJsDistMainMin     }
      mynaHtmlDistMin:   { src: [ mynaHtmlDistMain    ], dest: mynaHtmlDistMainMin   }

    copy:
      mynaJsDistLatest:      { src: [ mynaJsDistMain      ], dest: mynaJsDistLatest      }
      mynaHtmlDistLatest:    { src: [ mynaHtmlDistMain    ], dest: mynaHtmlDistLatest    }
      mynaJsDistLatestMin:   { src: [ mynaJsDistMainMin   ], dest: mynaJsDistLatestMin   }
      mynaHtmlDistLatestMin: { src: [ mynaHtmlDistMainMin ], dest: mynaHtmlDistLatestMin }

    connect:
      jasmineSite:
        options:
          port: jasminePort
          base: "."

    karma:
      single:
        configFile : 'karma.conf.coffee'
        singleRun  : true
      watch:
        configFile : 'karma.conf.coffee'
        background : true
        autoWatch  : false

    watchImpl:
      main:
        files : [ "src/**/*.coffee" ]
        tasks : [ "watchCycle" ]
