'use strict'
angular.module('archCarto')
  .directive('archPath', function(leafletData, $log, $mdSidenav, $q, archPathService, $compile) {
    return {
      restrict: 'E',
      require: '^archMap',
      templateUrl: 'components/path/arch-path.html',
      controller: function($scope) {
        var controller = this;

        var _currentLayer = null;
        var _pathLayer = null;

        $scope.hasDrawnPath = false;

        leafletData.getMap()
          .then(function(map) {
            _pathLayer = L.geoJson(null, {
              onEachFeature: function(feature, layer) {
                if (feature.properties) {
                  var html = angular.element('<arch-path-details-popup></arch-path-details-popup>');
                  layer.bindPopup(html[0], {pathId: feature._id, maxWidth: 600, minWidth: 600, className: 'arch-popup'});
                }
              }
            }).addTo(map);

            controller.getPathLayer = function() {
              return $q.when(_pathLayer);
            };

            map.on('popupopen', function(event) {
              var popupScope = $scope.$new();
              var hasDirective = false;
              if (event.popup.options.pathId) {
                popupScope.pathId = event.popup.options.pathId;
                hasDirective = true;
              }
              if (hasDirective) {
                $compile(event.popup._content)(popupScope);
              } else {
                popupScope.$destroy();
              }
            });

            archPathService.getList()
              .then(function(result) {
                result.value.forEach(function(path) {
                  path.geometry.coordinates = path.geometry.coordinates;
                  _pathLayer.addData(path);
                });
              });

            map.on('draw:created', function (e) {
              var layerType = e.layerType;
              _currentLayer = e.layer;

              controller.cleanCurrentLayer = function() {
                map.removeLayer(_currentLayer);
                $scope.hasDrawnPath = false;
                controller.cleanCurrentLayer = angular.noop;
              };

              map.addLayer(_currentLayer);

              if (layerType == 'polyline') {
                $mdSidenav('right').open();
                $scope.hasDrawnPath = true;
              }

              $scope.cancel = function() {
                map.removeLayer(_currentLayer);
                $mdSidenav('right').close()
                  .then(function() {
                    $scope.hasDrawnPath = false;
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
