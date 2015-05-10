(function() {
    'use strict';

    angular
        .module('sassColorPalette')
        .factory('sassService', sassService);

    /* @ngInject */
    function sassService(settingsService) {
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
        function createSass(colors) {
            var result = '',
                settings = settingsService.getSettings(),
                prefix = settings.type + settings.prefix;

            // Create string with all sass variabales
            colors.forEach(function(color) {
                var variable = prefix + color.name + ': ' + color.hex + ';\n';

                result += variable;
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
