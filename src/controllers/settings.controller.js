(function() {
    'use strict';

    angular
        .module('sassColorPalette')
        .controller('SettingsController', SettingsController);

    /* @ngInject */
    function SettingsController($scope, settingsService, PATTERN) {
        var vm = this;
        
        // Use settings from the service
        vm.settings = settingsService.getSettings();

        // Valid character set for variable names
        vm.namePattern = PATTERN;

        // Watch for changes on the settings object
        $scope.$watch(function() {
            return vm.settings;
        }, function(newVal) {
            settingsService.update(newVal);
        }, true);
    }

}());
