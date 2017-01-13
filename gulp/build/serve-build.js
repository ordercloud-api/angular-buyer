var gulp = require('gulp'),
    config = require('../../gulp.config'),
<<<<<<< HEAD
    browserSync = require('browser-sync'),
=======
>>>>>>> 281bb9e29d0e44c929457c755c5b59714e368ee2
    argv = require('yargs')
        .count('debug')
        .alias('d', 'debug')
        .argv,
<<<<<<< HEAD
    serve = require('../serve'),
    unit = require('../test/unit'),
    plato = require('../test/plato');
=======
    serve = require('../serve');
>>>>>>> 281bb9e29d0e44c929457c755c5b59714e368ee2

gulp.task('serve-build', ['inject'], function() {
    serve(true /*isDev*/);
    if (argv.debug) {
<<<<<<< HEAD
        unit.RunUnitTests();
        unit.ServeTests();
        plato.GenerateReport(function () {
            plato.OpenReport();
        });
=======
>>>>>>> 281bb9e29d0e44c929457c755c5b59714e368ee2
    }
});
