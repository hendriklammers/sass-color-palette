(function() {
    'use strict';

    angular
        .module('sassColorPalette')
        .directive('imageDrop', imageDrop);

    function imageDrop() {
        var directive = {
            restrict: 'EA',
            template: '<div class="dropzone"><span class="dropzone-label">Drag an image in this area</div>',
            replace: true,
            link: link
        };

        return directive;

        function link(scope, elem, attr) {
            window.addEventListener('dragover', function(e){
                e = e || event;
                e.preventDefault();
            }, false);
            window.addEventListener('drop', function(e){
                e = e || event;
                e.preventDefault();
            }, false);

            elem[0].addEventListener('drop', dropHandler);

            function dropHandler(event) {
                event.preventDefault();

                for (var i = 0; i < event.dataTransfer.files.length; i++) {
                    console.log(i);
                }

                // var $draggedImages = $('#dragged-images');
                // var imageType      = /image.*/;
                // var fileCount      = files.length;
                //
                // for (var i = 0; i < fileCount; i++) {
                //     var file = files[i];
                //
                //     if (file.type.match(imageType)) {
                //         var reader = new FileReader();
                //         reader.onload = function(event) {
                //             imageInfo = { images: [
                //                 {'class': 'dropped-image', file: event.target.result}
                //             ]};
                //
                //             var imageSectionHTML = Mustache.to_html($('#image-section-template').html(), imageInfo);
                //             $draggedImages.prepend(imageSectionHTML);
                //
                //             var $imageSection = $draggedImages.find('.image-section').first();
                //             var $image        = $('.dropped-image .target-image');
                //
                //             // Must wait for image to load in DOM, not just load from FileReader
                //             $image.on('load', function() {
                //                 showColorsForImage($image, $imageSection);
                //             });
                //         };
                //         reader.readAsDataURL(file);
                //     } else {
                //         alert('File must be a supported image type.');
                //     }
                // }
            }
        }
    }
}());
