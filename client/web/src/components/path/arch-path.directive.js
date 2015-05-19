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
        var _pathLayer = null;
        var _junctionsLayer = null;

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

            _junctionsLayer = L.geoJson(null, {
              onEachFeature: function(feature, layer) {
                var iconOptions = {
                  icon: 'arrows'
                };

                //if (feature.properties.auditEvents[0].type == 'AWAITING_ADDITION') {
                iconOptions.markerColor = 'red';
                //}

                layer.options.icon = L.AwesomeMarkers.icon(iconOptions);
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

            archPathJunctionService.getList()
              .then(function(result) {
                result.value.forEach(function(junction) {
                  _junctionsLayer.addData(junction);
                  junction.properties.paths.forEach(function(path) {
                    _pathLayer.addData(path);
                  });
                });
              });

            map.on('draw:created', function (e) {
              var layerType = e.layerType;
              _currentLayer = e.layer;
              _currentJunctionLayer = L.featureGroup();

              controller.cleanCurrentLayer = function() {
                map.removeLayer(_currentLayer);
                $scope.hasDrawnPath = false;
                controller.cleanCurrentLayer = angular.noop;
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
                    $scope.cancel = angular.noop;
                    $state.go('map.path.draw');
                  });
              };
            });

            map.on('draw:drawstart', function(e) {
              /*
              var layerType = e.layerType;
              if (layerType === 'polyline') {
                map.on('mousemove', function(e) {
                  var index = leafletKnn(_pathLayer);
                  var nearestLayer = index.nearest(e.latlng, 1)[0].layer;
                  debugger;
                });
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
