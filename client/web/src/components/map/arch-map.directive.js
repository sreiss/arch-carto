'use strict'
angular.module('archCarto')
  .directive('archMap', function (archMapService, archPoiService, archPathService, archBugService, archMarkerService, archGpxService, archMapDialogService, archLayerService, $mdToast, $mdDialog, $translate, leafletData, $window, $mdSidenav, archRolesService) {
    return {
      restrict: 'E',
      templateUrl: 'components/map/arch-map.html',
      controller: function($scope) {
        angular.extend($scope, {
          center: {
            lat: 49.08655299999999,
            lng: 7.483997999999929,
            zoom: 12
          },
          layers: {

          },
          markers: {

          },
          paths: {

          },
          controls: {
            draw: {

            },
            Elevation: {
              position: "topleft",
              theme: "steelblue-theme",
              width: 600,
              height: 125,
              margins: {
                top: 10,
                right: 20,
                bottom: 30,
                left: 50
              },
              collapsed: true
            }
          }
        });

        leafletData.getMap().then(function(map) {
          var drawnItems = $scope.controls.edit.featureGroup;
          map.on('draw:created', function (e) {
            var layer = e.layer;
            drawnItems.addLayer(layer);
            console.log(JSON.stringify(layer.toGeoJSON()));
          });
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

        leafletData.getMap()
          .then(function(map) {
            map.addLayer($window.MQ.mapLayer());
            var tiles = L.tileLayer('//{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png', {
              maxZoom: 18
            });
            tiles.addTo(map);

            //var gpx = ; // URL to your GPX file or the GPX itself

            new L.GPX(gpx, {async: true}).on('loaded', function(e) {
              map.fitBounds(e.target.getBounds());
            }).addTo(map);
          });

        /*archGpxService.getGpxUploader()
          .then(function(gpxUploader) {
            //$scope.gpxUploader = gpxUploader;
            //console.log("toto");
            //console.log(gpxUploader);
            //console.log("toto");

            leafletData.getMap('arch-map').then(function(map) {
              //premiere version
              //console.log("toto");
              //var el = L.control.elevation();
              //el.addTo(map);
              //var g = new L.GPX(
              //  gpxUploader, {
              //    async: true
              //  }
              //).on('loaded',
              //  function(e) {
              //    map.fitBounds(e.target.getBounds());
              //  }
              //).addTo(map);
              //g.on("addline",function(e){
              //  el.addData(e.line);
              //});
              //g.addTo(map);

              //deuxieme version
              //
              //var url = 'http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg',
              //  attr ='Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
              //  service = new L.TileLayer(url, {subdomains:"1234",attribution: attr});





              var el = L.control.elevation({
                position: "topleft",
                theme: "steelblue-theme",
                width: 600,
                height: 125,
                margins: {
                  top: 10,
                  right: 20,
                  bottom: 30,
                  left: 50
                },
                collapsed: true

              });
              el.addTo(map);

              var g=new L.GPX(gpxUploader, {
                async: true
              });
              g.on('loaded', function(e) {
                map.fitBounds(e.target.getBounds());
              });
              g.on("addline",function(e){
                el.addData(e.line);
              });
              g.addTo(map);

              //map.addLayer(service);
            });
          });*/

        this.getMap = function() {
          return leafletData.getMap();
        };

        this.setCenter = function(coordinates) {
          $scope.center.lat = coordinates.latitude;
          $scope.center.lng = coordinates.longitude;
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
          /*archMapDialogService.showCenterDialog()
           .then(setCenter);*/
          //LxDialogService.open('chooseCenterDialog');
        });

        $scope.openLeft = function() {
          $mdSidenav('leftSideNav').open();
        };

        $scope.openRight = function() {
          $mdSidenav('rightSideNav').open();
        };

        $scope.closeLeft = function() {
          $mdSidenav('leftSideNav').close();
        };

        $scope.closeRight = function () {
          $mdSidenav('rightSideNav').close();
        };

        $scope.toggleRight = function() {
          $mdSidenav('rightSideNav').toggle();
        };

        $scope.toggleLeft = function() {
          $mdSidenav('leftSideNav').toggle();
        };
      },
      link: function(scope, element, attributes) {
        archMapService.init()
          .then(function(layers) {
            angular.extend(scope.layers, layers);

            var pathDrawer = scope.pathDrawer = archPathService.getPathDrawer();

            var refreshMarkers = scope.refreshMarkers;

            scope.pathDrawn = function() {
              return archPathService.pathDrawn();
            };

            // region actions

            scope.disablePathDrawer = function() {
              pathDrawer.enabled = false;
              archLayerService.showLayers(['poi', 'bug']);
              archLayerService.hideLayers(['pathDrawer']);
              $translate(['PATH_DRAWER_QUIT']).then(function(translations) {
                $mdToast.show($mdToast.simple().content(translations.PATH_DRAWER_QUIT));
              });
            };

            scope.deletePath = function() {
              archPathService.deletePath()
                .then(function(markerIds) {
                  markerIds.forEach(function(markerId) {
                    delete scope.markers[markerId];
                  });
                });
            };

            // endregion

            // region event handlers

            // We refresh the markers when the user moves or zooms in or out.
            scope.$on('leafletDirectiveMap.moveend', refreshMarkers);

            scope.$on('leafletDirectiveMap.mousemove', function (event, args) {
              var leafletEvent = args.leafletEvent;
              var latlng = leafletEvent.latlng;
              scope.cursor.lat = latlng.lat;
              scope.cursor.lng = latlng.lng;
            });

            scope.$on('leafletDirectiveMap.click', function(event, args) {
              scope.mapStatus.selectedCoordinates = {
                latitude: args.leafletEvent.latlng.lat,
                longitude: args.leafletEvent.latlng.lng
              };

              scope.mapStatus.clicked = true;

              archMarkerService.removeMarkers('selectedCoordinates')
                .then(function() {
                  archMarkerService.addEntity('selectedCoordinates', {
                    _id: '-1',
                    coordinates: scope.mapStatus.selectedCoordinates
                  });
                });
            });

            // endregion

          });
      }
    };
  });
