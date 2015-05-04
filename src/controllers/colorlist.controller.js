(function() {
    'use strict';

    angular
        .module('sassColorPalette')
        .controller('ColorListController', ColorListController);

    /* @ngInject */
    function ColorListController($scope, ngDialog, sassService, colorService, $rootScope, events, settingsService) {
        var vm = this;

        vm.settings = settingsService.getSettings();
        vm.pattern = /^[A-Za-z0-9\-\_]+$/;
        vm.colors = [
            {hex: '#48251e', rgb: 'rgb(72, 37, 30)'},
            {hex: '#ff0000', rgb: 'rgb(255, 255, 255, 0)'}
        ];
        vm.showErrors = false;
        vm.removeColor = removeColor;
        vm.submitColorForm = submitColorForm;

        vm.sortableOptions = {
            handle: '.handle'
        };

        // Listen for changes in settings panel
        $rootScope.$on(events.SETTINGS_CHANGE, handleSettingsUpdate);

        // Listen colorsUpdated event dispatched by colorService
        $rootScope.$on(events.COLORS_UPDATE, handleColorsUpdate);

        function handleSettingsUpdate() {
            vm.settings = settingsService.getSettings();
        }

        /**
         * get colors from service on colorsUpdate event
         */
        function handleColorsUpdate() {
            vm.colors = colorService.getColors().splice(0, vm.limit);

            // Make sure view gets updated
            $scope.$apply();
        }

        /**
         * removes color at index
         * @param {number} index
         */
        function removeColor(index) {
            vm.colors.splice(index, 1);
        }

        /**
         * Validates form and proceed to create sass output
         */
        function submitColorForm() {
            if ($scope.colorForm.$invalid) {
                vm.showErrors = true;
            } else {
                createOutput();
            }
        }

        /**
         * Creates sass variables and shows output in dialog
         */
        function createOutput() {
            sassService.createSass(vm.colors, vm.type + vm.prefix);

            ngDialog.open({
                template: 'src/templates/resultdialog.html'
            });
        }
    }

}());
