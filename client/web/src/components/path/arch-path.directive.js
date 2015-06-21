'use strict';
angular.module('archCarto')
  .directive('archPath', function(leafletData, $log, $mdSidenav, $q, archPathService, archPathJunctionService, $compile, $state, archLayerService, archElevationService, $mdDialog, $translate) {
    return {
      restrict: 'E',
      require: ['^archMap', '^archPath'],
      templateUrl: 'components/path/arch-path.html',
      controller: function($scope) {
        var controller = this;

        $scope._currentLayer = {};
        /*var _currentJunctionLayer = $scope._currentJunctionLayer = {};*/

        $scope.geoJson = {
          "type": "Feature",
          "geometry": {
            "type": "LineString",
            "coordinates": []
          },
          "properties": {
          }
        };

        $scope.hasDrawnPath = false;

        $scope.cancel = function() {
          $state.go('map.path.draw', {id: ''});
          $mdSidenav('right').close();
        };

        controller.cleanCurrentLayer = function() {
          if (scope._currentLayer) {
            map.removeLayer($scope._currentLayer);
            $scope.hasDrawnPath = false;
          }
        };

        controller.cleanCurrentJunctionsLayer = function() {
          if (scope._currentJunctionLayer) {
            map.removeLayer($scope._currentJunctionLayer);
            $scope.hasDrawnPath = false;
          }
        };

        controller.getCurrentLayer = function() {
          return $q.when($scope._currentLayer);
        };

        controller.getCurrentJunctionsLayer = function() {
          //return $q.when(_currentJunctionLayer);
        };

      },
      link: function(scope, element, attributes, controllers) {
        var archMap = controllers[0];
        var archPath = controllers[1];


        archMap.getLayer('path')
          .then(function(layer) {
            scope.layer = layer;

            return archMap.addControl('draw', L.Control.Draw, {
              draw: {
                polygon: false,
                marker: false,
                rectangle: false,
                circle: false
              },
              edit: {
                featureGroup: scope.layer.editable
              }
            });
          })
          .then(function(control) {
            return $q.all([
              leafletData.getMap(),
              archMap.getLayer('path'),
              control
            ]);
          })
          .then(function(results) {
            var map = results[0];
            var layer = results[1];
            var control = results[2];

            var guideLayers = layer.editable.getLayers();
            guideLayers.add(layer.notEditable.getLayers());

            control.setDrawingOptions({
              polyline: {
                archReferenceLayer: layer,
                guideLayers: guideLayers,
                snapDistance: 15
              }
            });

            var onDrawCreated = function (e) {
              var layerType = e.layerType;
              scope._currentLayer = e.layer;
              if (layerType === 'polyline') {
                var intersections = scope._currentLayer.archIntersection.getIntersections();
                // Temporarly adding the drawn path to the map
                map.addLayer(scope._currentLayer);

                $translate([
                    'ADD_THIS_PATH',
                    'ARE_YOU_SURE_YOU_WANT_TO_ADD_THIS_PATH',
                    'YES',
                    'NO'
                  ])
                  .then(function (translations) {
                    var confirm = $mdDialog.confirm()
                      .parent(angular.element(document.body))
                      .title(translations.ADD_THIS_PATH)
                      .content(translations.ARE_YOU_SURE_YOU_WANT_TO_ADD_THIS_PATH)
                      .ok(translations.YES)
                      .cancel(translations.NO);
                    return $mdDialog.show(confirm);
                  })
                  .then(function () {
                    intersections.forEach(function (intersection) {
                      // Promises are created for each path
                      debugger;
                      var pathGeoJsons = [];
                      intersection.paths.each(function (path) {
                        var pathPolyline = L.polyline(path);
                        // For debug
                        //L.Util.setOptions(pathPolyline, {
                        //  color: 'green'
                        //});
                        //pathPolyline.addTo(map);
                        //
                        pathGeoJsons.push(pathPolyline.toGeoJSON());
                      });

                      var junction = intersection.junction.toGeoJSON();
                      junction.properties.paths = pathGeoJsons;
                      debugger;
                      // Save the junction
                      //archPathJunctionService.save(junction);

                      /*
                       archPathService.save(pathGeoJson)
                       .then(function(result) {
                       debugger;
                       var junction  = intersection.junction;

                       archPathJunctionService.save()
                       });
                       */
                    });
                  })
                  .catch(function (err) {
                    return false;
                  })
                  .then(function () {
                    map.removeLayer(scope._currentLayer);
                    scope.hasDrownPath = false;
                    scope._currentLayer = null;
                    $state.go('map.path.draw', {id: ''});
                  });
                // map.addLayer(_currentJunctionLayer);
              }
            };

            var onDrawEdited = function(e) {
              var editedLayers = e.layers;
              editedLayers.eachLayer(function(layer) {
                var geoJson = layer.toGeoJSON();
              });
              //archPathService.savePaths()
            };

            map.on('draw:created', onDrawCreated);
            map.on('draw:edited', onDrawEdited);

            map.on('draw:clicked', function(e) {

              archElevationService.getElevation(e.lat, e.lng)
                .then(function(elevation){
                  var lat = e.lat;
                  var lng = e.lng;
                  var height = elevation.elevationProfile[0].height;
                  var coordinates = [lat, lng, height];
                  scope.geoJson.geometry.coordinates.push(coordinates);
                  if(archMap.removeControl('el'))
                  {
                    archMap.removeControl('el');
                    archMap.drawElevation(scope.geoJson);
                  }
                  else
                  {
                    archMap.drawElevation(scope.geoJson);

                  }
                });


            });

            // Suppression des controls de draw lors du changement d'action.
            scope.$on('$destroy', function () {
              map.off('draw:created', onDrawCreated);
              archMap.removeControl('elevation')
                .then(archMap.removeControl('draw'))
                .catch(function (err) {
                  $log.error(err);
                });
            });
          })
          .catch(function(err) {
            $log.error(err);
          });
      }
    }
  });
