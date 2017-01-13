var gulp = require('gulp'),
    del = require('del'),
    config = require('../../gulp.config'),
    ngConstant = require('gulp-ng-constant');

gulp.task('clean:app-config', function() {
    return del(config.build + '**/app.constants.js');
});

gulp.task('app-config', ['clean:app-config'], function() {
    return gulp
        .src(config.src + '**/app.constants.json')
        .pipe(ngConstant(config.ngConstantSettings))
        .pipe(gulp.dest(config.build));
});
