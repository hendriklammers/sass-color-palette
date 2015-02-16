(function() {
    'use strict';

    angular
        .module('sassColorPalette', ['ui.sortable', 'ngDialog'])
        .constant('events', {
            COLORS_UPDATED: 'colorsUpdated'
        });

}());
