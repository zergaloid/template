'use strict';

const gulp = require('gulp');
const { watch, series } = gulp

let output = "./public/"
let sources =
{
  js: [
    "./src/*.js"
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
  const image = require('gulp-image')
  const importer = require('gulp-html-import');

  gulp.src('src/*.json')
    .pipe(gulp.dest('public/'))

  gulp.src('src/img/*')
    .pipe(image())
    .pipe(gulp.dest('public/img/'))

  gulp.src('src/img/*.svg')
    .pipe(gulp.dest('public/img/'))

  gulp.src(sources.html[0])
    .pipe(importer('./src/html/'))
    .pipe(gulp.dest(output));

  return gulp.src(sources.html[1])
    .pipe(importer('./src/html/'))
    .pipe(gulp.dest(output));
}

function js() {
  const uglify = require('gulp-uglify')

  return gulp.src(sources.js[0])
    .pipe(uglify())
    .pipe(gulp.dest(output));
}

exports.default = function () {
  watch(sources.js[0], js)
  watch(sources.html[0], html)
  watch(sources.html[1], html)
  watch(sources.css[0], css)
  watch(sources.css[1], css)
}