(function() {
    'use strict';

    angular
        .module('sassColorPalette')
        .controller('ColorListController', ColorListController);

    /* @ngInject */
    function ColorListController(ngDialog, sassService, colorService, $rootScope, events) {
        var vm = this;

        vm.prefix = 'color-';
        vm.colors = [];
        vm.removeColor = removeColor;
        vm.createOutput = createOutput;

        vm.sortableOptions = {
            handle: '.handle'
        };

        $rootScope.$on(events.COLORS_UPDATED, handleColorsUpdate);

        function handleColorsUpdate() {
            var c = colorService.getColors();
            console.log(c);
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
