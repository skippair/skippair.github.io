var gulp = require('gulp');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var runsequence = require('run-sequence');

/*
gulp.task('js', function () {
  return gulp.src([
    './node_modules/bootstrap/js/src/index.js'
  ])
      .pipe(gulp.dest('./assets/js/bootstrap'));
});
*/

gulp.task('sass', function () {
  return gulp.src([
    './assets/scss/main.scss'
  //    another sccs files to compile
  ])
      .pipe(sass().on('error', sass.logError))
      .pipe(csso())
      .pipe(cssmin())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('./assets/css'));
});

gulp.task('watch', function () {
  var onChange = function (event) {
    console.log('File ' + event.path + ' has been ' + event.type);
  };
  // Watch Sass files
  gulp.watch([
    './assets/scss/*.scss'
  ], ['sass']).on('change', onChange);
  // another files to watch
});

gulp.task('build', function(callback) {
  runsequence('sass', callback)
});