(function(ColorThief) {
    'use strict';

    angular
        .module('sassColorPalette')
        .directive('imageDrop', imageDrop);

    /* @ngInject */
    function imageDrop(colorService) {
        var colorAmount = 10;
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
                elem[0].appendChild(imgElem);

                elem[0].classList.add('contains-image');

                // Wait before the actual image is loaded
                img.onload = function() {
                    var colors = colorThief.getPalette(img, colorAmount);

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
}(ColorThief));
