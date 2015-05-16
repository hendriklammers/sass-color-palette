(function() {
    'use strict';

    angular
        .module('sassColorPalette', ['ngDialog'])
        .constant('PATTERN', /^[A-Za-z0-9\-\_]+$/)
        .constant('EVENTS', {
            COLORS_UPDATE: 'colorsUpdate',
            SETTINGS_CHANGE: 'settingsChange'
        });

}());
