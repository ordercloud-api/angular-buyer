# The `src/app` Directory

## Overview

```
src/
  |- app/
  |  |- home/
  |  |- about/
  |  |- app.js
  |  |- app.spec.js
```

The `src/app` directory contains all code specific to this application. Apart
from `app.js` and its accompanying tests (discussed below), this directory is
filled with subdirectories corresponding to high-level sections of the
application, often corresponding to top-level routes. Each directory can have as
many subdirectories as it needs, and the build system will understand what to
do. For example, a top-level route might be "products", which would be a folder
within the `src/app` directory that conceptually corresponds to the top-level
route `/products`, though this is in no way enforced. Products may then have
subdirectories for "create", "view", "search", etc. The "view" submodule may
then define a route of `/products/:id`, ad infinitum.

## `app.js`

This is our main app configuration file. It kickstarts the whole process by
requiring all the modules that we need.

By default, the OrderCloud AngularJS Seed includes a few useful modules written
by the AngularJS team. Along with one by the Angular-UI team called `ui.router`.
Lastly, we include the `orderCloud.sdk` module for connecting to the API.

We must load any modules from `src/app` now to ensure the routes are loaded. If
as in our "products" example there are subroutes, we only require the top-level
module, and allow the submodules to require their own submodules.

As a matter of course, we also require the template module that is generated
during the build.

```js
angular.module( 'orderCloud', [
    'templates-app',
	'ngSanitize',
	'ngAnimate',
	'ui.router',
	'ngMessages',
	'ngTouch',
	'orderCloud.sdk'
	])
```

With app modules broken down in this way, all routing is performed by the
submodules we include, as that is where our app's functionality is really
defined.  So all we need to do in `app.js` is specify a default route to follow,
which route of course is defined in a submodule. In this case, our `home` module
is where we want to start, which has a defined route for `/home` in
`src/app/home/home.js`.

```js
.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );
})
```

Use the main applications run method to execute any code after services
have been instantiated.

```js
.run( function run () {
})
```

And then we define our main application controller. This is a good place for logic
not specific to the template or route, such as menu logic or page title wiring.

```js
.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = 'OrderCloud | ' + toState.data.pageTitle;
    }
  });
})
```

### Testing

One of the design philosophies of `OrderCloud-Seed-AngularJS` is that tests should exist
alongside the code they test and that the build system should be smart enough to
know the difference and react accordingly. As such, the unit test for `app.js`
is `app.spec.js`, though it is quite minimal.

### Global application styles

By default, we include [Ambient](http://ionlyseespots.github.io/ambient-design/index.html) which is an internally developed design framework that makes use of HTML5 elements & CSS3 attributes to layout the document outline.

Within the `src/app/` directory we included a `global.less` and `variables.less` file.
These should be utilized for application wide LESS variables and mixins.  Each component
within `src/app` will have a corresponding `less/` directory with a similar structure.
The build is smart enough to recognize any new `*.less` file types and roll them in
automatically.

Also, because any LESS brought in from the `/vendor` (through the build.config) directory
gets rolled into the same intermediate `imports.less` file, you will be able to use
and alter those 3rd party variables/mixins.
