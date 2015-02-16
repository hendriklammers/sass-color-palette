(function() {
    'use strict';

    angular
        .module('sassColorPalette')
        .controller('ColorListController', ColorListController);

    /* @ngInject */
    function ColorListController($scope, ngDialog, sassService, colorService, $rootScope, events) {
        var vm = this;

        vm.prefix = 'color-';
        vm.colors = [];
        vm.removeColor = removeColor;
        vm.createOutput = createOutput;

        vm.sortableOptions = {
            handle: '.handle'
        };

        // Listen colorsUpdated event dispatched by colorService
        $rootScope.$on(events.COLORS_UPDATED, handleColorsUpdate);

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
