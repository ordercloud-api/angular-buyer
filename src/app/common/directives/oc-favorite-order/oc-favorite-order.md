## ocFavoriteOrder Directive

### Overview:

Allow your users to favorite any order. The default buyer app has a specific tab 
in orders to display all favorited orders.

### What it does:

Favorite Orders works by keeping a list of order ids that the user has favorited 
on the user's xp (user.xp.FavoriteOrders).Clicking on a DOM element that has this 
directive will either remove it from the list if it already exists or add it if it
doesn't.

### Usage:

The following attributes are all required in order for this directive to work:

* oc-favorite-order: the order to be favorited/unfavorited
* current-user: the currently authenticated user
* favorite-class: a space delimited list of classes that will be applied when the order is favorited
* non-favorite-class: a space delimited list of classes that will be applied when the order is NOT favorited


### Examples

The following example is adding reorder functionality to a button, but feel free to 
add it to any DOM element you'd like.

```html
<button class="btn btn-default" 
    oc-favorite-order="myOrder"
    current-user="currentUser"
    favorite-class="btn--text-favorited"
    non-favorite-class="btn--text-unfavorited">
<span> Favorite Order</span>
```

### Where is this directive currently used?

This directive can be seen on:
*  order detail - (src/app/myOrders/order/templates/orderDetails.html)