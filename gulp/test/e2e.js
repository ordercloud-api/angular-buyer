var gulp = require('gulp'),
<<<<<<< HEAD
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
=======
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
>>>>>>> 281bb9e29d0e44c929457c755c5b59714e368ee2
        });
});
