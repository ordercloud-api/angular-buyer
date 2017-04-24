'use strict';
var config = require('./gulp.config');

var express = require('express'),
    env = process.env.NODE_ENV = process.env.NODE_ENV || 'dev',
    app = express(),
    port = process.env.PORT || 451;

if (config.saas.getAppConfig) {
    app.use(cookieParser());
    app.use(config.saas.getAppConfig());
}

switch(env) {
    case 'production':
        console.log('*** PROD ***');
        app.use(express.static(config.root + config.compile.replace('.', '')));
        app.get('/*', function(req, res) {
            res.sendFile(config.root + config.compile.replace('.', '') + 'index.html');
        });
        break;
    default:
        console.log('*** DEV ***');
        // Host bower_files
        app.use('/bower_files', express.static(config.root + config.bowerFiles.replace('.', '')));
        // Host unminfied javascript files
        app.use(express.static(config.root + config.build.replace('.', '')));
        // Host unchanged html files
        app.use(express.static(config.root + config.src.replace('.', '') + 'app/'));
        app.get('/*', function(req, res) {
            res.sendFile(config.root + config.build.replace('.', '') + 'index.html');
        });
        break;
}

app.listen(port);
console.log('Listening on port ' + port + '...');
