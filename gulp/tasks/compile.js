var _            = require('underscore');
var coffeeify    = require('coffeeify');
var gulp         = require('gulp');
var ngInjector   = require('gulp-angular-injector');
var rename       = require('gulp-rename');
var streamify    = require('gulp-streamify');
var watchify     = require('gulp-watchify');
var uglify       = require('gulp-uglify');
var partialify   = require('partialify');

var pkg          = require('../../package.json');
var compileFlags = require('../util/compile-flags');

var name         = pkg.name;
var version      = pkg.version;
var latest       = pkg.series + '.latest';

var homepage     = pkg.homepage;
var maintainer   = pkg.maintainers[0].name;
var license      = _.pluck(pkg.licenses, 'type').join(", ")
var today        = "yyyy-mm-dd"
var thisYear     = "yyyy"

function srcPath(library) {
  return 'src/app/' + library + '.coffee';
}

function desPath(library, version, minified) {
  if(library == 'myna-js') {
    return 'myna-' + version + (minified ? '.min.js' : '.js');
  } else {
    return library + '-' + version + (minified ? '.min.js' : '.js');
  }
}

function createBrowserifyTask(src, des) {
  return watchify(function(bundle) {
    console.log('browserifyTask ' + src + ' ' + des);

    return gulp
      .src(src)
      .pipe(bundle({
        watch     : compileFlags.get('watch'),
        fullPaths : false,         // preserve module path names
        debug     : true,          // generate source maps
        extensions: [ '.coffee' ], // allow requires without .coffee extension
        setup     : function(bundle) {
          bundle.transform(coffeeify);
          bundle.transform(partialify);
        }
      }))
      .pipe(rename(des))                // must come before ngInjector
      .pipe(streamify(ngInjector({ token: '$DI' })))
      .pipe(gulp.dest('dist'));
  });
}

function createCopyTask(src, des, minify) {
  minify = minify || false;

  return function() {
    console.log('copyTask ' + src + ' ' + des + ' ' + minify);

    if(minify) {
      return gulp
        .src(src)
        .pipe(rename(des))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest('dist'));
    } else {
      return gulp
        .src(src)
        .pipe(rename(des))
        .pipe(gulp.dest('dist'));
    }
  };
}

function registerCompileTasks(library) {
  gulp.task('compile-' + library,
    createBrowserifyTask(
      srcPath(library),
      desPath(library, version, false)));

  gulp.task('compile-' + library + '-latest',
    [ 'compile-' + library ],
    createCopyTask(
      desPath(library, version, false),
      desPath(library, latest, false)));

  gulp.task('compile-' + library + '-min',
    [ 'compile-' + library ],
    createCopyTask(
      desPath(library, version, false),
      desPath(library, version, true),
      true));

  gulp.task('compile-' + library + '-latest-min',
    [ 'compile-' + library + '-min' ],
    createCopyTask(
      desPath(library, version, true),
      desPath(library, latest, true)));
}

registerCompileTasks('myna-js');
registerCompileTasks('myna-html');

gulp.task('compile', [
  'compile-myna-js',
  'compile-myna-js-min',
  'compile-myna-js-latest',
  'compile-myna-js-latest-min',
  'compile-myna-html',
  'compile-myna-html-min',
  'compile-myna-html-latest',
  'compile-myna-html-latest-min'
]);