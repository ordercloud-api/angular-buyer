'use strict';

var requireDir = require('require-dir'),
    gulp = require('gulp');

requireDir('./gulp', {recurse: true});

gulp.task('build', ['serve-build']);
gulp.task('compile', ['serve-compile']);

gulp.task('default', ['inject', 'index']);
