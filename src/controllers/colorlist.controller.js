(function() {
    'use strict';

    angular
        .module('sassColorPalette')
        .controller('ColorListController', ColorListController);

    /* @ngInject */
    function ColorListController(ngDialog, sassService) {
        var vm = this;

        vm.prefix = 'color-';
        vm.colors = [
            {hex: '#3498db', name: 'blue'},
            {hex: '#16a085', name: 'green'},
            {hex: '#c0392b', name: 'red'},
            {hex: '#f1c40f', name: 'yellow'},
            {hex: '#8e44ad', name: 'purple'}
        ];
        vm.removeColor = removeColor;
        vm.createOutput = createOutput;

        vm.sortableOptions = {
            handle: '.handle'
        };

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
