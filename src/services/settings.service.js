(function() {
    'use strict';

    angular
        .module('sassColorPalette')
        .factory('settingsService', settingsService);

    /* @ngInject */
    function settingsService($rootScope, events) {
        var service = {
            getSettings: getSettings,
            update: update
        };

        // Default settings
        var settings =  {
            prefix: 'color-',
            amount: 10,
            autofill: false,
            type: '$'
        };

        return service;

        /**
         * Gets settings object
         * @return {Object}
         */
        function getSettings() {
            return settings;
        }

        /**
         * Updates settings with new values
         * @param {Object} newSettings
         */
        function update(newSettings) {
            angular.extend(settings, newSettings);

            // Emit event to let controllers know settings have been updated
            $rootScope.$emit(events.SETTINGS_CHANGE, settings);
        }
    }

}());
