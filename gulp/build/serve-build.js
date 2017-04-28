var gulp = require('gulp'),
    config = require('../../gulp.config'),
    argv = require('yargs')
        .count('debug')
        .alias('d', 'debug')
        .argv,
    serve = require('../serve');

gulp.task('serve-build', ['inject'], function() {
    serve(true /*isDev*/);
    // if (argv.debug) {
    // }
});
