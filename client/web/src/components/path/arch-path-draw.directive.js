'use strict'
angular.module('archCarto')
  .directive('archPathDraw', function(archPathService) {
    return {
      restrict: 'E',
      require: '^archPath',
      templateUrl: 'components/path/arch-path-draw.html',
      link: function(scope, element, attributes, archPath) {
        scope.$watch('hasDrawnPath', function(hasDrawnPath) {

          if (hasDrawnPath) {
            archPath.getCurrentLayer()
              .then(function (layer) {
                var coordinates = layer.getLatLngs();

                scope.path = {
                  altitudes: [],
                  coordinates: coordinates
                };

                scope.save = function(path) {
                  var geoJson = archPathService.toGeoJson(path);
                  archPathService.save(geoJson)
                    .then(function(result) {
                      debugger;
                    });
                };
              });
          }

        });
      }
    };
  });
