angular.module('orderCloud')
	.config(function(toastrConfig) {
		angular.extend(toastrConfig, {
			containerId: 'toast-container',
			maxOpened: 5,
			newestOnTop: true,
			positionClass: 'toast-top-right',
			preventDuplicates: false,
			preventOpenDuplicates: true,
			progressBar:true,
			tapToClose:true,
			target: 'body',
			extendedTimeOut: 1000,
			timeOut: 4000,
			iconClasses: {
				error: 'alert-danger',
				info: 'alert-info',
				success: 'alert-success',
				warning: 'alert-warning'
			},
			toastClass: 'alert alert-dismissable',
			closeButton:true,
			closeHtml: '<button type="button" class="close hidden-xs" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
		});
	})
;