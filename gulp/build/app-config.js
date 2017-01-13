var gulp = require('gulp'),
    del = require('del'),
    config = require('../../gulp.config'),
    ngConstant = require('gulp-ng-constant');

gulp.task('clean:app-config', function() {
<<<<<<< HEAD
    return del(config.build + '**/app.config.js');
=======
    return del(config.build + '**/app.constants.js');
>>>>>>> 281bb9e29d0e44c929457c755c5b59714e368ee2
});

gulp.task('app-config', ['clean:app-config'], function() {
    return gulp
<<<<<<< HEAD
        .src(config.src + '**/app.config.json')
=======
        .src(config.src + '**/app.constants.json')
>>>>>>> 281bb9e29d0e44c929457c755c5b59714e368ee2
        .pipe(ngConstant(config.ngConstantSettings))
        .pipe(gulp.dest(config.build));
});
