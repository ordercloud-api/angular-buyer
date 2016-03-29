var source = './src/',
    assets = 'assets/',
    components = './../components-development-submodule/',
    build = './build/',
    bowerFiles = './bower_components/',
    npmFiles = './node_modules',
    compile = './compile/',
    index = 'index.html',
    root = __dirname,
    gulp_dir = './gulp/',
    fs = require('fs');

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
    root: root,
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
        source + 'app/**/*.js',
        '!' + source + '**/*.spec.js',
        '!' + source + '**/*.test.js'
    ],
    components: {
        dir: components,
        scripts: [
            components + '**/*.js',
            '!' + components + '**/*.spec.js',
            '!' + components + '**/*.test.js'
        ],
        templates: components + '**/*.html',
        styles: {
            less: components + '**/*.less',
            css: components + '**/*.css'
        }
    },
    appFiles: [
        build + '**/app.js',
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
    ngConstantSettings: {
        name: 'orderCloud',
        deps: false,
        constants: getConstants()
    },
    autoprefixerSettings: {
        browsers: ['last 2 versions'],
        cascade: true
    },
    jsCache: 'jsscripts',
    indentSize: 4
};

function getConstants() {
    var result = {};
    var constants = JSON.parse(fs.readFileSync(source + 'app/app.config.json'));
    var environment = process.env.environment || constants.environment;
    switch (environment) {
        case 'local':
            result.authurl = 'http://core.four51.com:11629/oauth/token';
            result.apiurl = 'http://core.four51.com:9002';
            break;
        case 'test':
            result.authurl = 'https://testauth.ordercloud.io/oauth/token';
            result.apiurl = 'https://testapi.ordercloud.io';
            break;
        case 'qa':
            result.authurl = 'https://qaauth.ordercloud.io/oauth/token';
            result.apiurl = 'https://qaapi.ordercloud.io';
            break;
        default:
            result.authurl = 'https://auth.ordercloud.io/oauth/token';
            result.apiurl = 'https://api.ordercloud.io';
            break;
    }
    if (process.env.apiurl && process.env.authurl) {
        result.authurl = process.env.authurl;
        result.apiurl = process.env.apiurl;
    }
    else if (!environment && !process.env.apiurl && !process.env.authurl) {
        result.authurl = 'https://auth.ordercloud.io/oauth/token';
        result.apiurl = 'https://api.ordercloud.io';
    }
    if (process.env.clientid) result.clientid = process.env.clientid;
    if (process.env.appname) result.appname = process.env.appname;
    if (process.env.ocscope) result.ocscope = process.env.ocscope;
    if (process.env.buyerid) result.buyerid = process.env.buyerid;
    return result;
}
