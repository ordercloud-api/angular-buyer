angular.module('orderCloud')
	.controller('PaymentCtrl', PaymentController)
;

function PaymentController($scope, $rootScope, sdkOrderCloud, ocCheckoutPaymentService, CheckoutConfig) {
	if (!$scope.methods) $scope.methods = CheckoutConfig.AvailablePaymentMethods;
	if (!$scope.payment) {
		sdkOrderCloud.Payments.List('outgoing', $scope.order.ID)
			.then(function(data) {
				if (ocCheckoutPaymentService.PaymentsExceedTotal(data, $scope.order.Total)) {
					ocCheckoutPaymentService.RemoveAllPayments(data, $scope.order)
						.then(function(data) {
							sdkOrderCloud.Payments.Create('outgoing', $scope.order.ID, {Type: CheckoutConfig.AvailablePaymentMethods[0]})
								.then(function(data) {
									$scope.payment = data;
									$rootScope.$broadcast('OC:PaymentsUpdated');
								});
						});
				}
				else if (data.Items.length) {
					$scope.payment = data.Items[0];
					if ($scope.methods.length == 1) $scope.payment.Type = $scope.methods[0];
				} else {
					sdkOrderCloud.Payments.Create('outgoing', $scope.order.ID, {Type: CheckoutConfig.AvailablePaymentMethods[0]})
						.then(function(data) {
							$scope.payment = data;
							$rootScope.$broadcast('OC:PaymentsUpdated');
						});
				}
			});
	} else if ($scope.methods.length == 1) {
		$scope.payment.Type = $scope.methods[0];
	}
}