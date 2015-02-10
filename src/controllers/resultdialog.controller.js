(function() {
    'use strict';

    angular
        .module('sassColorPalette')
        .controller('ResultDialogController', ResultDialogController);

    /* @ngInject */
    function ResultDialogController($scope, sassService) {
        var vm = this;

        $scope.result = sassService.getSass();
    }

}());
