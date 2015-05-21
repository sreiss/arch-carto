'use strict'
angular.module('archCarto')
  .directive('archPathDraw', function(archPathService, archPathJunctionService, $q, $mdSidenav, $mdToast, archTranslateService) {
    return {
      restrict: 'E',
      require: ['^archMap', '^archPath'],
      templateUrl: 'components/path/arch-path-draw.html',
      link: function(scope, element, attributes, controllers) {
        var archMap = controllers[0];
        var archPath = controllers[1];

        if(scope.id) {
          $mdSidenav('right').open();
        }

        scope.$watch('hasDrawnPath', function(hasDrawnPath) {

          scope.medias = [];
          if (hasDrawnPath) {
            $q.all([
                archPath.getCurrentLayer(),
                archPath.getCurrentJunctionsLayer()
              ])
              .then(function (results) {
                var currentLayer = results[0];
                var currentJunctionsLayer = results[1];

                var pathCoordinates = currentLayer.getLatLngs();

                $mdSidenav('right').open();

                scope.path = {
                  coordinates: pathCoordinates
                };

                scope.save = function(path) {
                  var junctionLayers = currentJunctionsLayer.getLayers();
                  junctionLayers.forEach(function(layer) {
                    var pathGeoJson = archPathService.toGeoJson(path);
                    for(var i = 0; i < scope.medias.length; i += 1) {
                      pathGeoJson.properties.medias.push(scope.medias[i].data._id);
                    }
                    debugger;
                    var junction = {
                      coordinates: layer.getLatLng(),
                      paths: [pathGeoJson]
                    };

                    var geoJson = archPathJunctionService.toGeoJson(junction);

                    archPathJunctionService.save(geoJson)
                      .then(function(result) {
                        $mdSidenav('right').close();
                        archPath.cleanCurrentLayer();
                        archPath.cleanCurrentJunctionsLayer();
                        archMap.getJunctionsLayer()
                          .then(function(layer) {
                            layer.addData(result.value)
                          })
                      });
                  });
                };
              });
          } else if (scope.id) {
            // If we are just editing the path
            archPathService.get(scope.id)
              .then(function(result) {
                scope.path = result.value;
                scope.save = function(path) {
                  for (var i = 0; i < scope.medias.length; i += 1) {
                    path.properties.medias.push(scope.medias[i].data._id);
                  }
                  archPathService.save(path)
                    .then(function(result) {
                      archTranslateService(result.message)
                        .then(function(translation) {
                          scope.$emit('pathUpdated', result.value);
                          $mdToast.show($mdToast.simple().content(translation));
                        });
                    });
                };
              });
          }

        });
      }
    };
  });
