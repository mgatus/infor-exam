/**
 * main.js
 *
 * This files bundles several tasks from the tasks folder
 *
 */

'use strict';

var gulp = require('gulp'),
  helper = require('../helper');

var config = require('../../chore.config.js');

var autogeneratedFolders = ['sc5-styleguide'];

//////////////////

//clean all but lib folder in www
gulp.task('project:clean', function (done) {
  helper.log('delete all autogenerated files and folders');
  return helper.clean([autogeneratedFolders], done);
});

//clean all but lib folder in www
gulp.task('project:build',['css:compile-optimize'], function (done) {
  helper.log('copy assets.');
  return gulp.src(['./src/assets/star-rating.icons.svg'])
      .pipe(gulp.dest(config.dist+'/images'), done);
});