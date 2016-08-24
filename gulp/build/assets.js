var gulp = require('gulp'),
    config = require('../../gulp.config'),
    del = require('del');

gulp.task('clean:assets', function() {
    return del(config.build + config.appImages);
});

gulp.task('assets', ['clean:assets'], function() {
    return gulp
        .src(config.src + config.appImages + '**/*')
        .pipe(gulp.dest(config.build + config.appImages));
});
