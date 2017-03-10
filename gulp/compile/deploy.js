var gulp = require('gulp'),
    ghPages = require('gulp-gh-pages'),
    htmlReplace = require('gulp-html-replace'),
    repoName = require('git-repo-name'),
    config = require('../../gulp.config');

gulp.task('deploy', ['href'], function() {
    return gulp.src(config.compile + "**/*")
        .pipe(ghPages({
            force: true
        }))
});

gulp.task('href', ['index'], function() {
    return gulp.src(config.compile + 'index.html')
        .pipe(htmlReplace({
            'href': {
                src: repoName.sync(),
                tpl: '<base href="/%s/" />'
            }
        }))
        .pipe(gulp.dest(config.compile))
});