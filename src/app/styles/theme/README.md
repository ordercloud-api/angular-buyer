# Theming
Simple `LESS` themes can be written for the Angular Buyer application and should be kept in the `theme/` directory. `Orderly` is our in-house theme and can be referenced as an example when building custom themes.
```
theme/
  |- orderly/
  |  |- _bootswatch.less
  |  |- _orderly.less
  |  |- _variables.less
```
___
## `_bootswatch.less`
This file contains `LESS` that is needed to override or enhance bootstrap defaults. 

## `_orderly.less`
Similar to a glob file, `_orderly.less` is used only to import other files within the theme.

## `_variables.less`
This file contains theme-specific variables.
