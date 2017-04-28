| master | development |
| --- | --- |
| [![Build Status](https://travis-ci.org/ordercloud-api/angular-buyer.svg?branch=master)](https://travis-ci.org/ordercloud-api/angular-buyer) | [![Build Status](https://travis-ci.org/ordercloud-api/angular-buyer.svg?branch=development)](https://travis-ci.org/ordercloud-api/angular-buyer) |

# OrderCloud Angular Buyer
An open-source starter application for custom OrderCloud buyer applications built on AngularJS. Ideally, solution
implementers will fork or clone this repository to maintain their customized version of the buyer application through merges and
pull requests after new versions are released in the base fork (this repository).

- [Getting Started](#getting-started)
- [Contributors](#contributors)
- [Further Reading](#further-reading)

- - - -

## Getting started

### Prerequisites
- [Git (version control)](https://git-scm.com/)
- [Node.js (npm)](http://nodejs.org/)
- [Bower (another package manager)](https://bower.io/#install-bower)
- [Gulp.js (automation)](http://gulpjs.com/)

### Installation
Install the project dependencies:
```sh
$ npm install
```
If for some reason the `post-install` script fails, reattempt the bower install manually:
```sh
$ bower install
```

### Local Development
To view your application locally while you work, run the following gulp command:
```sh
$ gulp build
```
This will pull together everything in the projects `./src/` directory and put the result into a new `./build/` folder
(ignored by source control).

After the build succeeds, an express server will fire up and open the app in your default browser @ `http://localhost:3000/`.
Additionally, a watch is initiated so that [BrowserSync](https://browsersync.io/) can automatically refresh the app when
changes to the `./src/` directory are made.

### Running Unit and E2E Tests
[Karma](https://karma-runner.github.io/1.0/index.html), [Jasmine](https://jasmine.github.io/), and [Protrator (e2e test framework for AngularJS)](http://www.protractortest.org/#/)
are our test frameworks of choice, everything you need to run unit or E2E tests should already be installed via npm.

| Task | File Extension | Description |
| --- | --- | --- |
| `gulp test:unit` | `*.spec.js` | Runs only the unit tests |
| `gulp test:e2e` | `*.test.js` | Runs only the E2E tests |
| `gulp test` | `*.spec.js` or `*.test.js` | Runs both the unit and E2E tests |

### Compiling for Production
You can run the following command to compile your code to a production-ready
state:
```sh
$ gulp compile
```
This will concat all similar file types into a single file, minify the code, and drop the result into a new `./compile/` folder.
Images in the `./src/assets/` directory are compressed for web optimization and template file contents are stringified
and added to the angular `$templateCache` for faster load times.

>While we've worked hard to ensure that your app will behave the same on both build and compile, it is always recommended that
the compiled code be thoroughly tested before moving to production.

When the compile is complete, the express server will fire up again and open the app @ `http://localhost:3000/`. For performance reasons
the watch is not fired on compile like it is on build.

### Deploying to [GitHub Pages](https://pages.github.com/)
Having worked in the B2B world for over 15 years we know that showing development progress is extremely important, especially
during large projects. That is why we've provided an easy way for you to deploy your compiled code directly to a gh-pages branch
for fast and easy demos!
```sh
$ gulp deploy
```
This will push a compiled version of your working copy directly to your default git remote and can be viewed at `username.github.io/repository-name`.
> **Important Note!** Your angular app _must **not**_ be in HTML5 mode for the routing on gh-pages to work properly. This
can be changed in `./src/app/app.constants.json` prior to running the task.

> Github pages can take a few minutes (about 10) to propagate before your app will become available.

Of course, this is not the only deployment option available. Angular-based OrderCloud applications are [preconfigured](https://devcenter.heroku.com/categories/nodejs)
to be deployed on [Heroku](https://www.heroku.com/) using their [GitHub integration](https://devcenter.heroku.com/articles/github-integration) and the
`./compile` directory is made up of entirely static files that can be easily deployed to any hosting provider.

## Contributors
The OrderCloud team welcomes any and all open-source contributors to create a pull request for bug fixes, enhancements, or new features (pending review).

Prior to writing any code, be sure to [open an issue](https://github.com/ordercloud-api/angular-buyer/issues) with a detailed description of
your problem or proposed enhancement. We may already be on our way to delivering what you want!

The OrderCloud team uses GitHub's standard [fork, branch, pull request workflow](https://gist.github.com/Chaser324/ce0505fbed06b947d962) and
we expect any contributors to follow a similar workflow. Always provide a passing unit test for any fix or enhancement.

Thank you for being a part of the [OrderCloud Community](http://community.ordercloud.io) and helping make our resources the best they can be!

## Further Reading
- [Source Code Overview](src/README.md)
- [Connecting to Your Buyer Organization](src/app/README.md#appconstantsjson) - _coming soon_
- [Application Files](src/app/README.md) - _coming soon_
- [Authentication Management](src/app/login/README.md) - _coming soon_
- [Themes and Styles](src/app/styles/README.md) - _coming soon_
- [Common Resources](src/app/common/README.md) - _coming soon_
