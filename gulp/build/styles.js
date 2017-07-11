var gulp = require('gulp'),
    config = require('../../gulp.config'),
    del = require('del'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    lessImport = require('gulp-less-import'),
    sourcemaps = require('gulp-sourcemaps'),
    concatCss = require('gulp-concat-css'),
    mainBowerFiles = require('main-bower-files');

gulp.task('clean:styles', function() {
    return del([config.build + '**/*.css', config.compile + '**/*.css']);
});

gulp.task('styles', ['clean:styles'], config.saas.styles ? config.saas.styles.libLess : StylesFunction);

function StylesFunction() {
    var browserSync = require('browser-sync').get('oc-server');
    return gulp
        .src([].concat(
            mainBowerFiles({
                filter: '**/*.less',
                overrides: {
                    'jasny-bootstrap': {
                        main: [
                            './less/jasny-bootstrap.less'
                        ]
                    },
                    'slick-carousel': {
                        main: [
                            'slick/slick.less',
                            'slick/slick-theme.less'
                        ]
                    },
                    'bootswatch': config.checkBootswatchTheme()
                }}),
            './src/app/styles/main.less'
        ))
        .pipe(sourcemaps.init())
        .pipe(lessImport('oc-import.less'))
        .pipe(less())
        .pipe(autoprefixer(config.autoprefixerSettings))
        .pipe(concatCss('app.css', {rebaseUrls:false}))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(config.build + config.appCss))
        .pipe(browserSync.stream());
}

module.exports = StylesFunction;