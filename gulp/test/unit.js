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
        appFiles = gulp.src([].concat(
            config.build + '**/app.js',
            config.build + '**/*.js'
        ), {read: false}),
        specFiles = gulp.src([].concat(
            config.src + '**/*.spec.js',
            config.components.dir + '**/*.spec.js'
        ), {read: false}),
        jasmineFiles = gulp.src([
            './node_modules/jasmine-core/lib/jasmine-core/jasmine.css',
            './node_modules/jasmine-core/lib/jasmine-core/jasmine.js',
            './node_modules/jasmine-core/lib/jasmine-core/jasmine-html.js',
            './node_modules/jasmine-core/lib/jasmine-core/boot.js'
        ], {read:false});

    return target
        .pipe(inject(jasmineFiles, {name: 'jasmine'}))
        .pipe(inject(bowerFiles, {name: 'bower'}))
        .pipe(inject(appFiles))
        .pipe(inject(specFiles, {name: 'spec'}))
        .pipe(gulp.dest('./gulp/test/'));
}

function serveTests() {
    console.log(config.root + config.src.replace('.', '') + 'app/');
    browserSync.init({
        logLevel: 'silent',
        notify: false,
        open: true,
        port: 4520,
        files: [
            config.build + '**/*.js'
        ],
        server: {
            index: 'SpecRunner.html',
            baseDir: [
                config.root,
                config.components.dir + '/../',
                __dirname,
                config.root + config.src.replace('.', '') + 'app/'
            ]
        },
        ui: false
    });
}

module.exports = {
    RunUnitTests: runUnitTests,
    ServeTests: serveTests
};

