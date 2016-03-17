var gulp = require('gulp'),
    config = require('../../gulp.config'),
    flatten = require('gulp-flatten'),
    del = require('del');

gulp.task('clean:fonts', function() {
    return del(config.compile + config.appFonts);
});

gulp.task('fonts', ['clean:fonts'], function() {
    return gulp
        .src([].concat(
            config.bowerFiles + '*/fonts/**/*',
            config.src + config.appFonts + '**/*'
        ))
        .pipe(flatten())
        .pipe(gulp.dest(config.compile + config.appFonts))
});
