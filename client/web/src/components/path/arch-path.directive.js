'use strict';
angular.module('archCarto')
  .directive('archPath', function(leafletData, $log, $mdSidenav, $q, archPathService, archPathJunctionService, $compile, $state, archLayerService, archElevationService) {
    return {
      restrict: 'E',
      require: ['^archMap', '^archPath'],
      templateUrl: 'components/path/arch-path.html',
      controller: function($scope) {
        var controller = this;

        $scope._currentLayer = {};
        /*var _currentJunctionLayer = $scope._currentJunctionLayer = {};*/

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

        archMap.addControl('elevation', L.Control.Elevation, {
            position: "bottomleft",
            theme: "steelblue-theme", //default: lime-theme
            width: 600,
            height: 125,
            margins: {
            top: 10,
              right: 20,
              bottom: 30,
              left: 50
          },
          useHeightIndicator: true, //if false a marker is drawn at map position
            interpolation: "linear", //see https://github.com/mbostock/d3/wiki/SVG-Shapes#wiki-area_interpolate
            hoverNumber: {
            decimalsX: 3, //decimals on distance (always in km)
              decimalsY: 0, //deciamls on height (always in m)
              formatter: undefined //custom formatter function may be injected
          },
          xTicks: undefined, //number of ticks in x axis, calculated by default according to width
            yTicks: undefined, //number of ticks on y axis, calculated by default according to height
            collapsed: false    //collapsed mode, show chart on click or mouseover
        });

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

            control.setDrawingOptions({
              polyline: {
                archReferenceLayer: layer,
                guideLayers: layer.editable._layers,
                archIntersections: [],
                snapDistance: 20
              }
            });

            map.on('draw:created', function (e) {
              var layerType = e.layerType;
              scope._currentLayer = e.layer;
              var intersections = scope._currentLayer.archIntersection.getIntersections();
              var junctionLatLons = [];
              junctionLatLons.add(archLayerService.toLatLon(layer.editable));
              junctionLatLons.add(archLayerService.toLatLon(layer.notEditable));

              /*_currentJunctionLayer = L.featureGroup();*/

              map.addLayer(scope._currentLayer);
              // map.addLayer(_currentJunctionLayer);

              if (layerType == 'polyline') {
                $mdSidenav('right').open();
                scope.hasDrawnPath = true;

                control;
              }

              scope.cancel = function () {
                map.removeLayer(scope._currentLayer);
                //map.removeLayer(_currentJunctionLayer);
                $mdSidenav('right').close()
                  .then(function () {
                    scope.hasDrawnPath = false;
                    scope._currentLayer = null;
                    //_currentJunctionLayer = null;
                    scope.cancel = function () {
                      $state.go('map.path.draw', {id: ''});
                      $mdSidenav('right').close();
                    };
                    $state.go('map.path.draw');
                  });
              };
            });

            // Suppression des controls de draw lors du changement d'action.
            scope.$on('$destroy', function () {
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
