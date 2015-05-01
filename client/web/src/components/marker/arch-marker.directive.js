'use strict'
angular.module('archCarto')
  .directive('archMarker', function(leafletData, $log, $mdSidenav, $state, $q) {
    return {
      restrict: 'E',
      require: '^archMap',
      templateUrl: 'components/marker/arch-marker.html',
      controller: function($scope) {

        var _currentLayer = false;

        $scope.cancel = angular.noop;

        leafletData.getMap()
          .then(function(map) {
            map.on('draw:created', function (e) {
              if (_currentLayer !== false) {
                map.removeLayer(_currentLayer);
                $state.go('map.marker.choice');
              }

              var layerType = e.layerType;
              _currentLayer = e.layer;

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
        }

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
                polyline: false,
                rectangle: false,
                circle: false,
                polygon: false
              },
              edit: {
                featureGroup: featureGroup
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
