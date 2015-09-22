gulp = require('gulp');
mainBowerFiles = require('main-bower-files');
var karma = require('gulp-karma');

var server = 'server.js';
var vendorJS = mainBowerFiles({filter:'**/*.js'});
var vendorCSS = mainBowerFiles({filter:'**/*.css'});

var gulp = require('gulp');
browserSync = require('browser-sync').create();

browserSync.emitter.on('init', function() {
    console.log("Browsersync is running...");
});

gulp.task('dev', function() {
    browserSync.init({
        server: {
            baseDir: config.build,
            index: 'index.html',
            routes: ''
        },
        port: 8000,
        ghostMode: {
            clicks: false,
            forms: false,
            scroll: false
        },
        logPrefix: 'OrderCloud 3.0'
    })
});

gulp.task('karma:unit', function() {
    return gulp.src([config.build + '**/*.spec.js'])
        .pipe(karma({
            configFile:'karma.conf.js',
            action: 'watch'
        }))
});


gulp.task('watch:js', function() {
    console.log("running 'watch:js' task");
    gulp.watch(config.app_files.js, gulp.series('build:js', 'build:styles', 'build:inject', function() {browserSync.reload()}));
    gulp.watch(vendorJS, gulp.series('build:js_bower', 'build:inject', function() {browserSync.reload()}));
});

gulp.task('watch:assets', function() {
    console.log("running 'watch:assets' task");
    gulp.watch(config.app_files.assets, gulp.series('build:assets', 'build:inject', function() {browserSync.reload()}));
    gulp.watch(config.supportedStyles, gulp.series('build:styles'));
});

gulp.task('watch:other', function() {
    console.log("running 'watch:other' task");
    gulp.watch(config.app_files.atpl, gulp.series('build:templateCache', 'build:inject', function() {browserSync.reload()}));
    gulp.watch(config.source + config.index, gulp.series( 'build:inject', function() {browserSync.reload()}));
});

    //TODO: need to add new/deleted file watch if it ever comes available in gulp 4.0


gulp.task('watch', gulp.parallel('dev','watch:js', 'watch:assets', 'watch:other', 'karma:unit'));
