'use strict'
angular.module('archCarto')
  .directive('archMarker', function(leafletData, $log, $mdSidenav, $state, $q, archMarkerPoiService, $compile) {
    return {
      restrict: 'E',
      require: '^archMap',
      templateUrl: 'components/marker/arch-marker.html',
      controller: function($scope) {

        var _currentLayer = false;
        var _poisLayer = null;

        $scope.cancel = angular.noop;

        leafletData.getMap()
          .then(function(map) {
            _poisLayer = L.geoJson(null, {
              onEachFeature: function(feature, layer) {
                // does this feature have a property named popupContent?
                if (feature.properties && feature.properties.name) {
                  var html = angular.element('<arch-marker-poi-popup></arch-marker-poi-popup>');
                  layer.bindPopup(html[0], {poiId: feature._id, maxWidth: 600, minWidth: 600, className: 'arch-popup'});
                }
              }
            }).addTo(map);

            map.on('popupopen', function(event) {
              if (event.popup.options.poiId) {
                var popupScope = $scope.$new();
                popupScope.poiId = event.popup.options.poiId;
                $compile(event.popup._content)(popupScope);
              }
            });

            map.on('popupclose', function(event) {
              $mdSidenav('right').close()
                .then(function() {
                  $state.go('map.marker.choice');
                });
            });

            archMarkerPoiService.getList()
              .then(function(result) {
                result.value.forEach(function(feature) {
                  _poisLayer.addData(feature);
                });
              });

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
