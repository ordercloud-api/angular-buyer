var gulp = require('gulp'),
    argv = require('yargs').argv,
    selenium = require('selenium-standalone'),
    config = require('../../gulp.config'),
    browserSync = require('browser-sync'),
    protractor = require("gulp-protractor").protractor;

gulp.task('selenium', function (done) {
    selenium.install({
        drivers: {
            chrome: {
                version: '2.9',
                arch: process.arch,
                baseURL: 'https://chromedriver.storage.googleapis.com'
            }
        },
        logger: function(message) {
            console.log(message);
        }
    }, function (err) {
        if (err) return done(err);

        selenium.start(function (err, child) {
            if (err) return done(err);
            selenium.child = child;
            done();
        });
    });
});

gulp.task('http', ['inject'], function(done) {
    browserSync({
        logLevel: 'silent',
        notify: false,
        open: false,
        port: 9000,
        server: {
            baseDir: [
                config.src + 'app/',
                config.build,
                config.root
            ]
        },
        ui: false
    }, done);
});

gulp.task('test:e2e', ['http'/*, 'selenium'*/], function() {
    return gulp
        .src('./src/**/*.test.js')
        .pipe(protractor({
            configFile: 'protractor.config.js',
            args: [
                '--baseUrl', argv.baseUrl || 'http://localhost:9000',
                '--suite', argv.suite || 'all'
            ]
        }))
        .on('error', function(e) { throw e })
        .once('end', function() {
            browserSync.exit();
            selenium.child.kill();
        });
});
