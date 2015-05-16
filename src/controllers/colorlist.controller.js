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
        vm.colors = [];
        vm.showErrors = false;
        vm.removeColor = removeColor;
        vm.submitColorForm = submitColorForm;

        vm.sortableOptions = {
            // handle: '.handle'
        };

        // Listen for changes in settings panel
        $rootScope.$on(EVENTS.SETTINGS_CHANGE, handleSettingsUpdate);

        // Listen colorsUpdated event dispatched by colorService
        $rootScope.$on(EVENTS.COLORS_UPDATE, handleColorsUpdate);

        /**
         * Update settings on scope with settings from service
         * @return {undefined}
         */
        function handleSettingsUpdate(event, data) {
            vm.settings = data;

            autofillColors();
        }

        /**
         * get colors from service on colorsUpdate event
         * @return {undefined}
         */
        function handleColorsUpdate() {
            vm.colors = colorService.getColors();

            // Make sure view gets updated
            $scope.$apply();

            autofillColors();
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
         * @return {undefined}
         */
        function submitColorForm() {
            if ($scope.colorForm.$invalid) {
                vm.showErrors = true;
            } else {
                sassService.createSass(vm.colors);

                ngDialog.open({
                    template: 'src/templates/resultdialog.html'
                });
            }
        }

        /**
         * Fills name field with generated color name
         * @return {undefined}
         */
        function autofillColors() {
            vm.colors.forEach(function(color) {
                // Before doing anything store custom name values
                if (color.name && color.name !== color.autofill) {
                    color.custom = color.name;
                }

                // Only autofill when no custom name is entered
                if (vm.settings.autofill) {
                    if (!color.name) {
                        color.name = color.autofill;
                    }
                } else {
                    if (color.custom) {
                        color.name = color.custom;
                    } else {
                        color.name = '';
                    }
                }
            }); 
        }
    }

}());
