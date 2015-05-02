(function() {
    'use strict';

    angular
        .module('sassColorPalette')
        .factory('settingsService', settingsService);

    /* @ngInject */
    function settingsService() {
        var service = {
            // Default settings
            prefix: 'color-',
            amount: 10,
            autofill: false,
            type: '$'
        };

        return service;
    }

}());
