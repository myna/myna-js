#global module:false
module.exports = (grunt) ->

  pkg = grunt.file.readJSON('package.json')

  today    = grunt.template.today("yyyy-mm-dd")
  thisYear = grunt.template.today("yyyy")
  licenses = for license in pkg.licenses then license.type

  mynaJsBanner =
    """
    /*! Myna JS v#{pkg.version} - #{today}
     * #{pkg.homepage}
     * Copyright (c) #{thisYear} Myna Limited; Licensed #{licenses.join(", ")}
     */
    """

  mynaHtmlBanner =
    """
    /*! Myna HTML v#{pkg.version} - #{today}
     * #{pkg.homepage}
     * Copyright (c) #{thisYear} Myna Limited; Licensed #{licenses.join(", ")}
     */
    """

  mynaFullBanner =
    """
    /*! Myna JS Full v#{pkg.version} - #{today}
     * #{pkg.homepage}
     * Copyright (c) #{thisYear} Myna Limited; Licensed #{licenses.join(", ")}
     */
    """

  mainSources = (intro, outro) ->
    [
      intro...
      'core.coffee'
      'logging.coffee'
      'events.coffee'
      'jsonp.coffee'
      'settings.coffee'
      'cache.coffee'
      'variant-summary.coffee'
      'experiment-base.coffee'
      'experiment-summary.coffee'
      'recorder.coffee'
      'client.coffee'
      outro...
    ]

  testSources = (intro, outro) ->
    [
      intro...
      'common.coffee'
      'core-spec.coffee'
      'jsonp-spec.coffee'
      'settings-spec.coffee'
      'variant-summary-spec.coffee'
      'experiment-summary-spec.coffee'
      'suggest-spec.coffee'
      'reward-spec.coffee'
      'recorder-spec.coffee'
      'event-spec.coffee'
      outro...
    ]

  mynaJsMainSources = mainSources [ ], [
    'js-init.coffee'
  ]

  mynaJsTestSources = testSources [ ], [
    'js-init-spec.coffee'
  ]

  mynaHtmlMainSources = mainSources [ 'jquery-1.9.1.js' ], [
    'bind.coffee'
    'toolbar.coffee'
    'html-init.coffee'
  ]

  mynaHtmlTestSources = testSources [ ], [
    'html-init-spec.coffee'
  ]

  mynaFullMainSources = mainSources [ ], [
    'variant.coffee'
    'experiment.coffee'
  ]

  mynaFullTestSources = testSources [ ], [
    'variant-spec.coffee'
    'experiment-spec.coffee'
  ]

  sources = (dir, sources, ext = null) ->
    for source in sources
      filename =
        if ext then source.replace(/[.][a-z]+$/g, ext) else source
      "#{ dir }/#{ filename }"

  mynaJsDistMain      = "dist/myna-#{pkg.version}.js"
  mynaJsDistMainMin   = "dist/myna-#{pkg.version}.min.js"
  mynaJsDistLatest    = "dist/myna-#{pkg.series}.latest.js"
  mynaJsDistLatestMin = "dist/myna-#{pkg.series}.latest.min.js"

  mynaHtmlDistMain      = "dist/myna-html-#{pkg.version}.js"
  mynaHtmlDistMainMin   = "dist/myna-html-#{pkg.version}.min.js"
  mynaHtmlDistLatest    = "dist/myna-html-#{pkg.series}.latest.js"
  mynaHtmlDistLatestMin = "dist/myna-html-#{pkg.series}.latest.min.js"

  mynaFullDistMain      = "dist/myna-full-#{pkg.version}.js"
  mynaFullDistMainMin   = "dist/myna-full-#{pkg.version}.min.js"
  mynaFullDistLatest    = "dist/myna-full-#{pkg.series}.latest.js"
  mynaFullDistLatestMin = "dist/myna-full-#{pkg.series}.latest.min.js"

  # Project configuration.
  grunt.initConfig({
    pkg: pkg
    meta: { mynaJsBanner }

    coffee:
      options: bare: false
      main: { expand: true, cwd: 'src/main/', src: [ '**/*.coffee' ], dest: 'temp/main/', ext: '.js' }
      test: { expand: true, cwd: 'src/test/', src: [ '**/*.coffee' ], dest: 'temp/test/', ext: '.js' }

    copy:
      main: { expand: true, cwd: 'src/main/', src: [ '**/*.js' ], dest: 'temp/main/' }
      test: { expand: true, cwd: 'src/test/', src: [ '**/*.js' ], dest: 'temp/test/' }

    concat:
      mynaJsDist:     { src: sources('temp/main', mynaJsMainSources,   '.js'), dest: mynaJsDistMain,     options: { mynaJsBanner } }
      mynaJsLatest:   { src: sources('temp/main', mynaJsMainSources,   '.js'), dest: mynaJsDistLatest,   options: { mynaJsBanner } }
      mynaHtmlDist:   { src: sources('temp/main', mynaHtmlMainSources, '.js'), dest: mynaHtmlDistMain,   options: { mynaHtmlBanner } }
      mynaHtmlLatest: { src: sources('temp/main', mynaHtmlMainSources, '.js'), dest: mynaHtmlDistLatest, options: { mynaHtmlBanner } }
      mynaFullDist:   { src: sources('temp/main', mynaFullMainSources, '.js'), dest: mynaFullDistMain,   options: { mynaFullBanner } }
      mynaFullLatest: { src: sources('temp/main', mynaFullMainSources, '.js'), dest: mynaFullDistLatest, options: { mynaFullBanner } }

    jshint:
      options: { asi: true, eqnull: true, eqeqeq: false }
      mynaJsMain:   { src: mynaJsDistMain   }
      mynaJsTest:   { src: sources('temp/test', mynaJsTestSources, '.js') }
      mynaHtmlMain: { src: mynaHtmlDistMain }
      mynaHtmlTest: { src: sources('temp/test', mynaHtmlTestSources, '.js') }
      mynaFullMain: { src: mynaFullDistMain }
      mynaFullTest: { src: sources('temp/test', mynaFullTestSources, '.js') }

    jasmine:
      mynaJs:
        src: mynaJsDistMain
        options:
          specs:      sources('temp/test', mynaJsTestSources, '.js')
          outfile:    'myna-js-specrunner.html'
          keepRunner: true
      mynaHtml:
        src: mynaHtmlDistMain
        options:
          specs:      sources('temp/test', mynaHtmlTestSources, '.js')
          outfile:    'myna-html-specrunner.html'
          keepRunner: true
      mynaFull:
        src: mynaFullDistMain
        options:
          specs:      sources('temp/test', mynaFullTestSources, '.js')
          outfile:    'myna-full-specrunner.html'
          keepRunner: true

    uglify:
      mynaJsDist:     { src: [ mynaJsDistMain     ], dest: mynaJsDistMainMin     }
      mynaJsLatest:   { src: [ mynaJsDistLatest   ], dest: mynaJsDistLatestMin   }
      mynaHtmlDist:   { src: [ mynaHtmlDistMain   ], dest: mynaHtmlDistMainMin   }
      mynaHtmlLatest: { src: [ mynaHtmlDistLatest ], dest: mynaHtmlDistLatestMin }
      mynaFullDist:   { src: [ mynaFullDistMain   ], dest: mynaFullDistMainMin   }
      mynaFullLatest: { src: [ mynaFullDistLatest ], dest: mynaFullDistLatestMin }

    watch:
      mynaJs:
        files: sources('src/main', mynaJsMainSources, '.coffee').concat(sources('src/test', mynaJsTestSources, '.coffee'))
        tasks: [ 'myna-js' ]
      mynaHtml:
        files: sources('src/main', mynaHtmlMainSources, '.coffee').concat(sources('src/test', mynaHtmlTestSources, '.coffee'))
        tasks: [ 'myna-html' ]
      mynaFull:
        files: sources('src/main', mynaFullMainSources, '.coffee').concat(sources('src/test', mynaFullTestSources, '.coffee'))
        tasks: [ 'myna-full' ]
  })

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'myna-js', [
    'coffee'
    'copy'
    'concat:mynaJsDist'
    'concat:mynaJsLatest'
    # 'jshint:mynaJsMain'
    # 'jshint:mynaJsTest'
    'jasmine:mynaJs'
    'uglify:mynaJsDist'
    'uglify:mynaJsLatest'
  ]

  grunt.registerTask 'myna-html', [
    'coffee'
    'copy'
    'concat:mynaHtmlDist'
    'concat:mynaHtmlLatest'
    # 'jshint:mynaHtmlMain'
    # 'jshint:mynaHtmlTest'
    'jasmine:mynaHtml'
    'uglify:mynaHtmlDist'
    'uglify:mynaHtmlLatest'
  ]

  grunt.registerTask 'myna-full', [
    'coffee'
    'copy'
    'concat:mynaFullDist'
    'concat:mynaFullLatest'
    # 'jshint:mynaFullMain'
    # 'jshint:mynaFullTest'
    'jasmine:mynaFull'
    'uglify:mynaFullDist'
    'uglify:mynaFullLatest'
  ]

  grunt.registerTask 'default', [
    'myna-js'
    'myna-html'
    'myna-full'
  ]
