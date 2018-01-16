var gulp = require('gulp');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var runsequence = require('run-sequence');
var del = require('del');
var browserify = require('browserify');
var fs = require('fs');
var babel = require('gulp-babel');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');

gulp.task('js', function () {
  return gulp.src([
    './node_modules/bootstrap/dist/js/bootstrap.js',
    './assets/js/content/asideNav.js',
    './assets/js/components/_popup.js',
    './assets/js/components/_carousel.js'
  ])
      .pipe(concat('main.js'))
      .pipe(gulp.dest('./assets/js'));
});

gulp.task('sass-main', function () {
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

gulp.task('sass-styleguide', function () {
  return gulp.src([
    './assets/scss/styleguide.scss'
    //    another sccs files to compile
  ])
      .pipe(sass().on('error', sass.logError))
      .pipe(csso())
      .pipe(cssmin())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('./assets/css'));
});

gulp.task('img', function () {
  return gulp.src([
    './assets/img/*.+(png|jpg|gif|svg|jpeg)'
  ])
      .pipe(gulp.dest('./assets/img'));
});

gulp.task('clean', function () {
  del([
    './assets/css/main.min.css',
    './assets/js/main.js'
  ]);
});

gulp.task('watch', function () {
  var onChange = function (event) {
    console.log('File ' + event.path + ' has been ' + event.type);
  };
  // Watch Sass files
  gulp.watch([
    './assets/scss/*.scss',
    './assets/scss/bootstrap/*.scss',
    './assets/scss/components/*.scss',
    './assets/scss/utilities/*.scss',
    './assets/scss/content/*.scss'
  ], ['sass-main', 'sass-styleguide']).on('change', onChange);
  // another files to watch
  gulp.watch([
    './assets/fonts/*.ttf'
  ], ['fonts']).on('change', onChange);
  gulp.watch([
    './assets/js/components/*.js',
    './assets/js/content/*.js'
  ], ['js']).on('change', onChange);
  gulp.watch([
    '.assets/img/.+(png|jpg|gif|svg|jpeg)'
  ], ['img']).on('change', onChange);
});

gulp.task('build', function (callback) {
  runsequence('clean','sass-styleguide','sass-main','img','js',callback)
});
