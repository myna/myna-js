var exec = require('child_process').exec;

/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.maintainers[0].name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    lint: {
      files: ['grunt.js', 'lib/**/*.js', 'spec/**/*.js']
    },
    jasmine: {
      files: ['spec/**/*.html']
    },
    coffee: {
      app: {
        src: [ 'src/*.coffee' ],
        dest: 'temp',
        options: { bare: true }
      }
    },
    concat: {
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
        dest: 'dist/<%= pkg.name %>-<%= pkg.series %>.latest.js'
      }
    },
    min: {
      dist: {
        src: ['dist/<%= pkg.name %>-<%= pkg.version %>.js'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js'
      },
      latest: {
        src: ['dist/<%= pkg.name %>-<%= pkg.series %>.latest.js'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.series %>.latest.min.js'
      }
    },
    jasmine: {
      all: {
        src:['specs/specrunner.html'],
        errorReporting: true
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {}
    },
    uglify: {}
  });

  grunt.loadNpmTasks('grunt-coffee');
  grunt.loadNpmTasks('grunt-jasmine-task');

  grunt.registerTask('package', 'coffee concat jasmine min')
  grunt.registerTask('default', 'package');
};
