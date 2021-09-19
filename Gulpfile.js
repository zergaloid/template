'use strict';

const gulp = require('gulp');
const { watch, src, dest } = gulp

let output = "./public/"
let sources =
{
  img: [
    "./src/img/*"
  ],
  js: [
    "./src/*.json",
    "./src/*.js"
  ],
  html: [
    "./src/html/*/*.html",
    "./src/html/*.html"
  ],
  css: [
    "./src/css/*.css",
    "./src/css/*/*.css"
  ]
}

function css() {
  const postcss = require('gulp-postcss')
  src(sources.css[0])
    .pipe(postcss([require('autoprefixer'), require('postcss-nested')]))
    .pipe(dest(`${output}/css`))

  return src(sources.css[1])
    .pipe(postcss([require('autoprefixer'), require('postcss-nested')]))
    .pipe(dest(`${output}/css`))
}

function img() {
  const image = require('gulp-image')
  return src(sources.img[0])
    .pipe(image())
    .pipe(dest(`${output}/img`))
}

function html() {
  const importer = require('gulp-web-include');
  
  src(sources.html[0])
    .pipe(importer('./src/html/', "html"))
    .pipe(dest(output));

  return src(sources.html[1])
    .pipe(importer('./src/html/', "html"))
    .pipe(dest(output));
}

function js() {
  const uglify = require('gulp-uglify')

  src(sources.js[0])
    .pipe(dest(output))

  return src(sources.js[1])
    .pipe(uglify())
    .pipe(dest(output));
}

exports.default = function () {
  img();
  // JS and JSON
  watch(sources.js[0], js)
  watch(sources.js[1], js)
  // HTML and it's includes
  watch(sources.html[0], html)
  watch(sources.html[1], html)
  // CSS and images
  watch(sources.css[0], css)
  watch(sources.css[1], css)
  watch(sources.img[0], img)
}
