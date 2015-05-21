'use strict'
angular.module('archCarto')
  .directive('archPath', function(leafletData, $log, $mdSidenav, $q, archPathService, archPathJunctionService, $compile, $state, archElevationService) {
    return {
      restrict: 'E',
      require: '^archMap',
      templateUrl: 'components/path/arch-path.html',
      controller: function($scope) {
        var controller = this;

        var _currentLayer = null;
        var _currentJunctionLayer = null;

        $scope.hasDrawnPath = false;

        $scope.cancel = function() {
          $state.go('map.path.draw', {id: ''});
          $mdSidenav('right').close();
        };

        leafletData.getMap()
          .then(function(map) {
            //partie elevation
            $scope.geojson = {"name":"NewFeatureType","type":"FeatureCollection"
              ,"features":[
                {
                  "type": "Feature",
                  "properties": {},
                  "geometry": {
                    "type": "LineString",
                    "coordinates": [
                    ]
                  }
                }
              ]};
            var el;

            el = L.control.elevation({
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
              el.addTo(map);
            //fin

            map.on('draw:created', function (e) {
              var layerType = e.layerType;
              _currentLayer = e.layer;
              _currentJunctionLayer = L.featureGroup();
              controller.cleanCurrentLayer = function() {
                map.removeLayer(_currentLayer);
                $scope.hasDrawnPath = false;
                controller.cleanCurrentLayer = angular.noop;
              };

              controller.cleanCurrentJunctionsLayer = function() {
                map.removeLayer(_currentJunctionLayer);
                $scope.hasDrawnPath = false;
                controller.cleanCurrentJunctionsLayer = angular.noop;
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
                    $scope.cancel = function() {
                      $state.go('map.path.draw', {id: ''});
                      $mdSidenav('right').close();
                    };
                    $state.go('map.path.draw');
                  });
              };
            });

            var nearestHook;
            map.on('draw:drawstart', function(e) {
              var layerType = e.layerType;
              //partie elevation
              $scope.$on('leafletDirectiveMap.click', function(event, args) {
                console.log('test');
                var leafletEvent = args.leafletEvent;
                var latlng = leafletEvent.latlng;
                //console.log(latlng.lat+latlng.lng);
                archElevationService.getElevation(latlng)
                  .then(function(response) {
                    var handleHelloWorldResponse = response;
                    var elevation = handleHelloWorldResponse.elevationProfile;
                    var height = elevation[0].height;
                    leafletData.getMap().then(function(map){
                      map.eachLayer(function (layer, el) {
                        //layer.bindPopup('Hello');
                        //console.log('NXM');
                      });
                      el.clear();
                      //console.log(latlng.lat);
                      //console.log(latlng.long);
                      var profile = [latlng.lat,latlng.lng,height];
                      $scope.geojson.features[0].geometry.coordinates.push(profile);
                      var coordinates = $scope.geojson.features[0].geometry.coordinates;
                      console.log(coordinates);
                      var gjl = L.geoJson($scope.geojson,{
                        onEachFeature: el.addData.bind(el)
                      }).addTo(map);
                    });
                    //debugger;
                  });


              });
                /*
                nearestHook = function(e) {
                  var index = leafletKnn(_junctionsLayer);
                  var nearestLayer = index.nearest(e.latlng, 1)[0].layer;
                  var cursor = e.latlng;
                  var layerCoords = nearestLayer.getLatLng();
                  console.log(cursor.distanceTo(layerCoords));

                  /*if (cursor.distanceTo(layerCoords) < 50) {
                    nearestLayer.setIcon(L.AwesomeMarkers.icon({
                      icon: 'arrows',
                      markerColor: 'green'
                    }));
                  } else {
                    nearestLayer.setIcon(L.AwesomeMarkers.icon({
                      icon: 'arrows',
                      markerColor: 'red'
                    }));
                  }
                };
                map.on('mousemove', nearestHook);
                */
            });

            map.on('draw:drawstop', function(e) {
              /*
              if (nearestHook) {
                map.off('mousemove', nearestHook);
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
