var gulp = require('gulp'),
    serve = require('../serve');

gulp.task('serve-compile', ['index'], function() {
    serve(false /*isDev*/);
});
