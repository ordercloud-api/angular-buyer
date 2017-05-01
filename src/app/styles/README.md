# Styles
Styles for the Angular Buyer application are located in six different subdirectories, organized by function. The `main.less` file imports all of these files. We also use a `shame.less` file for storing code that we know needs to be refactored. To learn more about this architecture pattern, please read [this terrific article](https://sass-guidelin.es/#the-7-1-pattern).
```
styles/
  |- components/
  |- global/
  |- layout/
  |- pages/
  |- theme/
  |- utils/
  |- main.less
  |- shame.less
```
___
## `components/`
A component should be thought of as a self-contained piece of UI, for example: buttons. Styles for components go here, and each component should have its own stylesheet. A well engineered UI is generally constructed of many different components, so there will be a lot of files in here!

## `global/`
Styles for commonly used HTML elements should be kept here.

## `layouts/`
The layouts folder contains styles for laying out the application, for example: `_header.less`, `_footer.less`, and `_sidebar.less`.

## `pages/`
When page-specific styles are needed then those styles should be kept in this directory with a filename that matches the page, for example: `_home.less`.

## `theme/`
The Angular Buyer application is built for theming. Theme specific styles should be put in this folder. For more information, please refer to our [LESS theming documentation](theme/README.md).

## `utils/`
This folder contains all the LESS mixins and variables available for styling the application. As a general rule, nothing in this folder should compile to actual CSS.

## `main.less`
Each of the directories above contains a `glob.less` file that imports all of the LESS files within that directory. The `main.less` file imports all of those globs along with `shame.less`.

## `shame.less`
Quick fixes, hacks and questionable techniques? Put them in here and make a habit of cleaning out this file often! Read more about `shame.less` at [csswizardry.com](https://csswizardry.com/2013/04/shame-css/).
