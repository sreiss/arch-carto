'use strict'
angular.module('archCarto')
  .directive('archMap', function (archMapService, archPoiService, archPathService, archBugService, archMarkerService, archGpxService, archMapDialogService, archLayerService, $mdToast, $mdDialog, $translate, leafletData, $window, $mdSidenav) {
    return {
      restrict: 'E',
      templateUrl: 'components/map/arch-map.html',
      controller: function($scope) {
        $scope.center = {
          lat: 49.08655299999999,
          lng: 7.483997999999929,
          zoom: 12
        };
        $scope.layers = {

        };
        $scope.markers = {

        };
        $scope.paths = {

        };
        $scope.cursor = {
          lat: 49.08655299999999,
          lng: 7.483997999999929
        };
        $scope.mapStatus = {
          selectedCoordinates: null,
          clicked: false
        };
        $scope.actions = {
          addPoi: false
        };

        leafletData.getMap('arch-map')
          .then(function(map) {
            map.addLayer($window.MQ.mapLayer());
            //var gpx = ; // URL to your GPX file or the GPX itself

            //new L.GPX(gpx, {async: true}).on('loaded', function(e) {
            //  map.fitBounds(e.target.getBounds());
            //}).addTo(map);
          });
        archGpxService.getGpxUploader()
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

              var tiles = L.tileLayer('//{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png', {
                maxZoom: 18
              });
              tiles.addTo(map);

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
          });

        this.getMap = function() {
          return leafletData.getMap('arch-map');
        };

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
      },
      link: function(scope, element, attributes) {
        archMapService.init()
          .then(function(layers) {
            angular.extend(scope.layers, layers);

            var pathDrawer = scope.pathDrawer = archPathService.getPathDrawer();

            var refreshMarkers = scope.refreshMarkers;

            //archGpxService.getGpxUploader()
            //  .then(function(gpxUploader) {
            //    scope.gpxUploader = gpxUploader;
            //    //console.log("toto");
            //    console.log(gpxUploader);
            //    //console.log("toto");
            //
            //    leafletData.getMap('map').then(function(map) {
            //      console.log("toto");
            //      new L.GPX(
            //        gpxUploader, {
            //          async: true
            //        }
            //      ).on('loaded',
            //        function(e) {
            //          map.fitBounds(e.target.getBounds());
            //        }
            //      ).addTo(map);
            //      });
            //  });

            var setCenter = function(coordinates) {
              scope.center.lat = coordinates.latitude;
              scope.center.lng = coordinates.longitude;
            };

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

              archMarkerService.addEntity('selectedCoordinates', {
                _id: '-1',
                coordinates: scope.mapStatus.selectedCoordinates
              });




              //$mdSidenav('sideNavLeft').toggle();

              /*if (scope.pathDrawer.enabled) {
                archPathService.addPoint(selectedCoordinates)
                  .then(function(marker) {
                    scope.markers[marker._id] = marker;
                  });
              } else {
                archMapDialogService.showActionDialog()
                  .then(function(action) {
                    if (action == 'poi') {
                      archMapDialogService.showPoiDialog(selectedCoordinates)
                        .then(archPoiService.savePoi)
                        .then(function() {
                          refreshMarkers();
                          $translate(['POINT_OF_INTEREST_ADDED']).then(function(translations) {
                            $mdToast.show($mdToast.simple().content(translations.POINT_OF_INTEREST_ADDED));
                          });
                        });
                    } else if (action == 'bug') {
                      archMapDialogService.showBugDialog(selectedCoordinates)
                        .then(archBugService.saveBug)
                        .then(function() {
                          refreshMarkers();
                          $translate(['BUG_REPORTED']).then(function(translations) {
                            $mdToast.show($mdToast.simple().content(translations.BUG_REPORTED));
                          });
                        });
                    } else if (action == 'gpx') {
                      archMapDialogService.showGpxDialog()
                        .then(archGpxService.saveGpx)
                        .then(function() {
                          refreshPaths();
                          $translate(['GPX_UPLOADED']).then(function(translations) {
                            $mdToast.show($mdToast.simple().content(translations.GPX_UPLOADED));
                          });
                        });
                    } else if (action == 'center') {
                      archMapDialogService.showCenterDialog(selectedCoordinates)
                        .then(setCenter)
                    } else if (action == 'path') {
                      scope.pathDrawer.enabled = true;
                      archLayerService.showLayers(['pathDrawer']);
                      archLayerService.hideLayers(['poi', 'bug']);
                      scope.paths['pathDrawer'] = archPathService.getPathDrawer().currentPath;
                      $translate(['PATH_DRAWER_ENABLED']).then(function(translations) {
                        $mdToast.show($mdToast.simple().content(translations.PATH_DRAWER_ENABLED));
                      });
                    }
                  });
                }*/
            });


            // endregion

          });
      }
    };
  });
