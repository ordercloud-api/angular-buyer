var gulp = require('gulp');
var inject = require('gulp-inject');
var clean = require('gulp-clean');
var pkg = require('../package.json');
var currVersion = pkg.name + "-" + pkg.version;


gulp.task('compile:inject', function() {
    return gulp.src(config.source + 'index.html')
        .pipe(inject(gulp.src(config.compile + '/**/*', {read:false}), {ignorePath: config.compile.replace('.', ''), addRootSlash: false}))
        .pipe(gulp.dest(config.compile));

});

gulp.task('build:inject', function() {
    //task injects dep into index.html
    return gulp
        .src(config.source + 'index.html')
        .pipe(inject(gulp.src([config.build + 'vendor/**/angular.js', config.build + 'vendor/**/*.js'], {read:false}), {name: 'bower', ignorePath: config.build.replace('.', ''), addRootSlash: false}))
        .pipe(inject(gulp.src([
            config.build + 'src/templates-app.js',
            config.build + 'src/app/app.js',
            config.build + '**/*.module.js',
            config.build + '**/*.config.js',
            config.build + '**/*.svc.js',
            config.build + '**/*.ctrl.js',
            config.build + '**/*.js',
            config.build + 'assets/**/*.css',
            "!" + config.build + 'src/**/*.spec.js',
            '!' + config.build + 'vendor/**/*'], {read:false}), {ignorePath: config.build.replace('.', ''), addRootSlash: false}))
        .pipe(gulp.dest(config.build));
});


gulp.task('masterClean', function() {
    return gulp
        .src([config.build, config.compile, config.temp])
        .pipe(clean({read:false}));
});

//Major Project Build Tasks
gulp.task('build', gulp.series(
    'masterClean',
    gulp.parallel('build:js_bower', 'build:js', 'build:templateCache', 'build:styles', 'build:assets'),
    'build:inject'));

//Major Project Compile Tasks
gulp.task('compile', gulp.series(
    'build',
    gulp.parallel('compile:js', 'compile:assets', 'compile:css'),
    'compile:inject'));

gulp.task('default', gulp.series('compile'));