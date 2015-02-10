(function() {
    'use strict';

    angular
        .module('sassColorPalette')
        .controller('ColorListController', ColorListController);

    /* @ngInject */
    function ColorListController(ngDialog, sassService) {
        var vm = this;

        vm.prefix = 'color-';

        vm.sortableOptions = {
            handle: '.handle'
        };

        vm.colors = [
            {hex: '#3498db', name: 'blue'},
            {hex: '#16a085', name: 'green'},
            {hex: '#c0392b', name: 'red'},
            {hex: '#f1c40f', name: 'yellow'},
            {hex: '#8e44ad', name: 'purple'}
        ];

        vm.removeColor = function(index) {
            vm.colors.splice(index, 1);
        };

        vm.createSass = function() {
            sassService.createSass(vm.colors, vm.prefix);

            ngDialog.open({
                template: 'src/resultdialog.html',
                controller: 'ResultDialogController'
            });
        };
    }

}());
