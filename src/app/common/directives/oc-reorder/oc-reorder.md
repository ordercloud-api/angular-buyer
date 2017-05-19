## ocReorder Directive

### Overview:

Easily enable reorder functionality for any of your customer's past orders on any DOM element with this functional directive. 

### What it does:

Clicking on a DOM element that has this directive will take a previous user's line items and add them to their cart. A modal will appear before adding them to the cart and will display any potential products that can no longer be ordered (perhaps the product no longer exists, or is not assigned to the user). If all is good they can just click 'Add to Cart' and continue through the checkout process.

### Usage:

This directive uses the following attributes that should be added to the same DOM element as the directive.

* oc-reorder : ID of the order that user wants to reorder. 
* current-order-id : this is the order that will have the previous order's line items added to

### Examples

The following example is adding reorder functionality to a button, but feel free to add it to any DOM element you'd like.

```html
<button oc-reorder="myPreviousOrderID" current-order-id="myCurrentOrderID">Reorder Me!</button>
```

You can also exclude current-order-id for a slight performance hit (extra api call required to get current order) if you 
prefer the directive handle getting the current order (most recent, unsubmitted order)

```html
<button oc-reorder="myPreviousOrderID">Reorder Me Too!</button>
```

### Where is this directive currently used?

This directive can be seen on:
*  order list - (src/app/myOrders/orders/templates/orders.html)
*  order detail - (src/app/myOrders/order/templates/orderDetails.html)