'use strict';

const browserify = require('browserify')
const uglify = require('gulp-uglify')

const gulp = require('gulp');
const { watch, series } = gulp

const through = require('through2')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const globby = require('globby')

let output = "./public/"
let sources =
{
  coffee: [
    "./src/*.coffee"
  ],
  html: [
    "./src/html/*.html"
  ]
}

function html() {
  gulp.src(sources.html[0])
    .pipe(gulp.dest(output));
}

function coffee() {
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
}