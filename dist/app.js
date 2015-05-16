(function() {
    'use strict';

    angular
        .module('sassColorPalette', [
            'ngDialog',
            'ui.sortable'
        ])
        .constant('PATTERN', /^[A-Za-z0-9\-\_]+$/)
        .constant('EVENTS', {
            COLORS_UPDATE: 'colorsUpdate',
            SETTINGS_CHANGE: 'settingsChange'
        });

}());

(function() {
    'use strict';

    angular
        .module('sassColorPalette')
        .controller('ColorListController', ColorListController);

    /* @ngInject */
    function ColorListController($scope, ngDialog, sassService, colorService, $rootScope, EVENTS, PATTERN, settingsService) {
        var vm = this;

        vm.settings = settingsService.getSettings();
        vm.pattern = PATTERN;
        vm.colors = [];
        vm.showErrors = false;
        vm.removeColor = removeColor;
        vm.submitColorForm = submitColorForm;

        vm.sortableOptions = {
            // handle: '.handle'
        };

        // Listen for changes in settings panel
        $rootScope.$on(EVENTS.SETTINGS_CHANGE, handleSettingsUpdate);

        // Listen colorsUpdated event dispatched by colorService
        $rootScope.$on(EVENTS.COLORS_UPDATE, handleColorsUpdate);

        /**
         * Update settings on scope with settings from service
         * @return {undefined}
         */
        function handleSettingsUpdate(event, data) {
            vm.settings = data;

            autofillColors();
        }

        /**
         * get colors from service on colorsUpdate event
         * @return {undefined}
         */
        function handleColorsUpdate() {
            vm.colors = colorService.getColors();

            // Make sure view gets updated
            $scope.$apply();

            autofillColors();
        }

        /**
         * removes color at index
         * @param {number} index
         */
        function removeColor(index) {
            vm.colors.splice(index, 1);
        }

        /**
         * Validates form and proceed to create sass output
         * @return {undefined}
         */
        function submitColorForm() {
            if ($scope.colorForm.$invalid) {
                vm.showErrors = true;
            } else {
                sassService.createSass(vm.colors);

                ngDialog.open({
                    template: 'src/templates/resultdialog.html'
                });
            }
        }

        /**
         * Fills name field with generated color name
         * @return {undefined}
         */
        function autofillColors() {
            vm.colors.forEach(function(color) {
                // Before doing anything store custom name values
                if (color.name && color.name !== color.autofill) {
                    color.custom = color.name;
                }

                // Only autofill when no custom name is entered
                if (vm.settings.autofill) {
                    if (!color.name) {
                        color.name = color.autofill;
                    }
                } else {
                    if (color.custom) {
                        color.name = color.custom;
                    } else {
                        color.name = '';
                    }
                }
            }); 
        }
    }
    ColorListController.$inject = ["$scope", "ngDialog", "sassService", "colorService", "$rootScope", "EVENTS", "PATTERN", "settingsService"];

}());

(function() {
    'use strict';

    angular
        .module('sassColorPalette')
        .controller('ResultDialogController', ResultDialogController);

    /* @ngInject */
    function ResultDialogController($scope, sassService) {
        var vm = this;

        vm.output = sassService.getSass();

        // Select contents of textarea
        vm.selectText = function($event) {
            $event.target.select();
        };
    }
    ResultDialogController.$inject = ["$scope", "sassService"];

}());

(function() {
    'use strict';

    angular
        .module('sassColorPalette')
        .controller('SettingsController', SettingsController);

    /* @ngInject */
    function SettingsController($scope, settingsService, PATTERN) {
        var vm = this;
        
        // Use settings from the service
        vm.settings = settingsService.getSettings();

        // Valid character set for variable names
        vm.namePattern = PATTERN;

        // Watch for changes on the settings object
        $scope.$watch(function() {
            return vm.settings;
        }, function(newVal) {
            settingsService.update(newVal);
        }, true);
    }
    SettingsController.$inject = ["$scope", "settingsService", "PATTERN"];

}());

(function(ColorThief) {
    'use strict';

    angular
        .module('sassColorPalette')
        .directive('imageDrop', imageDrop);

    /* @ngInject */
    function imageDrop(colorService, settingsService) {
        var directive = {
            restrict: 'EA',
            templateUrl: 'src/templates/imagedrop.html',
            replace: true,
            link: link
        };

        return directive;

        /**
         * Directive link function
         * @param scope
         * @param elem
         */
        function link(scope, elem) {
            var colorThief = new ColorThief();

            disableDefault();

            // Listen for drop events on directive element
            elem[0].addEventListener('drop', handleFileDrop);
            elem[0].addEventListener('dragenter', handleDragEnter);
            elem[0].addEventListener('dragleave', handleDragLeave);

            /**
             * Gets triggerd when user drops file in dropzone
             * @param event
             */
            function handleFileDrop(event) {
                event.preventDefault();

                elem[0].classList.remove('dragging');

                scope.isBusy = true;

                for (var i = 0; i < event.dataTransfer.files.length; i++) {
                    var file = event.dataTransfer.files[i];

                    // Check if dropped file is an image
                    if (file.type.match(/image.*/)) {
                        var reader = new FileReader();

                        reader.onload = handleFileLoad;

                        reader.readAsDataURL(file);
                    } else {
                        scope.isBusy = false;

                        window.alert('Filetype not supported.');
                    }
                }
            }

            /**
             * Add class when user drags file over dropzone
             */
            function handleDragEnter() {
                elem[0].classList.add('dragging');
            }

            /**
             * Remove class when user drags file out of dropzone
             */
            function handleDragLeave() {
                elem[0].classList.remove('dragging');
            }

            /**
            * Gets triggered when file is loaded
            * Creates new image object and calls colorThief
            * @param event
            */
            function handleFileLoad(event) {
                var img = new Image();

                img.src = event.target.result;

                // Add image to dom
                var imgElem = document.createElement('img');
                imgElem.setAttribute('src', img.src);
                imgElem.setAttribute('alt', 'imagedrop image');
                imgElem.classList.add('imagedrop-image');
                imgElem.classList.add('loading');

                // Clear container and add image to it
                var container = elem[0].querySelectorAll('.imagedrop-image-container');
                container[0].innerHTML = '';
                container[0].appendChild(imgElem);

                elem[0].classList.add('contains-image');

                // Wait before the actual image is loaded
                img.onload = function() {
                    var size = settingsService.getSettings().amount, 
                        colors = colorThief.getPalette(img, size);

                    colorService.updateColors(colors);

                    scope.isBusy = false;
                    scope.$apply();

                    imgElem.classList.remove('loading');
                };
            }

            /**
             * Disables default drag/drop browser behavior
             */
            function disableDefault() {
                window.addEventListener('dragover', function(e){
                    e = e || event;
                    e.preventDefault();
                }, false);
                window.addEventListener('drop', function(e){
                    e = e || event;
                    e.preventDefault();
                }, false);
            }
        }
    }
    imageDrop.$inject = ["colorService", "settingsService"];
}(ColorThief));

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
    colorService.$inject = ["$rootScope", "EVENTS"];

}(window.ntc));

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
    sassService.$inject = ["settingsService"];

}());

(function() {
    'use strict';

    angular
        .module('sassColorPalette')
        .factory('settingsService', settingsService);

    /* @ngInject */
    function settingsService($rootScope, EVENTS) {
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
            $rootScope.$emit(EVENTS.SETTINGS_CHANGE, settings);
        }
    }
    settingsService.$inject = ["$rootScope", "EVENTS"];

}());

//# sourceMappingURL=app.js.map