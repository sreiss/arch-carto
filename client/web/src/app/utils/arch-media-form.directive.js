'use strict'
angular.module('archCarto')
  .directive('archMediaForm', function(archMediaService) {
    return {
      restrict: 'E',
      scope: {
        uploadUrl: '=',
        added: '='
      },
      templateUrl: 'app/utils/arch-media-form.html',
      link: function(scope, element, attributes) {
        scope.dropAvailable = true;
        scope.metas = [];

        scope.$watch('files', function(files) {
          if (files && files.length) {
            scope.metas = [];
            for (var i = 0; i < files.length; i += 1) {
              scope.metas.push({
                name: '',
                description: ''
              });
            }
          }
        });

        scope.upload = function(file, metas) {
          archMediaService.upload(scope.uploadUrl, {
              data: file,
              metas: metas
            })
            .then(function(media) {
              scope.added = [];
              scope.added.push(media);
            });
        };
      }
    };
  });
