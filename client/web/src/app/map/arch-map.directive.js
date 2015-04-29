'use strict'
angular.module('archCarto')
  .directive('archMap', function (archMapService, archPoiService, archPathService, archBugService, archMarkerService, archGpxService, archMapDialogService, archLayerService, $mdToast, $mdDialog, $translate, leafletData, $window, $mdSidenav, archRolesService, archComponentsConstant, archFormatService, archMapControlService, archMapLayerService, $q, archMapInitConstant) {
    return {
      restrict: 'E',
      templateUrl: 'app/map/arch-map.html',
      controller: function($scope) {
        $scope.x = '30px';
        $q.all([
            archMapControlService.registerControls(archMapInitConstant.controls),
            archMapLayerService.registerLayers(archMapInitConstant.layers)
          ])
          .then(function() {
            return $q.all([
              archMapControlService.getControls(),
              archMapLayerService.getLayers()
            ]);
          })
          .then(function(results) {
            angular.extend($scope, {
              map: {
                center: {
                  lat: 49.08655299999999,
                  lng: 7.483997999999929,
                  zoom: 12
                },
                layers: results[1],
                markers: {},
                paths: {},
                controls: results[0],
                isInit: false
              }
            });
          })
          .then(function() {
            //debugger;
            setTimeout(function() {
              $scope.map.isInit = true;
            }, 1000);
          });


        $scope.cursor = {
            lat: 49.08655299999999,
            lng: 7.483997999999929
        };

        $scope.mapStatus = {
          selectedCoordinates: null,
          clicked: false
        };
        $scope.actions = {};


        this.getMap = function() {
          return leafletData.getMap();
        };

        this.getCenter = function() {
          return $scope.map.center;
        };

        this.setCenter = function(coordinates) {
          $scope.map.center.lat = coordinates.lat;
          $scope.map.center.lng = coordinates.lng;
        };

        this.displayGeoJson = function(geoJson) {
          this.getMap().then(function(map){
            var myLayer = L.geoJson(geoJson).addTo(map);
          });
        };

        this.displayElevation = function(geoJson) {
          //all used options are the default values
          //var el = $scope.controls.Elevation;
          this.getMap().then(function(map) {
            //el.clear();
            //TO DO clear el to have only one chart
            //map.removeControl(el);
            var el = L.control.elevation({
              position: "topright",
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
            //el.clearLayers();
            el.addTo(map);
            var layer = L.geoJson(geoJson, {
              onEachFeature: el.addData.bind(el)
               //working on a better solution
            }).addTo(map);
            map.fitBounds(layer.getBounds());

          });
        }


        // region action api

        var hasAction = false;

        $scope.addActions = function(actions) {
          for(var i = 0; i < actions.length; i += 1) {
            $scope.actions[actions[i]] = false;
          }
        };

        $scope.setAction = function(actionName) {
          for (var action in $scope.actions) {
            $scope.actions[action] = false
          }
          if (angular.isDefined($scope.actions[actionName])) {
            if ($scope.actions[actionName]) {
              $scope.toggleRight();
            } else {
              if (!hasAction) {
                $scope.openRight();
              } else {
                $scope.closeRight();
              }
            }
            $scope.actions[actionName] = true;
            var hasAction = true;
          } else {
            $scope.closeRight();
            var hasAction = false;
          }
        };

        $scope.hasAction = function() {
          return hasAction;
        };

        // endregion

        var refreshMarkers = this.refreshMarkers = function() {
          archMapService.refreshMarkers()
            .then(function(markers) {
              angular.extend($scope.markers, markers);
            });
          /*  archMapService.refreshMarkers(markerTypes[i])
           .then(function(markers) {
           angular.extend($scope.markers, markers);
           });
           leafletData.getMap('arch-map')
           .then(function (map) {
           console.log(map.getBounds());
           });*/
        };

        $scope.$on('leafletDirectiveMap.load', function(event, args) {
          refreshMarkers();

          $mdSidenav('leftSideNav').toggle();
          $mdSidenav('leftSideNav').open();


          //fix the gray area when the map load
          leafletData.getMap()
             .then(function(map) {
             L.Util.requestAnimFrame(map.invalidateSize,map,!1,map._container);
          });

          /*archMapDialogService.showCenterDialog()
           .then(setCenter);*/
          //LxDialogService.open('chooseCenterDialog');
        });
        //probably need to  be in a service
        $scope.openLeft = function() {
          $mdSidenav('leftSideNav').open();
        };

        $scope.closeLeft = function () {
          $mdSidenav('leftSideNav').close();
        };

        $scope.toggleLeft = function() {
          $mdSidenav('leftSideNav').toggle();
        };
        $scope.openRight = function() {
          $mdSidenav('rightSideNav').open();
        };

        $scope.closeRight = function () {
          $mdSidenav('rightSideNav').close();
        };

        $scope.toggleRight = function() {
          $mdSidenav('rightSideNav').toggle();
        };

        angular.forEach(archComponentsConstant, function(component, name) {
          leafletData.getMap()
            .then(function(map) {

              console.log(L);
              /*
              var componentClassName = archFormatService.capitalize(name);
              L.Control[componentClassName] = L.Control.extend({
                options: {
                  position: 'topleft'
                },

                onAdd: function (map) {
                  debugger;
                  var controlDiv = L.DomUtil.create('div', 'leaflet-control-command');
                  L.DomEvent
                    .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
                    .addListener(controlDiv, 'click', L.DomEvent.preventDefault)
                    .addListener(controlDiv, 'click', function () { MapShowCommand(); });

                  var controlUI = L.DomUtil.create('div', 'leaflet-control-command-interior', controlDiv);
                  controlUI.title = 'Map Commands';
                  return controlDiv;
                }
              });

              L.control[name] = function (options) {
                var ComponentClass = L.Control[componentClassName];
                return new ComponentClass(options);
              };

              L.Map.addInitHook(function () {
                if (this.options.drawControl) {
                  this.drawControl = new L.Control.Draw();
                  this.addControl(this.drawControl);
                }
              });

              console.log(L);
              $scope.controls[name] = {};
              debugger;
              */
            });
        });
      },
      link: function(scope, element, attributes) {
        //archMapService.init()
        //  .then(function(layers) {
        //    angular.extend(scope.layers, layers);
        //
        //    var pathDrawer = scope.pathDrawer = archPathService.getPathDrawer();
        //
        //    var refreshMarkers = scope.refreshMarkers;
        //
        //    scope.pathDrawn = function() {
        //      return archPathService.pathDrawn();
        //    };
        //
        //    // region actions
        //
        //    scope.disablePathDrawer = function() {
        //      pathDrawer.enabled = false;
        //      archLayerService.showLayers(['poi', 'bug']);
        //      archLayerService.hideLayers(['pathDrawer']);
        //      $translate(['PATH_DRAWER_QUIT']).then(function(translations) {
        //        $mdToast.show($mdToast.simple().content(translations.PATH_DRAWER_QUIT));
        //      });
        //    };
        //
        //    scope.deletePath = function() {
        //      archPathService.deletePath()
        //        .then(function(markerIds) {
        //          markerIds.forEach(function(markerId) {
        //            delete scope.markers[markerId];
        //          });
        //        });
        //    };
        //
        //    // endregion
        //
        //    // region event handlers
        //
        //    // We refresh the markers when the user moves or zooms in or out.
        //    scope.$on('leafletDirectiveMap.moveend', refreshMarkers);
        //
        //    scope.$on('leafletDirectiveMap.mousemove', function (event, args) {
        //      var leafletEvent = args.leafletEvent;
        //      var latlng = leafletEvent.latlng;
        //      scope.cursor.lat = latlng.lat;
        //      scope.cursor.lng = latlng.lng;
        //    });
        //
        //    scope.$on('leafletDirectiveMap.click', function(event, args) {
        //      scope.mapStatus.selectedCoordinates = {
        //        latitude: args.leafletEvent.latlng.lat,
        //        longitude: args.leafletEvent.latlng.lng
        //      };
        //
        //      scope.mapStatus.clicked = true;
        //
        //      archMarkerService.removeMarkers('selectedCoordinates')
        //        .then(function() {
        //          archMarkerService.addEntity('selectedCoordinates', {
        //            _id: '-1',
        //            coordinates: scope.mapStatus.selectedCoordinates
        //          });
        //        });
        //    });
        //
        //    // endregion
        //
        //  });
      }
    };
  });
