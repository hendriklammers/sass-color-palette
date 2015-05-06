(function(ntc) {
    'use strict';

    angular
        .module('sassColorPalette')
        .factory('colorService', colorService);

    /* @ngInject */
    function colorService($rootScope, EVENTS) {
        var colorStorage = [];

        var service = {
            updateColors: updateColors,
            getColors: getColors
        };

        return service;

        /**
         * Returns stored colors
         * @return {array}
         */
        function getColors() {
            return colorStorage;
        }

        /**
         * Update colors stored in the service
         * @param {array} colors
         */
        function updateColors(colors) {
            // start with clean color list
            colorStorage = [];

            colors.forEach(function(c) {
                var color = {
                    rgb: createRgbString(c),
                    hex: createHexString(c),
                    name: ''
                };

                // Get color name, used for autofill option
                var name = ntc.name(color.hex)[1];
                color.autofill = name.replace(/\s+/g, '-').toLowerCase();

                colorStorage.push(color);
            });

            $rootScope.$emit(EVENTS.COLORS_UPDATE, colorStorage);
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

}(window.ntc));
