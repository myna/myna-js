#global module:false
module.exports = (grunt) ->

  mainSources = [
    'intro.coffee'
    'jsonp.coffee'
    'settings.coffee'
    'cache.coffee'
    'variant.coffee'
    'base-experiment.coffee'
    'experiment.coffee'
    'client.coffee'
    'outro.coffee'
  ]

  testSources = [
    'common.coffee'
    'jsonp-spec.coffee'
    'settings-spec.coffee'
    'variant-spec.coffee'
    'experiment-spec.coffee'
    'suggest-spec.coffee'
    'reward-spec.coffee'
    'record-spec.coffee'
  ]

  sources = (dir, sources, ext = null) ->
    for source in sources
      filename =
        if ext then source.replace(/[.][a-z]+$/g, ext) else source
      "#{ dir }/#{ filename }"

  pkg = grunt.file.readJSON('package.json')

  licenses = for license in pkg.licenses then license.type

  banner =
    """
    /*! #{pkg.title || pkg.name} - v#{pkg.version} - #{grunt.template.today("yyyy-mm-dd")} - #{pkg.homepage}
    * Copyright (c) #{grunt.template.today("yyyy")} #{pkg.maintainers[0].name}; Licensed #{licenses.join(", ")} */
    """

  distMain      = "dist/#{pkg.name}-#{pkg.version}.js"
  distMainMin   = "dist/#{pkg.name}-#{pkg.version}.min.js"
  distLatest    = "dist/#{pkg.name}-#{pkg.series}.latest.js"
  distLatestMin = "dist/#{pkg.name}-#{pkg.series}.latest.min.js"

  # Project configuration.
  grunt.initConfig({
    pkg: pkg
    meta: { banner }
    coffee:
      options: bare: false
      main: { expand: true, cwd: 'src/main/', src: [ '**/*.coffee' ], dest: 'temp/main/', ext: '.js' }
      test: { expand: true, cwd: 'src/test/', src: [ '**/*.coffee' ], dest: 'temp/test/', ext: '.js' }
    copy:
      main: { expand: true, cwd: 'src/main/', src: [ '**/*.js' ], dest: 'temp/main/' }
      test: { expand: true, cwd: 'src/test/', src: [ '**/*.js' ], dest: 'temp/test/' }
    concat:
      options: { banner }
      dist:   { src: sources('temp/main', mainSources, '.js'), dest: distMain }
      latest: { src: sources('temp/main', mainSources, '.js'), dest: distLatest }
    jshint:
      options: { asi: true, eqnull: true, eqeqeq: false }
      main: src: distMain
      test: { src: sources('temp/test', testSources, '.js') }
    jasmine:
      src: distMain
      options:
        specs: sources('temp/test', testSources, '.js')
        helpers: [ 'specs/promise.js' ]
    uglify:
      dist:
        src: [ distMain ]
        dest: distMainMin
      latest:
        src: [ distLatest ]
        dest: distLatestMin
  })

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'package', [
    'coffee'
    'copy'
    'concat'
    # 'jshint'
    'jasmine'
    'uglify'
  ]

  grunt.registerTask 'default', [
    'package'
  ]
