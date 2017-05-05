angular.module('orderCloud')
    .config(function(uibDatepickerConfig, uibDatepickerPopupConfig, $uibModalProvider) {
        //Default Datepicker Options
        uibDatepickerConfig.showWeeks = false;
        uibDatepickerPopupConfig.onOpenFocus = false;
        uibDatepickerPopupConfig.showButtonBar = false;

        //Default Modal Options
        $uibModalProvider.options.backdrop = 'static';
    })
;