'use strict';
var config = require('./gulp.config');

var express = require('express'),
    env = process.env.NODE_ENV = process.env.NODE_ENV || config.build,
    app = express(),
    port = process.env.PORT || 451;

switch(env) {
    case 'prod':
        console.log('*** PROD ***');
        app.use(express.static(config.root + config.compile.replace('.', '')));
        app.get('/*', function(req, res) {
            res.sendFile(config.root + config.compile.replace('.', '') + config.index);
        });
        break;
    default:
        console.log('*** DEV ***');
        app.use(express.static(config.root + config.build.replace('.', '')));
        app.use(express.static(config.root + config.src.replace('.', '') + 'app/'));
        app.use(express.static(config.root));
        app.get('/*', function(req, res) {
            res.sendFile(config.root + config.build.replace('.', '') + config.index);
        });
        break;
}

app.listen(port);
console.log('Listening on port ' + port + '...');
