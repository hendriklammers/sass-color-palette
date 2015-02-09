(function() {
    'use strict';

    angular
        .module('app', ['ui.sortable', 'ngDialog'])

        .directive('imageUpload', function() {
            var directive = {
                restrict: 'EA',
                template: '<div class="dropzone"><span class="dropzone-label">Drag an image in this area</div>',
                replace: true,
                link: function(scope, elem, attr) {
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
            };

            return directive;
        })

        .factory('sassService', function() {
            var sassVariables = '',
                service = {
                    createSass: createSass,
                    getSass: getSass
                };

            return service;

            function createSass(colors, prefix) {
                var result = '';

                colors.forEach(function(elem) {
                    var color = prefix + elem.name + ': ' + elem.hex + ';\n';

                    result += color;
                });

                sassVariables = result;

                return result;
            }

            function getSass() {
                return sassVariables;
            }
        })

        .controller('ResultDialogController', ['$scope', 'sassService', function($scope, sassService) {
            $scope.result = sassService.getSass();
        }])

        .controller('ColorListController', ['ngDialog', 'sassService', function(ngDialog, sassService) {
            var vm = this;

            vm.prefix = 'color-';

            vm.sortableOptions = {
                handle: '.handle'
            };

            vm.colors = [
                {hex: '#3498db', name: 'blue'},
                {hex: '#16a085', name: 'green'},
                {hex: '#c0392b', name: 'red'},
                {hex: '#f1c40f', name: 'yellow'},
                {hex: '#8e44ad', name: 'purple'}
            ];

            vm.removeColor = function(index) {
                vm.colors.splice(index, 1);
            };

            vm.createSass = function() {
                sassService.createSass(vm.colors, vm.prefix);

                ngDialog.open({
                    template: 'js/resultdialog.html',
                    controller: 'ResultDialogController'
                });
            };
        }]);

}());
