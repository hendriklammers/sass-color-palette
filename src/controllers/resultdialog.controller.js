(function() {
    'use strict';

    angular
        .module('sassColorPalette')
        .controller('ResultDialogController', ResultDialogController);

    /* @ngInject */
    function ResultDialogController($scope, sassService) {
        var vm = this;

        vm.output = sassService.getSass();

        // Select contents of textarea
        vm.selectText = function($event) {
            $event.target.select();
        };
    }

}());
