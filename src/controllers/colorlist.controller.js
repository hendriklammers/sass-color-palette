(function() {
    'use strict';

    angular
        .module('sassColorPalette')
        .controller('ColorListController', ColorListController);

    /* @ngInject */
    function ColorListController($scope, ngDialog, sassService, colorService, $rootScope, events) {
        var vm = this;

        vm.pattern = /^[A-Za-z0-9\-\_]+$/;
        vm.prefix = 'color-';
        vm.limit = 10;
        vm.autofill = true;
        vm.colors = [
            {hex: '#48251e', rgb: 'rgb(72, 37, 30)'}
        ];
        vm.showErrors = false;
        vm.removeColor = removeColor;
        vm.submitColorForm = submitColorForm;
        // vm.createOutput = createOutput;

        vm.sortableOptions = {
            handle: '.handle'
        };

        // Listen colorsUpdated event dispatched by colorService
        $rootScope.$on(events.COLORS_UPDATED, handleColorsUpdate);

        /**
         * get colors from service on colorsUpdate event
         */
        function handleColorsUpdate() {
            vm.colors = colorService.getColors().splice(0, vm.limit);
            console.log(vm.colors);

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
            sassService.createSass(vm.colors, vm.prefix);

            ngDialog.open({
                template: 'src/templates/resultdialog.html'
            });
        }
    }

}());
