#global module:false
module.exports = (grunt) ->
  # Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.maintainers[0].name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    jasmine: {
      src: 'dist/<%= pkg.name %>-<%= pkg.version %>.js',
      options: {
        specs: ['specs/**/*-spec.js']
      }
    },
    coffee: {
      options: { bare: true }
      files: {
        expand: true
        cwd:    'src/'
        src:    [ '**/*.coffee' ]
        dest:   'temp/'
        ext:    '.js'
      }
    },
    concat: {
      options: {
        banner: '<%= meta.banner %>'
      }
      dist: {
        src: [
          '<banner:meta.banner>',
          'temp/myna.js',
          'temp/intro.js',
          'temp/log.js',
          'temp/util.js',
          'temp/config.js',
          'temp/cookie.js',
          'temp/jsonp.js',
          'temp/experiment.js',
          'temp/suggestion.js',
          'temp/outro.js'
        ],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js'
      },
      latest: {
        banner: '<%= meta.banner %>'
        src: [
          'temp/myna.js',
          'temp/intro.js',
          'temp/log.js',
          'temp/util.js',
          'temp/config.js',
          'temp/cookie.js',
          'temp/jsonp.js',
          'temp/experiment.js',
          'temp/suggestion.js',
          'temp/outro.js'
        ],
        dest: 'dist/<%= pkg.name %>-<%= pkg.series %>.latest.js'
      }
    },
    uglify: {
      dist: {
        src: ['dist/<%= pkg.name %>-<%= pkg.version %>.js'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js'
      },
      latest: {
        src: ['dist/<%= pkg.name %>-<%= pkg.series %>.latest.js'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.series %>.latest.min.js'
      }
    },
  })

  grunt.loadNpmTasks("grunt-contrib-concat")
  grunt.loadNpmTasks("grunt-contrib-uglify")
  grunt.loadNpmTasks("grunt-contrib-watch")
  grunt.loadNpmTasks("grunt-contrib-jasmine")
  grunt.loadNpmTasks("grunt-contrib-coffee")

  grunt.registerTask('package', ['coffee', 'concat', 'jasmine', 'uglify'])
  grunt.registerTask('default', 'package');

