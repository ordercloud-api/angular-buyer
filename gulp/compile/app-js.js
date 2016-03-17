var gulp = require('gulp'),
    config = require('../../gulp.config'),
    del = require('del'),
    ngAnnotate = require('gulp-ng-annotate'),
    rev = require('gulp-rev'),
    concat = require('gulp-concat'),
    filter = require('gulp-filter'),
    templateCache = require('gulp-angular-templatecache'),
    htmlmin = require('gulp-htmlmin'),
    uglify = require('gulp-uglify'),
    wrapper = require('gulp-wrapper');

gulp.task('clean:app-js', function() {
    return del(config.compile + 'js/app*.js');
});

gulp.task('app-js', ['clean:app-js'], function() {
    var htmlFilter = filter('**/*.html', {restore: true}),
        jsFilter = filter('**/*.js');

    return gulp
        .src([].concat(
            config.scripts,
            config.templates
        ))
        .pipe(htmlFilter)
        .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(templateCache(config.templateCacheSettings))
        .pipe(htmlFilter.restore)
        .pipe(jsFilter)
        .pipe(wrapper(config.wrapper))
        .pipe(ngAnnotate())
        .pipe(concat('app.js'))
        .pipe(rev())
        .pipe(uglify())
        .pipe(gulp.dest(config.compile + 'js/'))
});
