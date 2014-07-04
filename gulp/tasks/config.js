var argv         = require('yargs').argv;
var gulp         = require('gulp');
var gutil        = require('gulp-util');

var compileFlags = require('../util/compile-flags');

gulp.task('config', function() {
  console.log('config');
  compileFlags.set('minify', !!argv.minify);
  gutil.log('Minify flag set to ' + compileFlags.get('minify'));
});
