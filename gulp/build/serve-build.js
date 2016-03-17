var gulp = require('gulp'),
    config = require('../../gulp.config'),
    browserSync = require('browser-sync'),
    argv = require('yargs')
        .count('debug')
        .alias('d', 'debug')
        .argv,
    serve = require('../serve'),
    unit = require('../test/unit'),
    plato = require('../test/plato');

gulp.task('serve-build', ['inject'], function() {
    gulp.watch(config.src + '**/*.html')
        .on('change', browserSync.reload);
    gulp.watch(config.scripts, ['rebuild-scripts', 'report'])
        .on('change', browserSync.reload);
    gulp.watch(config.styles, ['styles']);
    if (argv.debug) {
        unit.RunUnitTests();
        unit.ServeTests();
        plato.GenerateReport(function () {
            plato.OpenReport();
        });
    }
    serve(true /*isDev*/);
});
