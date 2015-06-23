'use strict'
angular.module('archCarto')
  .directive('archMap', function(
    geolocation, $q, $log, $compile,
    $translate, $mdSidenav, $mdDialog, $mdToast, archCourseService,
    $state, archUtilsService, leafletData, archLayerService,
    archMapControlService, archMarkerBugService, archMarkerPoiService,
    archPathJunctionService, archAccountService, ARCH_MAP_DEFAULTS, ARCH_MAP_INIT,
    ARCH_LAYER_TYPES, archGpxService) {
    return {
      restrict: 'E',
      require: ['^archMap'],
      templateUrl: 'app/map/arch-map.html',
      controller: function($scope) {
        var controller = this;

        // region private

        var _controls = {};
        var _featureGroups = {};
        var _layers = {};

        // endregion

        // region initialisation

        $scope.map = {};
        $scope.map.defaults = ARCH_MAP_DEFAULTS;
        $scope.map.center = {};
        $scope.map.layers = {};
        $scope.map.layers.baselayers = {};

        $scope.layersReady = false;

        $scope.isLogged = false;
        if(archAccountService.getCurrentToken())
        {
          $scope.isLogged = true;
        }

        // region layers

        // TODO: Refactor !
        leafletData.getMap()
          .then(function(map) {
            archLayerService.initOptions('poi', {
              popupDirective: 'arch-marker-poi-popup',
              icon: 'heart'
            });
            archLayerService.initOptions('bug', {
              popupDirective: 'arch-marker-bug-popup',
              icon: 'bug'
            });
            archLayerService.initOptions('path', {
              popupDirective: 'arch-path-details-popup',
              icon: 'arrows',
              leafletOptions: {
                stroke: true,
                color: '#fff',
                opacity: 0.5,
                fillColor: '#fff',
                fillOpacity: 0.2,
                weight: 4
              }
            });
            archLayerService.initOptions('junction', {
              icon: 'arrows'
            });
            archLayerService.initOptions('course', {
              popupDirective: 'arch-course-details-popup'
            });
            //archLayerService.initOptions('trace');

            _layers.marker = archLayerService.initLayer('marker');
            _layers.path = archLayerService.initLayer('path');
            _layers.course = archLayerService.initLayer('course');
            //_layers.trace = archLayerService.initLayer('trace');


            var addToMap = controller.addToMap = function(layerName) {
              _layers[layerName].editable.addTo(map);
              _layers[layerName].notEditable.addTo(map);
            };

            addToMap('marker');
            addToMap('path');
            addToMap('course');
            //addToMap('trace');


            // Websocket handlers
            // This handles error, refresh on new and save messages.
            archMarkerPoiService.useDefaultHandlers('marker', 'poi');
            archMarkerBugService.useDefaultHandlers('marker', 'bug');
            archCourseService.useDefaultHandlers('course', 'course');
            archPathJunctionService.useDefaultHandlers('path', 'junction');


            map.on('popupopen', function(event) {
              if (event.popup.options.archFeature && event.popup.options.archFeature.id) {
                var popupScope = $scope.$new();
                popupScope.id = event.popup.options.archFeature.id;
                $compile(event.popup._content)(popupScope);
              }
            });

            map.on('popupclose', function(event) {
              $mdSidenav('right').close()
                .then(function() {
                  $state.go($state.current.name, {id: ''});
                });
            });

            $q.all([
                archMarkerBugService.getList(),
                archMarkerPoiService.getList(),
                archPathJunctionService.getList(),
                archCourseService.getList()
                //archGpxService.getTrace(),
              ])
              .then(function(results) {
                var bugsResult = results[0];
                var poisResult = results[1];
                var junctionsResult = results[2];
                var coursesResult = results[3];
                //var traceResult = results[4];

                archLayerService.addLayers('marker', 'bug', bugsResult.value);
                archLayerService.addLayers('marker', 'poi', poisResult.value);
                //archLayerService.addLayers('trace', 'trace', traceResult);
                archLayerService.addLayers('path', 'junction', junctionsResult.value.junctions, {
                  popupDirective: null,
                  onEachFeature: function(feature, layer) {
                    layer.on('mouseover', function(e) {
                      $scope.$broadcast('arch:junctionmouseover', feature, layer);
                    });
                    layer.on('click', function(e) {
                      $scope.$broadcast('arch:junctionclicked', feature, layer);
                    });

                    //layer.archIntersection = new L.Handler.ArchIntersection(layer, map);
                    //layer.archIntersection.enable();
                    /*
                     layer.on('click', function(e) {
                     var el = angular.element(e.originalEvent.target);
                     el.css('opacity', '0.8');
                     });
                     */
                  }
                });
                archLayerService.addLayers('path', 'path', junctionsResult.value.paths);

                //archLayerService.addLayers('course', 'course', coursesResult.value);

                $scope.layersReady = true;
              });
          });

        this.getLayer = function(name) {
          var deferred = $q.defer();
          var unregister = $scope.$watch('layersReady', function(layersReady) {
            if (layersReady) {
              if (_layers[name]) {
                deferred.resolve(_layers[name]);
              } else {
                deferred.reject('Layer ' + name + ' is not registered.');
              }
              unregister();
            }
          });
          return deferred.promise;
        };

        /**
         * Ajoute un layer à la carte.
         * @param {string} name le nom du layer à ajouter.
         * @param {string} type le type du layer à ajouter, baselayer ou overlay. Il est recommandé d'utiliser la constante archLayerTypes.
         * @param {Object} layer Le layer à ajouter. Se référer à leaflet directive pour plus d'informations sur les paramètres {@link http://tombatossals.github.io/angular-leaflet-directive/#!/examples/layers-simple}.
         * @return {Promise} résolue en cas de réussite, rejettée en cas d'échec.
         */
        this.addLayer = function(name, type, layer) {
          var deferred = $q.defer();
          if (!type) {
            deferred.reject(new Error('Please provide a type for the layer you want to add. Either "baselayer" or "overlay".'));
          } else if (!archUtilsService.contains(ARCH_LAYER_TYPES, type)) {
            deferred.reject(new Error('The provided layer type is not handled.'));
          } else if (!name) {
            deferred.reject(new Error('You must provide a name to add a layer.'));
          } else if (!angular.isObject(layer)) {
            deferred.reject(new Error('A layer must be an object.'));
          } else {
            $scope.map.layers[type][name] = layer;
            deferred.resolve();
          }
          return deferred.promise;
        };

        // endregion

        var stopInitWatch = $scope.$watch('map', function(map) {
          var isInit = false;
          var initChecks = {
            center: false,
            layers: false
          };

          if (map.center.lat && map.center.lng) {
            initChecks.center = true;
          }

          var initCheckKeys = Object.keys(initChecks);
          for (var i = 0; i < initCheckKeys.length; i += 1) {
            if (!initChecks[initCheckKeys[i]]) {
              break;
            } else {
              isInit = true;
            }
          }

          if (isInit) {
            stopInitWatch();
            $scope.map.isInit = true;
          }
        }, true);

        // endregion

        // region api

        // region center

        /**
         * Met en place le centre de la carte.
         * @param center Le centre de la carte.
         * @param center.lat La latitude du centre.
         * @param center.longitude La longitude du centre.
         * @param center.zoom Le niveau de zoom initial.
         * @return {Promise} Contient le centre en cas de réussite.
         */
        this.setCenter = function(center) {
          return $q.when($scope.map.center = center);
        };

        /**
         * Retourne le centre de la carte.
         * @return {Object} Le centre de la carte avec les propriétés lat et lng.
         */
        this.getCenter = function() {
          return $q.when($scope.map.center);
        };

        this.getMap = function() {
          return leafletData.getMap();
        };

        // endregion

        // region layers

        /**
         * Supprime le layer dont le nom est passé en paramètre, s'il existe.
         * @param name
         */
        this.removeLayer = function (name, type) {
          var deferred = $q.defer();
          if (!name) {
            deferred.reject(new Error('You must provide the name of the layer to remove.'));
          } else if (!$scope.map.layers[type][name]) {
            deferred.reject(new Error('The provided layer "' + name + '" was not found.'));
          } else {
            delete $scope.map.layers[type][name];
            deferred.resolve();
          }
          return deferred.promise;
        };

        // endregion

        // region feature groups

        this.hasFeatureGroup = function(name) {
          return $q.when(angular.isDefined(_featureGroups[name]));
        };

        this.addFeatureGroup = function(name, options) {
          var deferred = $q.defer();
          if (_featureGroups[name]) {
            $log.warn('The feature group ' + name + ' already existed and has been erased.');
          }
          leafletData.getMap()
            .then(function (map) {
              options = options || {};
              _featureGroups[name] = new L.FeatureGroup();
              if (options.events) {
                for (var event in options.events) {
                  _featureGroups[name].on(event, options.events[event]);
                }
              }
              deferred.resolve(_featureGroups[name].addTo(map));
            });
          return deferred.promise;
        };

        this.getFeatureGroup = function(name) {
          if (!_featureGroups[name]) {
            return $q.reject(new Error('The given feature groupe ' + name + ' doesn\'t exists'));
          }
          return $q.when(_featureGroups[name]);
        };

        // endregion

        // region controls

        this.getControl = function(name) {
          return $q.when(_controls[name]);
        };

        this.addControl = function(name, LClass, options) {
          var deferred = $q.defer();
          leafletData.getMap()
            .then(function(map) {
              options = options || {};
              _controls[name] = new LClass(options);
              map.addControl(_controls[name]);
              deferred.resolve(_controls[name]);
            });
          return deferred.promise;
        };

        this.removeControl = function(name) {
          var deferred = $q.defer();
          if (_controls[name]) {
            leafletData.getMap()
              .then(function (map) {
                map.removeControl(_controls[name]);
                deferred.resolve();
              });
          }
          return deferred.promise;
        };


        this.drawElevation = function(geoJson) {
          this.addControl('el', L.control.elevation, {
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
          }).then(function (el) {
            //archLayerService.addLayers('elevation', 'path', geoJson, {
            //  onEachFeature: el.addData.bind(el)
            //});
            //for display it's better to use the default L.geoJson
            L.geoJson(geoJson,{
                onEachFeature: el.addData.bind(el) //working on a better solution
              });
          });
        };
        // endregion

        // region display options

        var defaultDisplayOptions = {
          mapRight: {
            width: 'normal'
          }
        };

        $scope.displayOptions = angular.copy(defaultDisplayOptions);

        this.setDisplayOptions = function(options) {
          options = options || {};
          $scope.displayOptions = angular.extend(angular.copy(defaultDisplayOptions), options);
        };

        // endregion

        // endregion

      },
      link: function(scope, element, attributes, controllers) {

        var archMap = controllers[0];

        var returnControlClass = archMapControlService.createControlClass('GoToArchMap', 'arch-map', 'home');
        archMap.addControl('goToArchMap', returnControlClass, {
            clickFn: function() {
              $state.go('map.home');
            }
          })
          .then(function() {
            return archAccountService.getCurrentUser();
          })
          .then(function() {
            var pathControlClass = archMapControlService.createControlClass('GoToArchPath', 'arch-path', 'retweet');
            archMap.addControl('goToArchPath', pathControlClass, {
              clickFn: function() {
                $state.go('map.path.draw');
              }
            })
          })
          .then(function() {
            var markerControlClass = archMapControlService.createControlClass('GoToArchMarker', 'arch-marker', 'map-marker');
            archMap.addControl('goToArchMarker', markerControlClass, {
              clickFn: function() {
                $state.go('map.marker.choice');
              }
            })
          })
          .then(function() {
            var pathControlClass = archMapControlService.createControlClass('GoToArchTrace', 'arch-trace', 'upload');
            archMap.addControl('goToArchTrace', pathControlClass, {
              clickFn: function() {
                $state.go('map.gpx');
              }
            })
          })
          .then(function() {
            var courseControlClass = archMapControlService.createControlClass('GoToArchCourse', 'arch-course', 'space-shuttle');
            archMap.addControl('goToArchCourse', courseControlClass, {
              clickFn: function() {
                $state.go('map.course.draw');
              }
            })
          })
          .then(function() {
            var searchControlClass = archMapControlService.createControlClass('GoToArchSearch', 'arch-search', 'search');
            archMap.addControl('goToArchSearch', searchControlClass, {
              clickFn: function() {
                $state.go('map.search');
              }
            })
          })
          .catch(function(err) {
            //$log.error(err);
          });

        // Ajout du centre
        geolocation.getLocation()
          // DEBUG ONLY
          .catch(function() {
            return archMap.setCenter({
              lat: 49.10,
              lng: 7.5,
              zoom: ARCH_MAP_INIT.defaultZoom
            });
          })
          .then(function(data) {
            return archMap.setCenter({
              lat: data.coords.latitude,
              lng: data.coords.longitude,
              zoom: ARCH_MAP_INIT.defaultZoom
            });
          })
          .catch(function(err) {
            $log.error(err);
            return $mdDialog.show({
                controller: function($scope) {
                  $scope.center = {};

                  var unregisterCenterWatch = $scope.$watch('center', function(center) {

                    if (center.lat && center.lng) {
                      unregisterCenterWatch();
                      $mdDialog.hide(center);
                    }

                  });
                },
                templateUrl: 'app/map/arch-set-center-dialog.html'
              })
              .then(function(center) {
                return archMap.setCenter({
                  lat: center.lat,
                  lng: center.lng,
                  zoom: ARCH_MAP_INIT.defaultZoom
                });
              })
              .catch(function(err) {
                $log.error(err);
              });

          });
          /*.then(function(hasCenter) {
            if (!hasCenter) {
              return archMap.setCenter({
                lat: 90,
                lng: 90,
                zoom: ARCH_MAP_INIT.defaultZoom
              });
            }
          });*/

        $translate(['OUTDOOR_LAYER'])
          .then(function(translations) {
              return archMap.addLayer('ThunderForest_Outdoors', ARCH_LAYER_TYPES.baselayer, {
                name: translations.OUTDOOR_LAYER,
                url: 'http://a.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png',
                type: 'xyz',
                layerOptions: {
                  showOnSelector: false
                }
              });
          })
          .catch(function(err) {
            $log.error(err);
          });

        // region event handlers

        scope.$on('$stateChangeSuccess', function() {
          archMap.setDisplayOptions();
        });

        // endregion
      }
    }
  });


