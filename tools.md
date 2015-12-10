# The Tools Used in `OrderCloud`

## Introduction

`OrderCloud` is standards-based, so it uses all the usual tools to manage
and develop client-side code. If you've developed modern, highly-organized
JavaScript projects before, you are probably already familiar with at least most
of these tools. What follows is a simple description of the tools of which this
project makes use and how they fit in to the `OrderCloud` picture.

## Git

[Git](http://git-scm.com/) is a distributed version control system.
`OrderCloud` uses git to manage its codebase. While in theory you don't have
to use Git once you download `OrderCloud`, this project makes the assumption
that you do. If you're on GitHub, I assume you already have a basic
understanding of Git, which is all you need to make effective use of this
project. You just need to be able to commit and push and junk - nothing funky.
If you're not familiar with it, check out the documentation linked to above.
GitHub also has a great [help section](https://help.github.com/).

## Node.js & NPM

[Node.js](http://nodejs.org) is a platform based on Chrome's JavaScript runtime,
called [V8](http://code.google.com/p/v8/). It allows you to develop all kinds of
software using the JavaScript you already know and love.

A great feature of Node.js is its wide variety of existing libraries and tools.
As the developer community is absolutely massive and incredibly active, Node.js
has a basic package manager called NPM that you can use to install Node.js-based
software and libraries from the command line.

While `OrderCloud` makes heavy use of Node.js behind the scenes, you as the
application developer don't need to really think about it much. Most of the
interaction with Node.js will occur through Gulp (see next section), so you
really only need to know how get the initial setup working.

`package.json` is an NPM package description file written in JSON. It contains
basic metadata about your application, like its name, version, and dependencies.
By default, several packages are required for the build process to work; so when
you first start with `OrderCloud` you have to tell NPM to install the
packages; this is covered in detail in the [main README](README.md). Some of
the required packages are Gulp build tasks, while others are
command-line tools either we (or the build system) need, like Karma, Gulp, and
Bower.

Don't worry about knowing Node.js in order to use `OrderCloud`; Gulp is
where the magic happens.

## Gulp.js

[Gulp](http://gulpjs.com/) is a JavaScript task runner that runs on top of
Node.js. Most importantly, Gulp brings us automation. There are lots of steps
that go into taking our manageable codebase and making it into a
production-ready website; we must gather, lint, test, annotate, and copy files
about. Instead of doing all of that manually, we write (and use others') Gulp
tasks to do things for us.

## Bower

[Bower](bower.io) is a package manager for the web. It's similar in many
respects to NPM, though it is significantly simpler and only contains code for
web projects, like Twitter Bootstrap and its AngularJS counterpart Angular
Bootstrap. Bower allows us to say that our app depends in some way on these
other libraries so that we can manage all of them in one simple place.

`OrderCloud` comes with a `bower.json` file that looks something like this:

```js
{
  "name": "OrderCloud",
  "version": ".0.0.1-SNAPSHOT",
  "devDependencies": {
    "angular": "~1.0.7",
    "angular-mocks": "~1.0.7",
    "bootstrap": "~2.3.2",
    "angular-bootstrap": "~0.3.0",
    "angular-ui-router": "~0.0.1",
    "angular-ui-utils": "~0.0.3"
  },
  "dependencies": {}
}
```

This file is fairly self-explanatory; it gives the package name and version
(duplicated from `package.json`, but this is unavoidable) as well as a list of
dependencies our application needs in order to work. If we simply call

```sh
$ bower install
```

it will read these three dependencies and install them into the `vendor/` folder
(along with any dependencies they have) so that we can use them in our app. If
we want to add a new package like AngularUI's
[ngGrid](http://angular-ui.github.io/ng-grid/), then we can tell Bower to
install that from the web, place it into the `vendor/` folder for us to use, and
then add it as a dependency to `bower.json`:

```js
$ bower install angular-grid --save-dev
```

Bower can also update all of our packages for us at a later date, though that
and its many other awesome features are beyond the scope of this simple
overview.

One last thing to note is that packages installed with Bower are not
standardized, so we cannot automatically add them to the build process; anything
installed with Bower (or placed in the `vendor/` directory manually) *must* be
added to your `build.config.js` file manually; look for the Bower libs included
in `OrderCloud` by default in there to see what I mean.
