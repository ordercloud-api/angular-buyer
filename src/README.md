# `./src/` Directory
This is where the majority of development work will occur. It contains all
of the application code, tests, and assets.

```
src/
  |- app/
  |- assets/
  |- index.html
```

- [`src/app/`](app/README.md) - contains all of the application code and corresponding tests
- [`src/assets/`](assets/README.md) - static files like fonts and images
- [`src/index.html`](#indexhtml) - this is the HTML document of the single-page application

## `index.html`
The index file is the HTML document of the single-page application (SPA).
This is the highest level container for everything in your angular application.

### `<html>`
The [application module (orderCloud)](app/README.md) and [application controller (AppCtrl)](app/README.md)
are both loaded on the `<html>` element. We use the
[controllerAs syntax](https://toddmotto.com/digging-into-angulars-controller-as-syntax/), so keep
in mind that anything attached to the `AppCtrl` view model is accessible under the name
`application` in all of your template files.

### `<head>`
Within the `<head>` element there are some basic `<meta>` tags and a dynamic
`<title>` tag which takes advantage of `ui-router`'s `$state` service and the `appname`
constant. You can see how we are referencing the `AppCtrl` via the controllerAs syntax below:

```html
//dynamic application title

<title ng-bind="application.$state.current.data.pageTitle + (application.$state.current.data.pageTitle ? ' | ' : '') + application.name">
    OrderCloud
</title>
```
After the `<title>`, there are some very important comments that are
used to dynamically set the `base[href]` attribute and inject reference bower and application
CSS styles during the gulp `build` and `compile`.

At the end of the `<head>` you will find the link for the OrderCloud favicon.

### `<body>`
The body element contains the `ui-view` in which all other application templates will be loaded.
Within the `<ui-view>` element we've placed the HTML used by [cg-busy]() to display a
loading indicator while angular bootstraps itself.

At the end of the body we again have some important comment markup that is used to
dynamically inject all of the bower and application javascript files.