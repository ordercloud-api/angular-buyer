angular.module('orderCloud')
    .run(AppRun)
;

function AppRun(OrderCloud, catalogid, uibDatepickerConfig, uibDatepickerPopupConfig, defaultErrorMessageResolver) {
    //Set Default CatalogID
    catalogid ? OrderCloud.CatalogID.Set(catalogid) : OrderCloud.CatalogID.Set(OrderCloud.BuyerID.Get());

    //Default Datepicker Options
    uibDatepickerConfig.showWeeks = false;
    uibDatepickerPopupConfig.showButtonBar = false;

    //Set Custom Error Messages for angular-auto-validate      --- http://jonsamwell.github.io/angular-auto-validate/ ---
    defaultErrorMessageResolver.getErrorMessages().then(function (errorMessages) {
        errorMessages['customPassword'] = 'Password must be at least eight characters long and include at least one letter and one number';
        //regex for customPassword = ^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$
        errorMessages['positiveInteger'] = 'Please enter a positive integer';
        //regex positiveInteger = ^[0-9]*[1-9][0-9]*$
        errorMessages['ID_Name'] = 'Only Alphanumeric characters, hyphens and underscores are allowed';
        //regex ID_Name = ([A-Za-z0-9\-\_]+)
        errorMessages['confirmpassword'] = 'Your passwords do not match';
        errorMessages['noSpecialChars'] = 'Only Alphanumeric characters are allowed';
    });
}