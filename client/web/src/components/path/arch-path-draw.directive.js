'use strict'
angular.module('archCarto')
  .directive('archPathDraw', function(archPathService, archPathJunctionService, $q) {
    return {
      restrict: 'E',
      require: '^archPath',
      templateUrl: 'components/path/arch-path-draw.html',
      link: function(scope, element, attributes, archPath) {
        scope.$watch('hasDrawnPath', function(hasDrawnPath) {

          if (hasDrawnPath) {
            $q.all([
                archPath.getCurrentLayer(),
                archPath.getCurrentJunctionsLayer()
              ])
              .then(function (results) {
                var currentLayer = results[0];
                var currentJunctionsLayer = results[1];

                var pathCoordinates = currentLayer.getLatLngs();

                scope.path = {
                  coordinates: pathCoordinates
                };

                scope.save = function(path) {

                  var junctionLayers = currentJunctionsLayer.getLayers();
                  junctionLayers.forEach(function(layer) {
                    var junction = {
                      coordinates: layer.getLatLng(),
                      paths: [archPathService.toGeoJson(path)]
                    };

                    var geoJson = archPathJunctionService.toGeoJson(junction);

                    archPathJunctionService.save(geoJson);
                  });
                };
              });
          }

        });
      }
    };
  });
