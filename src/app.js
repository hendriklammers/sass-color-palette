(function() {
    'use strict';

    angular
        .module('sassColorPalette', ['ui.sortable', 'ngDialog'])
        .constant('events', {
            COLORS_UPDATE: 'colorsUpdate',
            SETTINGS_CHANGE: 'settingsChange'
        });

}());
