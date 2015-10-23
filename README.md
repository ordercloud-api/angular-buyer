# OrderCloud Seed - AngularJS
A seed project for custom Four51 Solutions built on AngularJS
***

## Get started

Node.js is required for the following node package manager (npm) tasks. If you don't have node.js installed, you can download it [here](http://nodejs.org/).

```sh
$ npm -g install karma bower
$ npm -g install "gulpjs/gulp-cli#4.0"
$ npm install
$ bower install
$ gulp build
```

You should now have a few more directories in your project.

```
OrderCloud/
  |- build/
  |- node_modules/
  |- vendor/
```

## Configure WebStorm
WebStorm is our chosen development IDE. It provides an interface for the capabilities of the seed projects configuration. 

### Karma Unit Testing
Once you've installed the prerequisites and run your gulp build you can setup and run your Karma tests.

Create a Run configuration using the Karma plugin with the following settings:

Node interpreter: C:\Program Files (x86)\nodejs\node.exe

Karma package: C:\Four51\WebFiles\SPASites\defaults\OrderCloud\node_modules\karma

Configuration file: C:\Four51\WebFiles\SPASites\defaults\OrderCloud\build\karma-unit.js


### Overall Directory Structure

At a high level, the structure looks roughly like this:

```
OrderCloud/
  |- Gulp/
  |- |- assetTasks.js
  |- |- generalTasks.js
  |- |- scriptTasks.js
  |- |- testTasks.js
  |- |- watchTasks.js
  |- karma/
  |- node_modules/
  |- src/
  |  |- app/
  |  |  |- <application code>
  |  |- assets/
  |  |  |- <static files>
  |  |- index.html
  |- vendor/
  |  |- <bower components>
  |- .bowerrc
  |- bower.json
  |- gulpConfig.js
  |- Gulpfile.js
  |- karma.conf.js
  |- module.prefix
  |- module.suffix
  |- package.json
```

### Detailed Installation

This section provides a little more detailed understanding of what goes into
getting `OrderCloud` up and running. Though `OrderCloud` is really simple
to use, it might help to have an understanding of the tools involved here, like
Node.js and Gulp and Bower. If you're completely new to highly organized,
modern JavaScript development, take a few short minutes to read [this overview
of the tools](tools.md) before continuing with this section.

Here it is:

