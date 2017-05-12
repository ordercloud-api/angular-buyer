## MyOrders Component Overview

This component allows you to list, edit, and delete your orders. 

You can also list, edit and delete Line Items associated with the order in this component.

MyOrders is a buyer specific admin component.


### Approvals

Note: This tab is only available to buyer users with the following roles:
* Either: ApprovalRuleReader OR ApprovalRuleAdmin 
    AND
* Either : UserGroupReader OR UserGroupAdmin

This tab allows you to receive any incoming orders awaiting your approval and act upon
them by either Accepting or Declining the approval.

An order can not continue to status: 'Complete' until all approval requirements have been met.