## RepeatOrder Component Overview

This component can be used from the Buyer and Admin perspective and includes a repeat-order directive in the form of a button.
Clicking on this button will allow a reorder of products available to the current user.
If the products are not assigned to the current user or have been deleted they will be excluded from the reorder.

The repeat-order directive can be placed anywhere in your HTML by including the following:

```html
<ordercloud-repeat-order></ordercloud-repeat-order>
```

The orderid is a required attribute for both the buyer and admin perspective. The admin perspective will additionally require
the userid and clientid.

Below is a quick summary of attributes for this directive:
* orderid: ID of the order being reordered (required for both admin and buyer perspective)
* userid: ID of the user under which the order is being placed by (required only for admin perspective)
* clientid: the client id of the buyer app that the order is being placed by (required only for the admin perspective)
* includeshipping: will include any shipping details from the previous order if available (optional)
* includebilling: will include any billing details from the previous order if available (optional)
* claims: The claims available to the user placing the reorder. Will default to FullAccess if none are specified. (optional)