`OrderCloud` uses [Gulp](http://gulpjs.com/) as its build system, so
[Node.js](http://nodejs.org) is required. Also, we are using Gulp 4.0 prior to 
its official release date. You can install Gulp 4.0 on your machine globally by running
the following command:

```sh
$ npm -g install "gulpjs/gulp-cli#4.0" karma bower
```

And then install the remaining build dependencies locally:

```sh
$ npm install
```

This will read the `dependencies` (empty by default) and the `devDependencies`
(which contains our build requirements) from `package.json` and install
everything needed into a folder called `node_modules/`.

There are many Bower packages used by `OrderCloud`, like AngularJS and the
OrderCloud-Angular-SDK, which are listed in `bower.js`. To install them into the
`vendor/` directory, simply run:

```sh
$ bower install
```

In the future, should you want to add a new Bower package to your app, run the
`install` command and add `--save` to save the dependency in your bower.json file:

```sh
$ bower install packagename --save
```

The `--save` flag tells Bower to add the package at its current version to
our project's `bower.js` file so should another developer download our
application (or we download it from a different computer), we can simply run the
`bower install` command as above and all our dependencies will be installed for
us. Neat!

Technically, `OrderCloud` is now ready to go.

To ensure your setup works, build your application and then run it with the following
commands:

```sh
$ gulp build
$ gulp watch
```

The built files are placed in the `build/` directory by default. And you application
should automatically open in the browser window on a localhost!

`watch` actually starts a few other processes in the background to help you develop your
application. Using `browser-sync` and some built in gulp functions the app is now watching
for changes in your source directory. Should you make any changes to your html or js files
the app should automatically reload your application with the appropriate changes. Also
if you make any changes to your style sheets (less or css) the app will rebuild those changes
and inject them directly into the application, without reloading the entire page! 

When you're ready to push your app into production, just run the `compile`
command:

```sh
$ gulp compile
```

This will concatenate and minify your sources and place them by default into the
`compile/` directory. There will only be three files (excluding assets): `index.html`,
`OrderCloud.js`, and `OrderCloud.css`. All of the vendor dependencies like
AngularJS styles and the OrderCloud-SDK itself have been added to them for super-easy
deploying. If you use any assets (`src/assets/`) then they will be copied to
`compile/` as is.

Lastly, a complete build is always available by simply running the default
task, which runs `build` and then `compile`:

```sh
$ gulp
```

### The Build System

The best way to learn about the build system is by familiarizing yourself with
Gulp and then looking through the code, `Gulpfile.js` and the Gulp folder.
 But you don't need to do that to be very productive with
`OrderCloud`. What follows in this section is a quick introduction to the
tasks provided and should be plenty to get you started.

Below is a description of the gulp tasks in the project, sorted by their general purpose
and location within the Gulp directory.

####Asset Tasks
* `b_m:less` - Compiles all of the app and bower less files into css and moves the compiled file into the temp folder
* `b_m:sass` - Compiles all of the app and bower sass files into css and moves the compiled file into the temp folder
* `b_m:css` - Compiles all of the bower css files (with the exception of the font awesome file as it was already compiled
in `b_m:less`) into one file and autoprefixes the css to run for the last to versions of all the major browsers
* `b_m:appCss` - Compiles all of the app css files into one file and autoprefixes the css to run for the last to versions
of all the major browsers
* `b_m:styles` - Compiles all of the css files in the temp directory into one file, replaces the path to fonts to be correct 
for the build directory and renames the file with the version of the app. Places the file in the build folder and injects the
change into browser-sync if it is currently running
* `b_c:styles` - Deletes all of the assets that have been moved over to the build folder and all of the files in the temp folder
* `b_m:assets` - Moves over all asset files (fonts and images) saved in the src/assets directory to the build/assets directory
* `b_m:fonts` - Moves over all fonts saved within the bower dependencies to the build/assets directory
* `b_c:assets` - Deletes all assets files from the build directory
* `c_m:css` - Minifies all css files in the build directory and moves them to the compile folder
* `c_c:css` - Deletes all css files from the compile directory
* `c_m:assets` - Moves over all asset files (fonts and images) from the build folder to the compile folder
* `c_c:assets` - Delete all asset and css files from the compile directory
* `build:styles` - Runs `b_c:styles`, `b_m:less`, `b_m:sass`, `b_m:css`, `b_m:appCss`, `b_m:styles` in order
* `compile:css` - Runs `c_c:css`, `build:styles`, `c_m:css` in order
* `build:assets` - Runs `b_c:assets`, `b_m:assets`, `b_m:fonts` in order
* `compile:assets` - Runs `c_c:assets`, `build:assets`, `c_m:assets` in order

####General Tasks
* `compile:inject` - Injects the app dependencies into the index.html file for the compiled build
Note: Theere should only be two: `OrderCloud-[Version#].css` and `app.js`
* `build:inject` - Injects the app dependencies into the index.html file for the unminified build
* `masterClean` - Deletes the build, compile, and temp directories. Basically anything built by the gulp
tasks will be removed by this task
* `build` - First runs `master clean`, then runs `build:js_bower`, `build:js`, `build:templateCache`, `build:styles`, `build:assets`,
and lastly runs `build:inject` to create an unminified build of the project
* `compile` - First runs `build`, then runs `compile:js`, `compile:assets`, `compile:css`
and lastly runs `compile:inject` to create a minified build of the project
* `default` - Runs the `compile` task when only `gulp` is typed into the command prompt

####Script Tasks
* `b_m:js_bower` - Moves the bower dependencies over to the build folder
* `b_c:js_bower` - Deletes bower dependencies form the build folder
* `b_m:js` - Moves over all of the app js files need to run the application (not the ones for unit testing) and 
annotates them and wraps each file in an IIFE call.
* `b_c:js` - Deletes all of the javascript files moved over to the build folder except for the templateCache file
* `b_m:templateCache` - Creates an angular templateCache of all the html files (except the index) that
allows for the application to run faster.
* `b_c:templateCache` - Cleans out the compiled template file generated by `b_m:templateCache`
* `c_c:js` - Deletes all js files from the compile directory
* `build:js` - Runs `b_c:js`, and `b_m:js` in order
* `build:js_bower` - Runs `b_c:js_bower`, and `b_m:js_bower` in order
* `build:templateCache` - Runs `b_c:templateCache`, and `b_m:templateCache` in order
* `compile:js` - Runs `c_c:js`, `build:js_bower`, `build:js`, and `build:templateCache` at the same time, then runs
`c_m:js`

####Test Tasks
* `testServe` - Starts the browser-sync server on localhost:12000
Note: this task does not build the application first so you must run `gulp build` first for it to work.
This task differs from `dev` in that it opens a tunnel that allows the app to be viewed on other computers
not on the same network.

####Watch Tasks
* `dev` - Starts the browser-sync server on localhost:8000
* `karma:unit` - Starts the karma unit tests
* `watch:js` - Starts a process that watches for changes in the javascript files in the src directory
* `watch:assets` - Starts a process that watches for changes in the style sheet files (less and css)
* `watch:other` - Starts a process the watches for changes in the html files
* `watch` - Starts all of the previously mentioned tasks in parallel

As covered in the previous section, `gulp build` and `gulp watch` will execute a full build
up-front and then run any of the aforementioned `watch` tasks as needed to
ensure the fastest possible build. So whenever you're working on your project,
start with:

```sh
$ gulp build
```

then:

```sh
$ gulp watch
```

And everything will be done automatically!

### Build vs. Compile

To make the build even faster, tasks are placed into two categories: build and
compile. The build tasks (like those we've been discussing) are the minimal
tasks required to run your app during development.

Compile tasks, however, get your app ready for production. The compile tasks
include concatenation, minification, compression, etc. These tasks take a little
bit longer to run and are not at all necessary for development so are not called
automatically during build or watch.

To initiate a full compile, you simply run the default task:

```sh
$ gulp
```

This will perform a build and then a compile. The compiled site is located in `compile/`.
To test that your full site works as expected, open the `compile/index.html` file in your browser. Voila!
