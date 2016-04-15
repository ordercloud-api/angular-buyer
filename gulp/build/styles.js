var gulp = require('gulp'),
    config = require('../../gulp.config'),
    browserSync = require('browser-sync').get('oc-server'),
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

gulp.task('styles', ['clean:styles'], function() {
    return gulp
        .src([].concat(
            mainBowerFiles({filter: '**/*.less'}),
            config.src + '**/*.less',
            config.components.styles.less
        ))
        .pipe(sourcemaps.init())
        .pipe(lessImport('oc-import.less'))
        .pipe(less())
        .pipe(autoprefixer(config.autoprefixerSettings))
        .pipe(concat('app.css'))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(config.build + config.appCss))
        .pipe(browserSync.stream());
});
