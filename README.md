# OrderCloud Seed - AngularJS
A seed project for custom Four51 Solutions built on AngularJS
***

## Get started

Node.js is required for the following node package manager (npm) tasks. If you don't have node.js installed, you can download it [here](http://nodejs.org/).

```sh

$ npm install
$ gulp build
```

You should now have a few more directories in your project.

```
OrderCloud/
  |- build/
  |- node_modules/
  |- bower_components/
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
  |- gulp/
  |- node_modules/
  |- src/
  |  |- app/
  |  |  |- <application code>
  |  |- assets/
  |  |  |- <static files>
  |  |- index.html
  |- bower_components/
  |  |- <bower components>
  |- bower.json
  |- gulp.config.js
  |- gulpfile.js
  |- server.js
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
[Node.js](http://nodejs.org) is required.

Install the build dependencies locally:

```sh
$ npm install
```

This will read the `dependencies` (empty by default) and the `devDependencies`
(which contains our build requirements) from `package.json` and install
everything needed into a folder called `node_modules/`.

There are many Bower packages used by `OrderCloud`, like AngularJS and the
OrderCloud-Angular-SDK, which are listed in `bower.js`. To install them into the
`vendor/` directory, simply run:

**This is already installed after running $ npm install

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