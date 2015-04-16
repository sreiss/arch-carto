'use strict';

var gulp = require('gulp');

gulp.paths = {
  src: 'src',
  dist: '../../server/public',
  tmp: '.tmp',
  e2e: 'e2e'
};

require('require-dir')('./gulp');

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
