(function(ColorThief) {
    'use strict';

    angular
        .module('sassColorPalette')
        .directive('imageDrop', imageDrop);

    /* @ngInject */
    function imageDrop(colorService) {
        var directive = {
            restrict: 'EA',
            template: '<div class="imagedrop"><span class="imagedrop-label">Drag an image in this area</div>',
            replace: true,
            link: link
        };

        return directive;

        function link(scope, elem) {
            var colorThief = new ColorThief();

            // Disable default drag/drop browser behaviour
            window.addEventListener('dragover', function(e){
                e = e || event;
                e.preventDefault();
            }, false);
            window.addEventListener('drop', function(e){
                e = e || event;
                e.preventDefault();
            }, false);

            // Listen for drop event on directive element
            elem[0].addEventListener('drop', handleFileDrop);

            /**
             * Gets triggerd when user drops file in dropzone
             * @param event
             */
            function handleFileDrop(event) {
                event.preventDefault();

                for (var i = 0; i < event.dataTransfer.files.length; i++) {
                    var file = event.dataTransfer.files[i];

                    // Check if dropped file is an image
                    if (file.type.match(/image.*/)) {
                        var reader = new FileReader();

                        reader.onload = handleFileLoad;

                        reader.readAsDataURL(file);
                    } else {
                        window.alert('Filetype not supported.');
                    }
                }
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
                };

                img.src = event.target.result;
            }
        }
    }
}(ColorThief));
