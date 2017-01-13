#Payment Directives

**All 5 directives accept a global `order` option for passing in `base.currentOrder`**

**oc-payment-po** => single payment, single type of purchase order
- _options:_
  - `payment`: the payment to be tied to the directive functionality (for multiple payments)

**oc-payment-sa** => single payment, single type of spending account
- _options:_ 
  - `excluded-options`: an array of spending account IDs to be excluded
  - `payment`: the payment to be tied to the directive functionality (for multiple payments)

**oc-payment-cc** => single payment, single type of credit card
- _options:_ 
  - `excluded-options`: an array of credit card IDs to be excluded
  - `payment`: the payment to be tied to the directive functionality (for multiple payments)

**oc-payment** => single payment, multiple types (configurable)
- _options:_ 
  - `excluded-options`: an object with a property for `SpendingAccounts` & `CreditCards` which are an array of IDs to be excluded
  - `payment-index`: the $index of the payment when using multiple payments, payment
  - `payment`: the payment to be tied to the directive functionality (for multiple payments)
  - `methods`: an array of methods to be made available in the payment method dropdown

**oc-payments** => multiple payments, multiple types (configurable)
- _options_
  - `methods`: an array of methods to be made available in the payment method dropdown