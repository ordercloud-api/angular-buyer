# The `src` Directory

## Overview

The `src/` directory contains all code used in the application along with all
tests of such code.

```
src/
  |- app/
<<<<<<< HEAD
  |  |- home/
  |  |- app.js
  |  |- app.spec.js
  |  |- global.less
  |  |- variables.less
  |- assets/
=======
  |  |- common/
  |  |- styles/
  |  |- app.config.js
  |  |- app.constants.json
  |  |- app.controller.js
  |  |- app.module.js
  |  |- app.run.js
  |  |- app.spec.js
  |- assets/
  |  |- images/
>>>>>>> 281bb9e29d0e44c929457c755c5b59714e368ee2
  |- index.html
```

- `src/app/` - application-specific code, i.e. code not likely to be reused in
  another application. [Read more &raquo;](app/README.md)
- `src/assets/` - static files like fonts and images. 
  [Read more &raquo;](assets/README.md)
- `src/index.html` - this is the HTML document of the single-page application.
  See below.

See each directory for a detailed explanation.

## `index.html`

The `index.html` file is the HTML document of the single-page application (SPA)
that should contain all markup that applies to everything in the app, such as
the header and footer. It declares with `ngApp` that this is `orderCloud`,
specifies the main `AppCtrl` controller, and contains the `uiView` directive
into which route templates are placed.

Unlike any other HTML document (e.g. the templates), `index.html` is compiled as
a Grunt template, so variables from `Gruntfile.js` and `package.json` can be
referenced from within it. Changing `name` in `package.json` from
"orderCloud" will rename the resultant CSS and JavaScript placed in `build/`,
so this HTML references them by variable for convenience.
