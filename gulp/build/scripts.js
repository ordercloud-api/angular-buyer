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
<<<<<<< HEAD
        '!' + config.build + '**/app.config.js'
=======
        '!' + config.build + '**/app.constants.js'
>>>>>>> 281bb9e29d0e44c929457c755c5b59714e368ee2
    ]);
});

gulp.task('scripts', ['clean:scripts'], function() {
    return gulp
        .src([].concat(
<<<<<<< HEAD
            config.scripts,
            config.components.scripts
=======
            config.scripts
>>>>>>> 281bb9e29d0e44c929457c755c5b59714e368ee2
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
<<<<<<< HEAD
            config.scripts,
            config.components.scripts
=======
            config.scripts
>>>>>>> 281bb9e29d0e44c929457c755c5b59714e368ee2
        ))
        .pipe(cache('jsscripts'))
        .pipe(ngAnnotate())
        .pipe(wrapper(config.wrapper))
        .pipe(beautify({indentSize: config.indentSize}))
        .pipe(gulp.dest(config.build + 'app/'));
});
