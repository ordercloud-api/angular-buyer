var gulp = require('gulp'),
    config = require('../../gulp.config'),
    del = require('del'),
    ngAnnotate = require('gulp-ng-annotate'),
    ngConstant = require('gulp-ng-constant'),
    rev = require('gulp-rev'),
    concat = require('gulp-concat'),
    filter = require('gulp-filter'),
    templateCache = require('gulp-angular-templatecache'),
    uglify = require('gulp-uglify'),
    fileSort = require('gulp-angular-filesort'),
    wrapper = require('gulp-wrapper');

gulp.task('clean:app-js', function() {
    return del(config.compile + 'js/app*.js');
});

gulp.task('app-js', ['clean:app-js'], function() {
    var htmlFilter = filter('**/*.html', {restore: true}),
        jsonFilter = filter('**/*.json', {restore: true}),
        jsFilter = filter('**/*.js');

    return gulp
        .src([].concat(
            config.scripts,
            config.templates,
            config.src + '**/app.constants.json'
        ))
        .pipe(jsonFilter)
        .pipe(ngConstant(config.ngConstantSettings))
        .pipe(jsonFilter.restore)
        .pipe(htmlFilter)
        .pipe(templateCache(config.templateCacheSettings))
        .pipe(htmlFilter.restore)
        .pipe(jsFilter)
        .pipe(fileSort())
        .pipe(wrapper(config.wrapper))
        .pipe(ngAnnotate())
        .pipe(concat('app.module.js'))
        .pipe(concat('app.config.js'))
        .pipe(concat('app.run.js'))
        .pipe(concat('app.controller.js'))
        .pipe(rev())
        .pipe(uglify({mangle:false})) //turning off mangle to fix the compile error
        .pipe(gulp.dest(config.compile + 'js/'));
});
