var gulp = require('gulp'),
    inject = require('gulp-inject'),
    browserSync = require('browser-sync').create(),
    config = require('../../gulp.config'),
    mainBowerFiles = require('main-bower-files');

gulp.task('test:unit', ['scripts', 'app-config'], function() {
    runUnitTests();
    serveTests();
});

function runUnitTests() {
    var target = gulp.src('./gulp/test/SpecRunner.html'),
        bowerFiles = gulp.src(mainBowerFiles({includeDev: true, filter: '**/*.js'}), {read: false}),
        appFiles = gulp.src([config.build + '**/app.js', config.build + '**/*.js'], {read: false}),
        specFiles = gulp.src(config.src + '**/*.spec.js', {read: false}),
        jasmineFiles = gulp.src([
            './node_modules/jasmine-core/lib/jasmine-core/jasmine.css',
            './node_modules/jasmine-core/lib/jasmine-core/jasmine.js',
            './node_modules/jasmine-core/lib/jasmine-core/jasmine-html.js',
            './node_modules/jasmine-core/lib/jasmine-core/boot.js'
        ], {read:false});

    return target
        .pipe(inject(jasmineFiles, {name: 'jasmine', relative: true}))
        .pipe(inject(bowerFiles, {name: 'bower', relative: true}))
        .pipe(inject(appFiles, {relative: true}))
        .pipe(inject(specFiles, {name: 'spec', relative: true}))
        .pipe(gulp.dest('./gulp/test/'));
}

function serveTests() {
    browserSync.init({
        logLevel: 'silent',
        notify: false,
        open: true,
        port: 452,
        files: [
            config.build + '**/*.js'
        ],
        server: {
            index: 'SpecRunner.html',
            baseDir: [
                __dirname,
                __dirname + '/../../'
            ]
        },
        ui: false
    });
}

module.exports = {
    RunUnitTests: runUnitTests,
    ServeTests: serveTests
};

