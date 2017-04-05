angular.module('orderCloud')
	.controller('PaymentPurchaseOrderCtrl', PaymentPurchaseOrderController)
;

function PaymentPurchaseOrderController($scope, $rootScope, $exceptionHandler, toastr, sdkOrderCloud) {
	if (!$scope.payment) {
		sdkOrderCloud.Payments.List('outgoing', $scope.order.ID)
			.then(function(data) {
				if (data.Items.length) {
					//TODO: Buyer Users currently cannot patch a payment - we may need to refactor
					sdkOrderCloud.Payments.Patch('outgoing', $scope.order.ID, data.Items[0].ID, {
						Type: 'PurchaseOrder',
						CreditCardID: null,
						SpendingAccountID: null,
						Amount: null
					}).then(function(data) {
						$scope.payment = data;
					});
				} else {
					sdkOrderCloud.Payments.Create('outgoing', $scope.order.ID, {Type: 'PurchaseOrder'})
						.then(function(data) {
							$scope.payment = data;
						});
				}
			});
	} else if (!($scope.payment.Type == "PurchaseOrder" && $scope.payment.CreditCardID == null && $scope.payment.SpendingAccountID == null)) {
		$scope.payment.Type = "PurchaseOrder";
		$scope.payment.CreditCardID = null;
		$scope.payment.SpendingAccountID = null;
		//TODO: Buyer Users currently cannot patch a payment - we may need to refactor
		sdkOrderCloud.Payments.Patch('outgoing', $scope.order.ID, $scope.payment.ID, $scope.payment).then(function() {
			toastr.success('Paying by purchase order', 'Purchase Order Payment');
			$rootScope.$broadcast('OC:PaymentsUpdated');
		});
	}

	$scope.updatePayment = function() {
		if ($scope.payment.xp && $scope.payment.xp.PONumber && (!$scope.payment.xp.PONumber.length)) $scope.payment.xp.PONumber = null;
		//TODO: Buyer Users currently cannot patch a payment - we may need to refactor
		sdkOrderCloud.Payments.Patch('outgoing', $scope.order.ID, $scope.payment.ID, $scope.payment)
			.then(function() {
				toastr.success('Purchase Order Number Saved');
				$rootScope.$broadcast('OC:PaymentsUpdated');
			})
			.catch(function(ex) {
				$exceptionHandler(ex);
			});
	}
}