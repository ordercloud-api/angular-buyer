var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    argv = require('yargs').argv,
    config = require('../../gulp.config'),
    protractor = require("gulp-protractor").protractor;

gulp.task('start-localhost', ['inject'], function() {
	browserSync.init({
        server: {
            baseDir: [
                config.root + config.build.replace('.', ''),
                config.root + config.src.replace('.', '') + 'app/'
            ],
            routes: {
                '/bower_files': config.root + config.bowerFiles.replace('.', '')
            }
        },
        open: false
    });
});

gulp.task('test:e2e', ['start-localhost'], function() {
	gulp.src([config.src + '**/*.test.js'])
        .pipe(protractor({
            configFile: config.root + '/protractor.conf.js',
            args: [
                '--suite', argv.suite || 'all'
            ]
        }))
        .on('end', browserSync.exit)
        .on('error', function (e) {
            throw e;
        });
});
