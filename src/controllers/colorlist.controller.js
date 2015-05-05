(function() {
    'use strict';

    angular
        .module('sassColorPalette')
        .controller('ColorListController', ColorListController);

    /* @ngInject */
    function ColorListController($scope, ngDialog, sassService, colorService, $rootScope, EVENTS, PATTERN, settingsService) {
        var vm = this;

        vm.settings = settingsService.getSettings();
        vm.pattern = PATTERN;
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
        $rootScope.$on(EVENTS.SETTINGS_CHANGE, handleSettingsUpdate);

        // Listen colorsUpdated event dispatched by colorService
        $rootScope.$on(EVENTS.COLORS_UPDATE, handleColorsUpdate);

        /**
         * Update settings on scope with settings from service
         */
        function handleSettingsUpdate(event, data) {
            vm.settings = data;
        }

        /**
         * get colors from service on colorsUpdate event
         */
        function handleColorsUpdate() {
            vm.colors = colorService.getColors();

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
            sassService.createSass(vm.colors);

            ngDialog.open({
                template: 'src/templates/resultdialog.html'
            });
        }
    }

}());
