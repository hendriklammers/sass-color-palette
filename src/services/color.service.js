(function() {
    'use strict';

    angular
        .module('sassColorPalette')
        .factory('colorService', colorService);

    /* @ngInject */
    function colorService() {
        var service = {
            updateColors: updateColors
        };

        return service;

        function updateColors(colors) {
            colors.forEach(function(c) {
                console.log(c);
            });
        }
    }

}());