//'use strict'
//angular.module('archCarto')
//  .directive('archMap', function (archMapService, archPoiService, archPathService, archBugService, archMarkerService, archMapMarkerService, archGpxService, archMapDialogService, archLayerService, $mdToast, $mdDialog, $translate, leafletData, $window, $mdSidenav, archRolesService, archComponentsConstant, archFormatService, archMapControlService, archMapLayerService, $q, archMapInitConstant) {
//    return {
//      restrict: 'E',
//      templateUrl: 'app/map/arch-map.html',
//      controller: function($scope) {
//        leafletData.getGeoJSON().then(function(lObjs){
//          window.leafletDataGeoJSON = lObjs;
//        });
//
//        $scope.x = '30px';
//        $q.all([
//            archMapControlService.registerControls(archMapInitConstant.controls),
//            archMapLayerService.registerLayers(archMapInitConstant.layers)
//          ])
//          .then(function() {
//            return $q.all([
//              archMapControlService.getControls(),
//              archMapLayerService.getLayers()
//            ]);
//          })
//          .then(function(results) {
//            angular.extend($scope, {
//              map: {
//                center: {
//                  lat: 49.08655299999999,
//                  lng: 7.483997999999929,
//                  zoom: 12
//                },
//                layers: results[1],
//                markers: {},
//                paths: {},
//                geojson: {
//                  markers: {},
//                  paths: {}
//                },
//                controls: results[0],
//                isInit: false
//              }
//            });
//          })
//          .then(function() {
//            setTimeout(function() {
//              $scope.map.isInit = true;
//            }, 1000);
//          });
//
//
//        $scope.cursor = {
//            lat: 49.08655299999999,
//            lng: 7.483997999999929
//        };
//
//        $scope.mapStatus = {
//          selectedCoordinates: null,
//          clicked: false
//        };
//        $scope.actions = {};
//
//
//        this.getMap = function() {
//          return leafletData.getMap();
//        };
//
//        this.getCenter = function() {
//          return $scope.map.center;
//        };
//
//        this.setCenter = function(coordinates) {
//          $scope.map.center.lat = coordinates.lat;
//          $scope.map.center.lng = coordinates.lng;
//        };
//
//        this.displayGeoJson = function(geoJson) {
//          this.getMap().then(function(map){
//            var myLayer = L.geoJson(geoJson).addTo(map);
//          });
//        };
//
//        this.displayElevation = function(geoJson) {
//          //all used options are the default values
//          //var el = $scope.controls.Elevation;
//          this.getMap().then(function(map) {
//            //el.clear();
//            //TO DO clear el to have only one chart
//            //map.removeControl(el);
//            var el = L.control.elevation({
//              position: "topright",
//              theme: "steelblue-theme", //default: lime-theme
//              width: 600,
//              height: 125,
//              margins: {
//                top: 10,
//                right: 20,
//                bottom: 30,
//                left: 50
//              },
//              useHeightIndicator: true, //if false a marker is drawn at map position
//              interpolation: "linear", //see https://github.com/mbostock/d3/wiki/SVG-Shapes#wiki-area_interpolate
//              hoverNumber: {
//                decimalsX: 3, //decimals on distance (always in km)
//                decimalsY: 0, //deciamls on height (always in m)
//                formatter: undefined //custom formatter function may be injected
//              },
//              xTicks: undefined, //number of ticks in x axis, calculated by default according to width
//              yTicks: undefined, //number of ticks on y axis, calculated by default according to height
//              collapsed: false    //collapsed mode, show chart on click or mouseover
//            });
//            //el.clearLayers();
//            el.addTo(map);
//            var layer = L.geoJson(geoJson, {
//              onEachFeature: el.addData.bind(el)
//               //working on a better solution
//            }).addTo(map);
//            map.fitBounds(layer.getBounds());
//
//          });
//        };
//
//
//        // region action api
//
//        var hasAction = false;
//
//        $scope.addActions = function(actions) {
//          for(var i = 0; i < actions.length; i += 1) {
//            $scope.actions[actions[i]] = false;
//          }
//        };
//
//        $scope.setAction = function(actionName) {
//          for (var action in $scope.actions) {
//            $scope.actions[action] = false
//          }
//          if (angular.isDefined($scope.actions[actionName])) {
//            if ($scope.actions[actionName]) {
//              $scope.toggleRight();
//            } else {
//              if (!hasAction) {
//                $scope.openRight();
//              } else {
//                $scope.closeRight();
//              }
//            }
//            $scope.actions[actionName] = true;
//            var hasAction = true;
//          } else {
//            $scope.closeRight();
//            var hasAction = false;
//          }
//        };
//
//        $scope.hasAction = function() {
//          return hasAction;
//        };
//
//        // endregion
//
//        var refreshMarkers = this.refreshMarkers = function(type) {
//          archMapMarkerService.getMarkers(type)
//            .then(function(markers) {
//              //angular.extend($scope.map.markers, markers);
//
//              // GEOJson injection
//              if (!$scope.map.geojson.markers[type]) {
//                $scope.map.geojson.markers[type] = {};
//              }
//              $scope.map.geojson.markers[type].data = markers;
//              $scope.map.geojson.markers[type].style = {
//                fillColor: "blue",
//                  weight: 2,
//                  opacity: 1,
//                  color: 'white',
//                  dashArray: '3',
//                  fillOpacity: 0.7
//              };
//            });
//        };
//
//        $scope.$on('leafletDirectiveMap.load', function(event, args) {
//          refreshMarkers();
//
//          $mdSidenav('leftSideNav').toggle();
//          $mdSidenav('leftSideNav').open();
//
//
//          //fix the gray area when the map load
//          leafletData.getMap()
//             .then(function(map) {
//             L.Util.requestAnimFrame(map.invalidateSize,map,!1,map._container);
//          });
//
//          /*archMapDialogService.showCenterDialog()
//           .then(setCenter);*/
//          //LxDialogService.open('chooseCenterDialog');
//        });
//        //probably need to  be in a service
//        $scope.openLeft = function() {
//          $mdSidenav('leftSideNav').open();
//        };
//
//        $scope.closeLeft = function () {
//          $mdSidenav('leftSideNav').close();
//        };
//
//        $scope.toggleLeft = function() {
//          $mdSidenav('leftSideNav').toggle();
//        };
//        $scope.openRight = function() {
//          $mdSidenav('rightSideNav').open();
//        };
//
//        $scope.closeRight = function () {
//          $mdSidenav('rightSideNav').close();
//        };
//
//        $scope.toggleRight = function() {
//          $mdSidenav('rightSideNav').toggle();
//        };
//
//        angular.forEach(archComponentsConstant, function(component, name) {
//          leafletData.getMap()
//            .then(function(map) {
//
//              console.log(L);
//              /*
//              var componentClassName = archFormatService.capitalize(name);
//              L.Control[componentClassName] = L.Control.extend({
//                options: {
//                  position: 'topleft'
//                },
//
//                onAdd: function (map) {
//                  var controlDiv = L.DomUtil.create('div', 'leaflet-control-command');
//                  L.DomEvent
//                    .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
//                    .addListener(controlDiv, 'click', L.DomEvent.preventDefault)
//                    .addListener(controlDiv, 'click', function () { MapShowCommand(); });
//
//                  var controlUI = L.DomUtil.create('div', 'leaflet-control-command-interior', controlDiv);
//                  controlUI.title = 'Map Commands';
//                  return controlDiv;
//                }
//              });
//
//              L.control[name] = function (options) {
//                var ComponentClass = L.Control[componentClassName];
//                return new ComponentClass(options);
//              };
//
//              L.Map.addInitHook(function () {
//                if (this.options.drawControl) {
//                  this.drawControl = new L.Control.Draw();
//                  this.addControl(this.drawControl);
//                }
//              });
//
//              console.log(L);
//              $scope.controls[name] = {};
//              */
//            });
//        });
//      },
//      link: function(scope, element, attributes) {
//        //archMapService.init()
//        //  .then(function(layers) {
//        //    angular.extend(scope.layers, layers);
//        //
//        //    var pathDrawer = scope.pathDrawer = archPathService.getPathDrawer();
//        //
//        //    var refreshMarkers = scope.refreshMarkers;
//        //
//        //    scope.pathDrawn = function() {
//        //      return archPathService.pathDrawn();
//        //    };
//        //
//        //    // region actions
//        //
//        //    scope.disablePathDrawer = function() {
//        //      pathDrawer.enabled = false;
//        //      archLayerService.showLayers(['poi', 'bug']);
//        //      archLayerService.hideLayers(['pathDrawer']);
//        //      $translate(['PATH_DRAWER_QUIT']).then(function(translations) {
//        //        $mdToast.show($mdToast.simple().content(translations.PATH_DRAWER_QUIT));
//        //      });
//        //    };
//        //
//        //    scope.deletePath = function() {
//        //      archPathService.deletePath()
//        //        .then(function(markerIds) {
//        //          markerIds.forEach(function(markerId) {
//        //            delete scope.markers[markerId];
//        //          });
//        //        });
//        //    };
//        //
//        //    // endregion
//        //
//        //    // region event handlers
//        //
//        //    // We refresh the markers when the user moves or zooms in or out.
//        //    scope.$on('leafletDirectiveMap.moveend', refreshMarkers);
//        //
//        //    scope.$on('leafletDirectiveMap.mousemove', function (event, args) {
//        //      var leafletEvent = args.leafletEvent;
//        //      var latlng = leafletEvent.latlng;
//        //      scope.cursor.lat = latlng.lat;
//        //      scope.cursor.lng = latlng.lng;
//        //    });
//        //
//        //    scope.$on('leafletDirectiveMap.click', function(event, args) {
//        //      scope.mapStatus.selectedCoordinates = {
//        //        latitude: args.leafletEvent.latlng.lat,
//        //        longitude: args.leafletEvent.latlng.lng
//        //      };
//        //
//        //      scope.mapStatus.clicked = true;
//        //
//        //      archMarkerService.removeMarkers('selectedCoordinates')
//        //        .then(function() {
//        //          archMarkerService.addEntity('selectedCoordinates', {
//        //            _id: '-1',
//        //            coordinates: scope.mapStatus.selectedCoordinates
//        //          });
//        //        });
//        //    });
//        //
//        //    // endregion
//        //
//        //  });
//      }
//    };
//  });
