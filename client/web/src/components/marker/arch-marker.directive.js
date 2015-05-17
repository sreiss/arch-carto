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
        var _poisLayer = null;
        var _bugsLayer = null;

        $scope.cancel = angular.noop;

        leafletData.getMap()
          .then(function(map) {
            _poisLayer = L.geoJson(null, {
              onEachFeature: function(feature, layer) {
                var iconOptions = {
                  icon: 'heart'
                };

                if (feature.properties.auditEvents[0].type == 'AWAITING_ADDITION') {
                  iconOptions.markerColor = 'purple';
                } else {
                  iconOptions.markerColor = 'blue';
                }

                layer.options.icon = L.AwesomeMarkers.icon(iconOptions);

                if (feature.properties) {
                  var html = angular.element('<arch-marker-poi-popup></arch-marker-poi-popup>');
                  layer.bindPopup(html[0], {poiId: feature._id, maxWidth: 600, minWidth: 600, className: 'arch-popup'});
                }
              }
            }).addTo(map);

            _bugsLayer = L.geoJson(null, {
              onEachFeature: function(feature, layer) {
                var iconOptions = {
                  icon: 'bug'
                };

                //if (feature.properties.auditEvents[0].type == 'AWAITING_ADDITION') {
                  iconOptions.markerColor = 'red';
                //}

                layer.options.icon = L.AwesomeMarkers.icon(iconOptions);
                if (feature.properties) {
                  var html = angular.element('<arch-marker-bug-popup></arch-marker-bug-popup>');
                  layer.bindPopup(html[0], {bugId: feature._id, maxWidth: 600, minWidth: 600, className: 'arch-popup'});
                }
              }
            }).addTo(map);

            controller.getPoisLayer = function() {
              return $q.when(_poisLayer);
            };

            controller.getBugsLayer = function() {
              return $q.when(_bugsLayer);
            };

            controller.cleanCurrentLayer = angular.noop;

            map.on('popupopen', function(event) {
              var popupScope = $scope.$new();
              var hasDirective = false;
              if (event.popup.options.poiId) {
                popupScope.poiId = event.popup.options.poiId;
                hasDirective = true;
              }
              if (event.popup.options.bugId) {
                popupScope.bugId = event.popup.options.bugId;
                hasDirective = true;
              }
              if (hasDirective) {
                $compile(event.popup._content)(popupScope);
              } else {
                popupScope.$destroy();
              }
            });

            map.on('popupclose', function(event) {
              $mdSidenav('right').close()
                .then(function() {
                  $state.go('map.marker.choice');
                });
            });

            archMarkerBugService.getList()
              .then(function(result) {
                result.value.forEach(function(feature) {
                  _bugsLayer.addData(feature);
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
