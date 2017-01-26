var gulp = require('gulp'),
    config = require('../../gulp.config'),
    del = require('del'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    lessImport = require('gulp-less-import'),
    sourcemaps = require('gulp-sourcemaps'),
    filter = require('gulp-filter'),
    concat = require('gulp-concat'),
    mainBowerFiles = require('main-bower-files');

gulp.task('clean:styles', function() {
    return del(config.build + '**/*.css');
});

gulp.task('styles', ['clean:styles'], StylesFunction);

function StylesFunction() {
    var browserSync = require('browser-sync').get('oc-server');
    return gulp
        .src([].concat(
            mainBowerFiles({
                filter: '**/*.less',
                overrides: {
                    'bootswatch': config.checkBootswatchTheme()
                }}),
            './src/app/styles/main.less'
        ))
        .pipe(sourcemaps.init())
        .pipe(lessImport('oc-import.less'))
        .pipe(less())
        .pipe(autoprefixer(config.autoprefixerSettings))
        .pipe(concat('app.css'))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(config.build + config.appCss))
        .pipe(browserSync.stream());
}

module.exports = StylesFunction;