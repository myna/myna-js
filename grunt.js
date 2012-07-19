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
    concat: {
      dist: {
        src: ['<banner:meta.banner>', 'lib/myna.js'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js'
      },
      latest: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.series %>-latest.min.js'
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

  // Custom tasks
  grunt.registerTask('compile', 'Compile Myna library', function() {
    var done = this.async();
    exec('cake compile-lib', function(err, stdout, stderr) {
      grunt.log.writeln("Compiling Myna library")
      if(err) {
        grunt.log.error(err);
        throw err;
      } else {
        grunt.log.writeln('Myna library compiled')
        done();
      }
    })
  })


  grunt.registerTask('test', 'Run tests', function() {
    var done = this.async();
    exec('cake compile-bare', function(err, stdout, stderr) {
      grunt.log.writeln("Compiling bare Myna library")
      if(err) {
        grunt.log.error(err);
        throw err;
      } else {
        grunt.log.writeln('Myna bare library compiled')
        grunt.task.run('jasmine')
        done();
      }
    })
  })

  grunt.registerTask('package', 'compile test concat min')

  // Default task.
  grunt.registerTask('default', 'package');

  // Load Jasmine integration
  grunt.loadNpmTasks('grunt-jasmine-task');
};
