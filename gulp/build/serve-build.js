var gulp = require('gulp'),
    config = require('../../gulp.config'),
    browserSync = require('browser-sync'),
    serve = require('../serve'),
    unit = require('../test/unit'),
    plato = require('../test/plato');

gulp.task('serve-build', ['inject'], function() {
    serve(true /*isDev*/);
    if (argv.debug) {
        unit.RunUnitTests();
        unit.ServeTests();
        plato.GenerateReport(function () {
            plato.OpenReport();
        });
    }
});
