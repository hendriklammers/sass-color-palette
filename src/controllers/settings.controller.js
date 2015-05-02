(function() {
    'use strict';

    angular
        .module('sassColorPalette')
        .controller('SettingsController', SettingsController);

    /* @ngInject */
    function SettingsController(settingsService) {
        var vm = this;
        
        // Use settings from the service
        vm.prefix = settingsService.prefix;
        vm.amount = settingsService.amount;
        vm.autofill = settingsService.autofill;
        vm.type = settingsService.type;

        // Valid character set for variable names
        vm.namePattern = /^[A-Za-z0-9\-\_]+$/;
    }

}());
