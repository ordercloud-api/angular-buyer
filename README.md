# OrderCloud
A seed project for custom Four51 Solutions
***

## Get started

Install [node.js](http://nodejs.org/) and then:

```sh
$ npm -g install grunt-cli karma bower
$ npm install
$ bower install
$ grunt build
```

You should now have a few more directories in your project.

```
OrderCloud/
  |- build/
  |- node_modules/
  |- vendor/
```

## Configure WebStorm
WebStorm is our chosen development IDE. It provides an interface into the capabilities of the projects configuration. 

### Karma Unit Testing
Once you've installed the prerequisites and run your grunt build you can setup and run your Karma tests.

Create a Run configuration using the Karma plugin with the following settings:

Node interpreter: C:\Program Files (x86)\nodejs\node.exe

Karma package: C:\Four51\WebFiles\SPASites\defaults\OrderCloud\node_modules\karma

Configuration file: C:\Four51\WebFiles\SPASites\defaults\OrderCloud\build\karma-unit.js


### Overall Directory Structure

At a high level, the structure looks roughly like this:

```
OrderCloud/
  |- grunt-tasks/
  |- karma/
  |- src/
  |  |- app/
  |  |  |- <app logic>
  |  |- assets/
  |  |  |- <static files>
  |  |- common/
  |  |  |- <reusable code>
  |  |- less/
  |  |  |- main.less
  |- vendor/
  |  |- angular-bootstrap/
  |  |- bootstrap/
  |  |- placeholders/
  |- .bowerrc
  |- bower.json
  |- build.config.js
  |- Gruntfile.js
  |- module.prefix
  |- module.suffix
  |- package.json
```

### Detailed Installation

This section provides a little more detailed understanding of what goes into
getting `OrderCloud` up and running. Though `OrderCloud` is really simple
to use, it might help to have an understanding of the tools involved here, like
Node.js and Grunt and Bower. If you're completely new to highly organized,
modern JavaScript development, take a few short minutes to read [this overview
of the tools](tools.md) before continuing with this section.

Here it is:

`OrderCloud` uses [Grunt](http://gruntjs.org) as its build system, so
[Node.js](http://nodejs.org) is required. Also, Grunt by default no longer comes
with a command-line utility and Karma and Bower must end up in your global path
for the build system to find it, so they must be installed independently. Once
you have Node.js installed, you can simply use `npm` to make it all happen:

```sh
$ npm -g install grunt-cli karma bower
```

And then install the remaining build dependencies locally:

```sh
$ npm install
```

This will read the `dependencies` (empty by default) and the `devDependencies`
(which contains our build requirements) from `package.json` and install
everything needed into a folder called `node_modules/`.

There are many Bower packages used by `OrderCloud`, like Twitter Bootstrap
and Angular UI, which are listed in `bower.js`. To install them into the
`vendor/` directory, simply run:

```sh
$ bower install
```

In the future, should you want to add a new Bower package to your app, run the
`install` command:

```sh
$ bower install packagename --save-dev
```

The `--save-dev` flag tells Bower to add the package at its current version to
our project's `bower.js` file so should another developer download our
application (or we download it from a different computer), we can simply run the
`bower install` command as above and all our dependencies will be installed for
us. Neat!

Technically, `OrderCloud` is now ready to go.

To ensure your setup works, launch grunt:

```sh
$ grunt watch
```

The built files are placed in the `build/` directory by default. Open the
`build/index.html` file in your browser and check it out! Because everything is
compiled, no XHR requests are needed to retrieve templates, so until this needs
to communicate with your backend there is no need to run it from a web server.

`watch` is actually an alias of the `grunt-contrib-watch` that will first run a
partial build before watching for file changes. With this setup, any file that
changes will trigger only those build tasks necessary to bring the app up to
date. For example, when a template file changes, the templates are recompiled
and concatenated, but when a test/spec file changes, only the tests are run.
This allows the watch command to complete in a fraction of the time it would
ordinarily take.

In addition, if you're running a Live Reload plugin in your browser (see below),
you won't even have to refresh to see the changes! When the `watch` task detects
a file change, it will reload the page for you. Sweet.

When you're ready to push your app into production, just run the `compile`
command:

```sh
$ grunt compile
```

This will concatenate and minify your sources and place them by default into the
`release/` directory. There will only be three files: `index.html`,
`OrderCloud.js`, and `OrderCloud.css`. All of the vendor dependencies like
Bootstrap styles and AngularJS itself have been added to them for super-easy
deploying. If you use any assets (`src/assets/`) then they will be copied to
`release/` as is.

Lastly, a complete build is always available by simply running the default
task, which runs `build` and then `compile`:

```sh
$ grunt
```

### The Build System

The best way to learn about the build system is by familiarizing yourself with
Grunt and then reading through the heavily documented build script,
`Gruntfile.js`. But you don't need to do that to be very productive with
`OrderCloud`. What follows in this section is a quick introduction to the
tasks provided and should be plenty to get you started.

The driver of the process is the `delta` multi-task, which watches for file
changes using `grunt-contrib-watch` and executes one of nine tasks when a file
changes:

* `delta:gruntfile` - When `Gruntfile.js` changes, this task runs the linter
  (`jshint`) on that one file and reloads the configuration.
* `delta:assets` - When any file within `src/assets/` changes, all asset files
  are copied to `build/assets/`.
* `delta:html` - When `src/index.html` changes, it is compiled as a Grunt
  template, so script names, etc., are dynamically replaced with the correct
  values configured dynamically by Grunt.
* `delta:less` - When any `*.less` file within `src/` changes, the
  `src/less/main.less` file is linted and copied into
  `build/assets/OrderCloud.css`.
* `delta:jssrc` - When any JavaScript file within `src/` that does not end in
  `.spec.js` changes, all JavaScript sources are linted, all unit tests are run,
  and the all source files are re-copied to `build/src`.
  `build/src` in a structure mirroring where they were in `src/` so it's easy to
  locate problems. 
* `delta:tpls` - When any `*.tpl.html` file within `src/` changes, all templates
  are put into strings in a JavaScript file (technically two, one for
  `src/common/` and another for `src/app/`) that will add the template to
  AngularJS's
  [`$templateCache`](http://docs.angularjs.org/api/ng.$templateCache) so
  template files are part of the initial JavaScript payload and do not require
  any future XHR.  The template cache files are `build/template-app.js` and
  `build/template-common.js`.
* `delta:jsunit` - When any `*.spec.js` file in `src/` changes, the test files
  are linted and the unit tests are executed.

As covered in the previous section, `grunt watch` will execute a full build
up-front and then run any of the aforementioned `delta:*` tasks as needed to
ensure the fastest possible build. So whenever you're working on your project,
start with:

```sh
$ grunt watch
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
$ grunt
```

This will perform a build and then a compile. The compiled site is located in `release/`, taking a cue from
traditional software development. To test that your full site works as
expected, open the `release/index.html` file in your browser. Voila!

### Live Reload!

`OrderCloud` also includes [Live Reload](http://livereload.com/), so you no
longer have to refresh your page after making changes! You need a Live Reload
browser plugin for this:

- Chrome - [Chrome Webstore](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)
- Firefox - [Download from Live Reload](http://download.livereload.com/2.0.8/LiveReload-2.0.8.xpi)
- Safari - [Download from Live Reload](http://download.livereload.com/2.0.9/LiveReload-2.0.9.safariextz)
- Internet Explorer - Not available.

When you load your page, click the Live Reload icon in your toolbar.