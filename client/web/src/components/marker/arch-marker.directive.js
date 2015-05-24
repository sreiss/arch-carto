'use strict'
angular.module('archCarto')
  .directive('archMarker', function(leafletData, $log, $mdSidenav, $state, $q, archMarkerPoiService, archMarkerBugService, $compile) {
    return {
      restrict: 'E',
      require: '^archMap',
      templateUrl: 'components/marker/arch-marker.html',
      controller: function($scope) {
        var controller = this;

        var _currentLayer = false;

        $scope.cancel = angular.noop;

        leafletData.getMap()
          .then(function(map) {

            controller.cleanCurrentLayer = angular.noop;

            map.on('draw:edited', function(e) {
              var layers = e.layers;
              layers.eachLayer(function(layer) {
                var geoJson = layer.toGeoJSON();
                archMarkerBugService.save(geoJson);
              });
            });

            map.on('draw:created', function (e) {
              if (_currentLayer !== false) {
                map.removeLayer(_currentLayer);
                $state.go('map.marker.choice');
              }

              var layerType = e.layerType;
              _currentLayer = e.layer;

              controller.cleanCurrentLayer = function() {
                map.removeLayer(_currentLayer);
                controller.cleanCurrentLayer = angular.noop;
              };

              map.addLayer(_currentLayer);

              if (layerType == 'marker') {
                $mdSidenav('right').open();
              }

              $scope.cancel = function() {
                map.removeLayer(_currentLayer);
                $mdSidenav('right').close()
                  .then(function() {
                    _currentLayer = false;
                    $scope.cancel = angular.noop;
                    $state.go('map.marker.choice');
                  });
              };
            });
          });

        this.getCurrentLayer = function() {
          return $q.when(_currentLayer);
        };

      },
      link: function(scope, element, attributes, archMap) {

        archMap.getLayer('marker')
          .then(function(layer) {
            archMap.addControl('draw', L.Control.Draw, {
              draw: {
                polyline: false,
                rectangle: false,
                circle: false,
                polygon: false
              },
              edit: {
                featureGroup: layer
              }
            });
          })
          .catch(function(err) {
            $log.error(err);
          });

        scope.$on('$destroy', function() {
          archMap.removeControl('draw')
            .catch(function(err) {
              $log.error(err);
            });
        });
      }
    };
  });
