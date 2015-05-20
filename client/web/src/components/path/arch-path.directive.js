'use strict'
angular.module('archCarto')
  .directive('archPath', function(leafletData, $log, $mdSidenav, $q, archPathService, archPathJunctionService, $compile, $state) {
    return {
      restrict: 'E',
      require: '^archMap',
      templateUrl: 'components/path/arch-path.html',
      controller: function($scope) {
        var controller = this;

        var _currentLayer = null;
        var _currentJunctionLayer = null;

        $scope.hasDrawnPath = false;

        $scope.cancel = function() {
          $state.go('map.path.draw', {id: ''});
          $mdSidenav('right').close();
        };

        leafletData.getMap()
          .then(function(map) {

            map.on('draw:created', function (e) {
              var layerType = e.layerType;
              _currentLayer = e.layer;
              _currentJunctionLayer = L.featureGroup();

              controller.cleanCurrentLayer = function() {
                map.removeLayer(_currentLayer);
                $scope.hasDrawnPath = false;
                controller.cleanCurrentLayer = angular.noop;
              };

              controller.cleanCurrentJunctionsLayer = function() {
                map.removeLayer(_currentJunctionLayer);
                $scope.hasDrawnPath = false;
                controller.cleanCurrentJunctionsLayer = angular.noop;
              };

              map.addLayer(_currentLayer);
              map.addLayer(_currentJunctionLayer);

              if (layerType == 'polyline') {
                $mdSidenav('right').open();
                $scope.hasDrawnPath = true;

                var latlngs = _currentLayer.getLatLngs();
                _currentJunctionLayer.addLayer(L.marker(latlngs[0]));
                _currentJunctionLayer.addLayer(L.marker(latlngs[latlngs.length - 1]));
                //_currentJunctionLayer.addData(L.marker([])
              }

              $scope.cancel = function() {
                map.removeLayer(_currentLayer);
                map.removeLayer(_currentJunctionLayer);
                $mdSidenav('right').close()
                  .then(function() {
                    $scope.hasDrawnPath = false;
                    _currentLayer = null;
                    _currentJunctionLayer = null;
                    $scope.cancel = function() {
                      $state.go('map.path.draw', {id: ''});
                      $mdSidenav('right').close();
                    };
                    $state.go('map.path.draw');
                  });
              };
            });

            var nearestHook;
            map.on('draw:drawstart', function(e) {
              var layerType = e.layerType;
              if (layerType === 'polyline') {
                /*
                nearestHook = function(e) {
                  var index = leafletKnn(_junctionsLayer);
                  var nearestLayer = index.nearest(e.latlng, 1)[0].layer;
                  var cursor = e.latlng;
                  var layerCoords = nearestLayer.getLatLng();
                  console.log(cursor.distanceTo(layerCoords));

                  /*if (cursor.distanceTo(layerCoords) < 50) {
                    nearestLayer.setIcon(L.AwesomeMarkers.icon({
                      icon: 'arrows',
                      markerColor: 'green'
                    }));
                  } else {
                    nearestLayer.setIcon(L.AwesomeMarkers.icon({
                      icon: 'arrows',
                      markerColor: 'red'
                    }));
                  }
                };
                map.on('mousemove', nearestHook);
                */
              }
            });

            map.on('draw:drawstop', function(e) {
              /*
              if (nearestHook) {
                map.off('mousemove', nearestHook);
              }
              */
            });
          });

        this.getCurrentLayer = function() {
          return $q.when(_currentLayer);
        };

        this.getCurrentJunctionsLayer = function() {
          return $q.when(_currentJunctionLayer);
        };

      },
      link: function(scope, element, attributes, archMap) {

        archMap.hasFeatureGroup('edit')
          .then(function(hasFeatureGroup) {
            if (hasFeatureGroup) {
              return archMap.getFeatureGroup('edit');
            } else {
              return archMap.addFeatureGroup('edit', {});
            }
          })
          .then(function(featureGroup) {
            archMap.addControl('draw', L.Control.Draw, {
              draw: {
                polygon: false,
                marker: false,
                rectangle: false,
                circle: false
              },
              edit: {
                featureGroup: featureGroup
              }
            });
          })
          .catch(function(err) {
            $log.error(err);
          });

        // Suppression des controls de draw lors du changement d'action.
        scope.$on('$destroy', function() {
          archMap.removeControl('draw')
            .catch(function(err) {
              $log.error(err);
            });
        });
      }
    }
  });
