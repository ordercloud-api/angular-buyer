var source = './src/',
    assets = 'assets/',
    build = './build/',
    bowerFiles = './bower_components/',
    npmFiles = './node_modules',
    compile = './compile/',
    index = 'index.html',
    gulp_dir = './gulp/';

module.exports = {
    bowerFiles: bowerFiles,
    npmFiles: npmFiles,
    src: source,
    build: build,
    compile: compile,
    assets: assets,
    appCss: assets + 'styles/',
    appFonts: assets + 'fonts/',
    appImages: assets + 'images',
    root: __dirname,
    gulp: gulp_dir,
    index: source + index,
    styles: [
        source + '**/*.css',
        source + '**/*.less'
    ],
    templates: [
        '!' + source + index,
        source + 'app/**/*.html'
    ],
    scripts: [
        source + '**/*.js',
        '!' + source + '**/*.spec.js',
        '!' + source + '**/*.test.js'
    ],
    appFiles: [
        build + '**/*.js',
        build + '**/*.css',
        source + '**/*.css'
    ],
    wrapper: {
        header: '(function() {\n"use strict";\n',
        footer: '}());'
    },
    templateCacheSettings: {
        standalone: false,
        moduleSystem: 'IIFE',
        module: 'orderCloud'
    },
    autoprefixerSettings: {
        browsers: ['last 2 versions'],
        cascade: true
    },
    jsCache: 'jsscripts',
    indentSize: 4
};
