var gulp        = require('gulp');
var browserSync = require('browser-sync');

gulp.task('enableWatch', function() {
  require('../util/compile-flags').set('watch', true);
});

gulp.task('browserSync', function() {
  browserSync.init(['dist/**'], {
    port: 8000, // port 8000 instead of the default of 3000
    open: false, // don't automatically open a web browser
    notify: false, // don't flash a reload notification in-page
    server: { baseDir: 'dist' }
  });
});

gulp.task('watch', [ 'enableWatch', 'browserSync', 'build' ], function() {
  gulp.watch('src/app/**/*.less', [ 'less' ]);
  gulp.watch('src/static/**', [ 'copy' ]);
});
