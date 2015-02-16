(function() {
    'use strict';

    angular
        .module('sassColorPalette')
        .factory('colorService', colorService);

    /* @ngInject */
    function colorService($rootScope, events) {
        var colorStorage = [];

        var service = {
            updateColors: updateColors,
            getColors: getColors
        };

        return service;

        function getColors() {
            return colorStorage;
        }

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

            $rootScope.$emit(events.COLORS_UPDATED);
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
