ocReorder Directive
===================

Overview
-------------
Easily enable reorder functionality for any of your user's past orders 
on any DOM element with this functional directive. 

Clicking on a DOM element that has this directive will take a previous 
user's line items and add them to their cart. A modal will appear 
before adding them to the cart and will display any products that are 
no longer valid for reorder; perhaps the product no longer exists, or 
is not assigned to the user. The user can then click 'Add to Cart' to 
add all valid products and continue through the checkout process 

> **Note:** Products that have an invalid requested will still be 
    allowed with the following modifications:

> - If the requested quantity is **less** than the price schedule's 
    `MinQuantity` then the requested quantity will be replaced by the 
    `MinQuantity` value
> - If the requested quantity is **more** than the price schedule's 
    `MaxQuantity` then the requested quantity will be replaced with 
    the `MaxQuantity` value

Usage
-------------

The following example adds reorder functionality to a button

```html
<button oc-reorder="myPreviousOrderID" current-order-id="myCurrentOrderID">Reorder Me!</button>
```


| Attribute           | Definition  |
| -------             | ----      |
| `oc-reorder`        | ID of the order to be re-ordered|
| `current-order-id`  | ID of the current order. Inherits previous orders' line items    |



You can also exclude `current-order-id`, in exchange for a slight performance hit, and have the directive retrieve it.

```html
<button oc-reorder="myPreviousOrderID">Reorder Me Too!</button>
```
This might be useful if you don't already have access to the current order in scope but is otherwise discouraged.

Where is this directive currently used?
-------------
You can find this directive in its native surroundings:

*  order list - (src/app/myOrders/orders/templates/orders.html)
*  order detail - (src/app/myOrders/order/templates/orderDetails.html)