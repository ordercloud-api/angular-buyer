//Global gulp variables
var gulp = require('gulp');
var fs = require('fs');
config = require('./gulpConfig');
var path = require('path');


//require gulpfiles in order...

require('./Gulp/testTasks');
require('./Gulp/scriptTasks');
require('./Gulp/assetTasks');
require('./Gulp/generalTasks');
require('./Gulp/watchTasks');