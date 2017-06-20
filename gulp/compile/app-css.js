var gulp = require('gulp'),
    config = require('../../gulp.config'),
    rev = require('gulp-rev'),
    concatCss = require('gulp-concat-css'),
    filter = require('gulp-filter'),
    less = require('gulp-less'),
    lessImport = require('gulp-less-import'),
    autoprefixer = require('gulp-autoprefixer'),
    mainBowerFiles = require('main-bower-files'),
    csso = require('gulp-csso');

gulp.task('app-css', [], config.saas.styles ? config.saas.styles.libCss : AppCssFunction);

function AppCssFunction() {
    var lessFilter = filter('**/*.less', {restore: true}),
        cssFilter = filter('**/*.css');

    return gulp
        .src([].concat(
            mainBowerFiles({
                filter: ['**/*.css', '**/*.less'],
                overrides: {
                    'jasny-bootstrap': {
                        main: [
                            './dist/js/jasny-bootstrap.js',
                            './less/jasny-bootstrap.less'
                        ]
                    },
                    'slick-carousel': {
                        main: [
                            'slick/slick.js',
                            'slick/slick.less',
                            'slick/slick-theme.less'
                        ]
                    },
                    'bootswatch': config.checkBootswatchTheme()
                }
            }),
            './src/app/styles/main.less'
        ))
        .pipe(lessFilter)
        .pipe(lessImport('app.less'))
        .pipe(less())
        .pipe(lessFilter.restore)
        .pipe(cssFilter)
        .pipe(autoprefixer(config.autoprefixerSettings))
        .pipe(concatCss('app.css', {rebaseUrls:false}))
        .pipe(csso())
        .pipe(rev())
        .pipe(gulp.dest(config.compile + config.appCss));
}