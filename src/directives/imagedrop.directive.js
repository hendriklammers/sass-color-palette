(function(ColorThief) {
    'use strict';

    angular
        .module('sassColorPalette')
        .directive('imageDrop', imageDrop);

    /* @ngInject */
    function imageDrop(colorService) {
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

                // Wait before the actual image is loaded
                img.onload = function() {
                    var colors = colorThief.getPalette(img, 100);

                    colorService.updateColors(colors);

                    scope.isBusy = false;
                    scope.$apply();
                };

                img.src = event.target.result;
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
}(ColorThief));
