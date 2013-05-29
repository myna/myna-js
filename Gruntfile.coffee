#global module:false
module.exports = (grunt) ->

  pkg = grunt.file.readJSON('package.json')

  licenses = for license in pkg.licenses then license.type

  mynaJsBanner =
    """
    /*! Myna JS v#{pkg.version} - #{grunt.template.today("yyyy-mm-dd")}
     * #{pkg.homepage}
     * Copyright (c) #{grunt.template.today("yyyy")} #{pkg.maintainers[0].name}; Licensed #{licenses.join(", ")}
     */
    """

  mynaHtmlBanner =
    """
    /*! Myna HTML v#{pkg.version} - #{grunt.template.today("yyyy-mm-dd")}
     * #{pkg.homepage}
     * Copyright (c) #{grunt.template.today("yyyy")} #{pkg.maintainers[0].name}; Licensed #{licenses.join(", ")}
     */
    """

  mainSources = (intro, outro) ->
    [
      intro...
      'core.coffee'
      'jsonp.coffee'
      'settings.coffee'
      'cache.coffee'
      'variant.coffee'
      'events.coffee'
      'base-experiment.coffee'
      'experiment.coffee'
      'recorder.coffee'
      'client.coffee'
      outro...
    ]

  testSources = (outro) ->
    [
      'common.coffee'
      'core-spec.coffee'
      'jsonp-spec.coffee'
      'settings-spec.coffee'
      'variant-spec.coffee'
      'experiment-spec.coffee'
      'suggest-spec.coffee'
      'reward-spec.coffee'
      'recorder-spec.coffee'
      'event-spec.coffee'
      outro...
    ]

  mynaJsMainSources   = mainSources [ ], [
    'js-init.coffee'
  ]

  mynaJsTestSources   = testSources [ ], [
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
      mynaHtmlDist:   { src: sources('temp/main', mynaHtmlMainSources, '.js'), dest: mynaHtmlDistMain,   options: { mynaJsBanner } }
      mynaHtmlLatest: { src: sources('temp/main', mynaHtmlMainSources, '.js'), dest: mynaHtmlDistLatest, options: { mynaJsBanner } }

    jshint:
      options: { asi: true, eqnull: true, eqeqeq: false }
      mynaJsMain:   { src: mynaJsDistMain   }
      mynaJsTest:   { src: sources('temp/test', mynaJsTestSources, '.js') }
      mynaHtmlMain: { src: mynaHtmlDistMain }
      mynaHtmlTest: { src: sources('temp/test', mynaHtmlTestSources, '.js') }

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

    uglify:
      mynaJsDist:     { src: [ mynaJsDistMain     ], dest: mynaJsDistMainMin     }
      mynaJsLatest:   { src: [ mynaJsDistLatest   ], dest: mynaJsDistLatestMin   }
      mynaHtmlDist:   { src: [ mynaHtmlDistMain   ], dest: mynaHtmlDistMainMin   }
      mynaHtmlLatest: { src: [ mynaHtmlDistLatest ], dest: mynaHtmlDistLatestMin }

    watch:
      main: { files: sources('src/maintest', mynaJsMainSources, '.coffee'), tasls: [ 'myna-js', 'myna-html' ] }
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

  grunt.registerTask 'default', [
    'myna-js'
    'myna-html'
  ]
