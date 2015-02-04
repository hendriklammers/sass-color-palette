(function() {
    'use strict';

    angular
        .module('app', ['ui.sortable'])
        .controller('ColorListController', function() {
            var vm = this;

            vm.prefix = 'color-';

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
        });

}());
