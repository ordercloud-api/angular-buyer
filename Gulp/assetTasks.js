//GENERAL
var gulp = require('gulp');
var less = require('gulp-less');
var sass = require('gulp-sass');
var filter = require('gulp-filter');
var autoprefixer = require('gulp-autoprefixer');
var minify = require('gulp-minify-css');
var mainBowerFiles = require('main-bower-files');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var plumber = require('gulp-plumber');
var lessImport = require('gulp-less-import');

var pkg = require('../package.json');
var currVersion = pkg.name + "-" + pkg.version;
/*var lessFilter = filter('**!/!*.less');
var sassFilter = filter(['**!/!*.sass', '**!/!*.scss']);
var cssFilter = filter('**!/!*.css');*/


/*BUILD*/

gulp.task('b_m:less', function() {
    return gulp.src(mainBowerFiles({filter: '**/*.less'})
        .concat(config.import_less))
        .pipe(plumber())
        .pipe(lessImport('lessStyles.less'))
        .pipe(less())
        .pipe(gulp.dest(config.temp))
});

gulp.task('b_m:sass', function() {
    return gulp.src(mainBowerFiles({filter: ['**/*.sass', '**/*.scss']})
        .concat([config.source + '**/*.scss', config.source + '**/*.sass']))
        .pipe(plumber())
        .pipe(sass())
        .pipe(concat(config.temp + 'sassStyles.css'))
        .pipe(gulp.dest(config.temp))
});

gulp.task('b_m:css', function() {
    return gulp
        .src(mainBowerFiles({filter: '**/*.css'}))
        .pipe(plumber())
        .pipe(autoprefixer({browsers: ['last 2 versions']}))
        .pipe(concat('bowerStyles.css'))
        .pipe(gulp.dest(config.temp))
});

gulp.task('b_m:appCss', function() {
    return gulp
        .src(config.source + '**/*.css')
        .pipe(plumber())
        .pipe(autoprefixer({browsers: ['last 2 versions']}))
        .pipe(concat('appCss.css'))
        .pipe(gulp.dest(config.temp))
});

gulp.task('b_m:styles', function() {
    return gulp
        .src([config.temp + 'bowerStyles.css', config.temp + 'lessStyles.css', config.temp + 'sassStyles.css', config.temp + 'appCss.css'])
        .pipe(concat(currVersion + '.css'))
        .pipe(gulp.dest(config.build + 'assets'))
        .pipe(browserSync.stream())
});

gulp.task('b_c:styles', function() {
    return gulp.src([config.build + 'assets/**/*.css', config.temp + '**/*' ], {read:false})
        .pipe(clean());
});

gulp.task('b_m:assets', function() {
    return gulp.src([
        config.source + 'assets/**/*',
        '!' + config.source + '**/*.css',
        '!' + config.source + '**/*.less',
        '!' + config.source + '**/*.scss',
        '!' + config.source + '**/*.sass'])
        .pipe(gulp.dest(config.build + 'assets'))
});

gulp.task('b_c:assets', function() {
    return gulp.src([
        config.build + 'assets/**/*',
        '!' + config.build + '**/*.css',
        '!' + config.build + '**/*.less',
        '!' + config.build + '**/*.scss',
        '!' + config.build + '**/*.sass'], {read:false})
        .pipe(clean())
});

/*COMPILE*/
gulp.task('c_m:css', function() {
    return gulp.src(config.build + 'assets/**/*.css')
        .pipe(minify())
        .pipe(gulp.dest(config.compile + 'assets/'));
});

gulp.task('c_c:css', function() {
    return gulp
        .src(config.compile + '**/*.css', {read:false})
        .pipe(clean());
});

gulp.task('c_m:assets', function() {
    return gulp.src([
        config.build + 'assets/**/*',
        '!' + config.build + '**/*.css',
        '!' + config.build + '**/*.less',
        '!' + config.build + '**/*.scss',
        '!' + config.build + '**/*.sass'])
        .pipe(gulp.dest(config.compile + 'assets'))
});

gulp.task('c_c:assets', function() {
    return gulp
        .src([config.compile + 'assets/**/*', '!' + config.compile + 'assets/**/*.css'], {read:false})
        .pipe(clean());
});

//Master Asset Tasks
gulp.task('build:styles', gulp.series('b_c:styles', 'b_m:less', 'b_m:sass', 'b_m:css', 'b_m:appCss', 'b_m:styles'));
gulp.task('compile:css', gulp.series('c_c:css', 'build:styles', 'c_m:css'));
gulp.task('build:assets', gulp.series('b_c:assets', 'b_m:assets'));
gulp.task('compile:assets', gulp.series('c_c:assets', 'build:assets', 'c_m:assets'));