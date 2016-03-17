var gulp = require('gulp'),
    config = require('../../gulp.config'),
    del = require('del'),
    rev = require('gulp-rev'),
    mainBowerFiles = require('main-bower-files'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    ngAnnotate = require('gulp-ng-annotate');

gulp.task('clean:lib-js', function() {
    return del(config.compile + 'js/lib*.js');
});

gulp.task('lib-js', ['clean:lib-js'], function() {
    return gulp
        .src(mainBowerFiles({filter: '**/*.js'}))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(concat('lib.js'))
        .pipe(rev())
        .pipe(gulp.dest(config.compile + 'js'))
});
