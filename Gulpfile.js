'use strict';

const gulp = require('gulp');
const { watch, series } = gulp

let output = "./public/"
let sources =
{
  coffee: [
    "./src/*.coffee"
  ],
  html: [
    "./src/html/*.html",
    "./src/html/*/*.html"
  ],
  css: [
    "./src/css/*.css",
    "./src/css/*/*.css"
  ]
}

function css() {
  const postcss = require('gulp-postcss')

   gulp.src(sources.css[0])
  .pipe(postcss([require('autoprefixer'), require('postcss-nested')]))
  .pipe(gulp.dest('./public/css'))

  return gulp.src(sources.css[1])
    .pipe(postcss([require('autoprefixer'), require('postcss-nested')]))
    .pipe(gulp.dest('./public/css'))
}

function html() {
  const webp = require('gulp-webp')
  const importer = require('gulp-html-import');

  gulp.src('src/img/*.png')
  .pipe(webp())
  .pipe(gulp.dest('public/img/'))

  gulp.src(sources.html[0])
    .pipe(importer('./src/html/'))
    .pipe(gulp.dest(output));

  return gulp.src(sources.html[1])
    .pipe(importer('./src/html/'))
    .pipe(gulp.dest(output));
}

function coffee() {
  const browserify = require('browserify')
  const uglify = require('gulp-uglify')

  const through = require('through2')
  const source = require('vinyl-source-stream')
  const buffer = require('vinyl-buffer')
  const globby = require('globby')

  gulp.src(sources.coffee[0])
    .pipe(require('gulp-coffee')({ bare: true }))
    .pipe(gulp.dest(output));

  var stream = through()

  stream
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./public/js/'))

  globby(["./public/*.js"]).then((files) => {
    let b = browserify({
      entries: files,
      debug: true
    });

    b.bundle().pipe(stream);
  }).catch((e) => {
    stream.emit('error', e)
  })
  return stream;
}

exports.default = function () {
  watch(sources.coffee[0], coffee)
  watch(sources.html[0], html)
  watch(sources.html[1], html)
  watch(sources.css[0], css)
  watch(sources.css[1], css)
}