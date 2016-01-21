gulp = require('gulp');
mainBowerFiles = require('main-bower-files');

var server = 'server.js';
var vendorJS = mainBowerFiles({filter:'**/*.js'});
var Server = require('karma').Server;

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

gulp.task('test', function(done) {
    new Server({
        configFile: __dirname + '/../karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('watch:js', function() {
    console.log("running 'watch:js' task");
    gulp.watch(config.app_files.js, gulp.parallel(gulp.series('build:js', 'build:assets', 'build:styles', 'build:inject', function() {browserSync.reload()})));
    gulp.watch(vendorJS, gulp.series('build:js_bower', 'build:inject', function() {browserSync.reload()}));
});

gulp.task('watch:assets', function() {
    console.log("running 'watch:assets' task");
    gulp.watch(config.app_files.assets, gulp.series('build:assets', 'build:inject', function() {browserSync.reload()}));
    gulp.watch(config.supportedStyles, gulp.series('build:styles'));
});

gulp.task('watch:other', function() {
    console.log("running 'watch:other' task");
    gulp.watch(config.app_files.atpl, gulp.series('build:templateCache', 'build:assets', 'build:inject', function() {browserSync.reload()}));
    gulp.watch(config.source + config.index, gulp.series( 'build:inject', function() {browserSync.reload()}));
});

    //TODO: need to add new/deleted file watch if it ever comes available in gulp 4.0


gulp.task('watch', gulp.parallel('dev', 'watch:js', 'watch:assets', 'watch:other'));
