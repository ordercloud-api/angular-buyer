var gulp = require('gulp'),
    config = require('../../gulp.config'),
    cache = require('gulp-cached'),
    del = require('del'),
    filter = require('gulp-filter'),
    inject = require('gulp-inject'),
    wrapper = require('gulp-wrapper'),
    beautify = require('gulp-beautify'),
    ngAnnotate = require('gulp-ng-annotate');

gulp.task('clean:scripts', function() {
    return del([
        config.build + '**/*.js',
        '!' + config.build + '**/app.config.js'
    ]);
});

gulp.task('scripts', ['clean:scripts'], function() {
    return gulp
        .src([].concat(
            config.scripts,
            config.components.scripts
        ))
        .pipe(cache(config.jsCache))
        .pipe(ngAnnotate())
        .pipe(wrapper(config.wrapper))
        .pipe(beautify({indentSize: config.indentSize}))
        .pipe(gulp.dest(config.build + 'app/'));
});

gulp.task('rebuild-scripts', function() {
    return gulp
        .src([].concat(
            config.scripts,
            config.components.scripts
        ))
        .pipe(cache('jsscripts'))
        .pipe(ngAnnotate())
        .pipe(wrapper(config.wrapper))
        .pipe(beautify({indentSize: config.indentSize}))
        .pipe(gulp.dest(config.build + 'app/'));
});
