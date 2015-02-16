(function() {
    'use strict';

    angular
        .module('sassColorPalette')
        .factory('colorService', colorService);

    /* @ngInject */
    function colorService() {
        var colorStorage = [];

        var service = {
            updateColors: updateColors
        };

        return service;

        /**
         * Update colors stored in the service
         * @param {array} colors
         */
        function updateColors(colors) {
            colors.forEach(function(c) {
                var color = {
                    rgb: createRgbString(c),
                    hex: createHexString(c)
                };

                colorStorage.push(color);
            });
        }

        /**
         * Creates rgb(255, 255, 255) string
         * @param {array} rgb [123, 38, 8] color values
         * @return {string}
         */
        function createRgbString(rgb) {
            return 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')';
        }

        /**
         * Creates #FFFFFF string
         * @param {array} rgb [123, 38, 8] color values
         * @return {string}
         */
        function createHexString(rgb) {
            return '#' + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
        }
    }

}());
