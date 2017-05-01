# productBrowse
The Product Browse component renders a paginated list of all visible products.
```
productBrowse/
  |- js/
  |  |- productBrowse.config.js
  |  |- productBrowse.controller.js
  |  |- productBrowse.service.js
  |  |- productBrowseMobileCategory.modal.controller.js
  |  |- productBrowseProductView.controller.js
  |- templates/
  |  |- mobileCategory.modal.html
  |  |- productBrowse.html
  |  |- productView.html
  |- tests/
  |  |- productBrowse.spec.js
```
___
## productView.html
The Product View template contains the html for the Product List, including Product List filters and pagination.
## productBrowse.html
The Product Browse template contains the html for a Category Tree as well as the ui-view that pulls in the Product View.
## mobileCategory.modal.html
On smaller viewports, the Category Tree left nav is hidden, and replaced with a modal.
## card.product.html
Each product is represented within a Product Card. The Product Card template can be found at [common/templates/card.product.html](../common/templates/card.product.html).
## Styling
Styling for the Product Browse and Product Card components is located in the following files:

`styles/components/_catalog-card.less`  
`styles/components/_product-browse.less`  
`styles/layout/_catalog-grid.less`  

Flexbox is used on the Product List to set equal heights on the Product Cards. This creates a uniform layout, and will also prevent float issues caused by the lack of a clearing element between rows.
