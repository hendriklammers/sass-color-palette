(function() {
    'use strict';

    angular
        .module('sassColorPalette')
        .factory('sassService', sassService);

    /* @ngInject */
    function sassService() {
        var sassVariables = '',
            service = {
                createSass: createSass,
                getSass: getSass
            };

        return service;

        /**
         * Creates valid sass variables from an array of colors
         * @param {array} colors - List of hex values
         * @param {string} prefix - Every variable name will start with given prefix
         * @return {string}
         */
        function createSass(colors, prefix) {
            var result = '';

            colors.forEach(function(elem) {
                var color = prefix + elem.name + ': ' + elem.hex + ';\n';

                result += color;
            });

            // Store result in the service
            sassVariables = result;

            return result;
        }

        /**
         * Makes stored sass output available to controllers
         * @return {string}
         */
        function getSass() {
            return sassVariables;
        }
    }

}());
