'use strict';

const gulp = require('gulp');
const { watch, src, dest } = gulp

const include = require('gulp-web-include');

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
    "./src/html/*.html",
    "./src/html/*/*.html"
  ],
  css: [
    "./src/css/ix.css",
    "./src/css/*/*.css",
    "./src/css/*.css"
  ]
}

function css() {
  const postcss = require('gulp-postcss')

  return src(sources.css[0])
    .pipe(postcss([require("postcss-import"), require('postcss-nested'), require('postcss-mixins'), require('postcss-css-variables'), require('autoprefixer')]))
    .pipe(require('gulp-clean-css')({ compatibility: 'ie8' }))
    .pipe(dest(`${output}/css`))
}

function img() {
  const image = require('gulp-image')
  return src(sources.img[0])
    .pipe(image())
    .pipe(dest(`${output}/img`))
}

function html() {
  return src(sources.html[0])
    .pipe(include('./src/html/'))
    .pipe(require('gulp-htmlmin')({ collapseWhitespace: true }))
    .pipe(dest(output));
}

function js() {
  const babel = require('gulp-babel');
  
  src(sources.js[0])
    .pipe(dest(output))

  return src(sources.js[1])
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(dest(output));
}

exports.default = function () {
  img();
  html();
  css();
  js();
  // JS and JSON
  watch(sources.js[0], js)
  watch(sources.js[1], js)
  // HTML and it's includes
  watch(sources.html[0], html)
  watch(sources.html[1], html)
  // CSS and images
  watch(sources.css[0], css)
  watch(sources.css[1], css)
  watch(sources.css[2], css)
  watch(sources.img[0], img)
}

