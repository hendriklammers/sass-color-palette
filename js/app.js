(function() {
    'use strict';

    angular
        .module('app', ['ui.sortable', 'ngDialog'])

        .factory('sassService', function() {
            var sassVariables = '',
                service = {
                    createSass: createSass,
                    getSass: getSass
                };

            return service;

            function createSass(colors, prefix) {
                var result = '';

                colors.forEach(function(elem) {
                    var color = prefix + elem.name + ': ' + elem.hex + ';\n';

                    result += color;
                });

                sassVariables = result;

                return result;
            }

            function getSass() {
                return sassVariables;
            }
        })

        .controller('ResultDialogController', ['$scope', 'sassService', function($scope, sassService) {
            $scope.result = sassService.getSass();
        }])

        .controller('ColorListController', ['ngDialog', 'sassService', function(ngDialog, sassService) {
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
                    template: 'js/resultdialog.html',
                    controller: 'ResultDialogController'
                });
            };
        }]);

}());
