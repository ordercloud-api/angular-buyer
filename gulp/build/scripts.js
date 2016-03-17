var gulp = require('gulp'),
    config = require('../../gulp.config'),
    cache = require('gulp-cached'),
    del = require('del'),
    inject = require('gulp-inject'),
    wrapper = require('gulp-wrapper'),
    beautify = require('gulp-beautify'),
    ngAnnotate = require('gulp-ng-annotate');

gulp.task('clean:scripts', function() {
    return del(config.build + '**/*.js');
});

gulp.task('scripts', ['clean:scripts'], function() {
    return gulp
        .src(config.scripts)
        .pipe(cache(config.jsCache))
        .pipe(ngAnnotate())
        .pipe(wrapper(config.wrapper))
        .pipe(beautify({indentSize: config.indentSize}))
        .pipe(gulp.dest(config.build));
});

gulp.task('rebuild-scripts', function() {
    return gulp
        .src(config.scripts)
        .pipe(cache('jsscripts'))
        .pipe(ngAnnotate())
        .pipe(wrapper(config.wrapper))
        .pipe(beautify({indentSize: config.indentSize}))
        .pipe(gulp.dest(config.build));
});
