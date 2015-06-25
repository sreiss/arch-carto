'use strict'

angular.module('archCarto')
  .directive('archGpxUploadForm', ['$parse', function ($parse,$mdSidenav) {
    return {
      restrict: 'E',
      scope: {
        poi: '=?',
        formValid: '='
      },
      require: ['^archMap'],
      templateUrl: 'components/gpx/arch-upload-form.html',
      controller: function($scope, httpConstant ,archGpxUploadService,archHttpService, $mdSidenav) {
        $mdSidenav('right').toggle();
        $mdSidenav('right').open();

      },

      link: function(scope, element, attrs) {

      }
    };
  }])
  .directive('onReadFile', function ($parse,archGpxUploadService,archElevationService, archGpxService, archInfoService, $state, leafletData) {
    return {
      restrict: 'A',
      require: ['^archMap'],
      scope: false,
      controller: function($scope)
      {
      },
      link: function(scope, element, attrs, controllers) {
        var fn = $parse(attrs.onReadFile);
        var archMap = controllers[0];

        scope.geoJson = "";
        element.on('change', function(onChangeEvent) {
          var reader = new FileReader();

          reader.onload = function(onLoadEvent) {
            scope.$apply(function() {
              archGpxService.gpx(onLoadEvent.target.result).then(function(gj)
              {
                scope.geoJson = gj;
                archGpxService.simplifyTrace(scope.geoJson).then(function(simplified)
                {
                  scope.geoJson.features[0].geometry.coordinates = simplified;
                  console.log(scope.geoJson);
                  archMap.drawElevation(scope.geoJson);
                  //archInfoService.getDGeoJ(scope.geoJson).then(function(distance){
                  //  scope.geoJson.features[0].properties.dPlus = distance.deniPlus;
                  //  scope.geoJson.features[0].properties.dMinus = distance.deniMoins;
                  //
                  //});
                  //archInfoService.getDistanceGeoJ(scope.geoJson).then(function(distance){
                  //  scope.geoJson.features[0].properties.length = distance;
                  //});
                  leafletData.getMap()
                    .then(function(map){
                      var featureGroup = L.featureGroup().addTo(map);
                      L.geoJson(scope.geoJson, {
                        onEachFeature: function (feature, layer) {
                          featureGroup.addLayer(layer);
                        }
                      });
                      //console.log(scope.geoJson);
                      //archMap.drawElevation(scope.geoJson);
                      return archMap.addControl('draw', L.Control.Draw, {
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
                    });
                });
              });
            });
          };

          reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
        });

        scope.eventBool = 0;
        leafletData.getMap()
          .then(function(map){
            map.on('draw:edited', function (e) {
              if(scope.eventBool == 1)
              {
                //console.log(scope.geoJson);
                var currentLayer = Object.keys(e.layers._layers);
                var taille = e.layers._layers[currentLayer]._latlngs.length;
                scope.geoJson.features[0].geometry.coordinates = [];
                //console.log(scope.geoJson);
                //debugger;
                archElevationService.getElevationGeoJ(e.layers._layers[currentLayer])
                  .then(function(result){
                    console.log(result);
                    debugger;
                    for(var i = 0; i < taille; i++ )
                    {
                      var height = result.elevationProfile[0].height;
                      var tab = {0: e.layers._layers[currentLayer]._latlngs[i].lat,1: e.layers._layers[currentLayer]._latlngs[i].lng,2: height};
                      scope.geoJson.features[0].geometry.coordinates.push(tab);
                      //console.log(tab);
                      //debugger;
                    }
                    if (archMap.removeControl('el')) {
                      archMap.removeControl('el');
                      console.log(scope.geoJson);
                      archMap.drawElevation(scope.geoJson);
                      debugger;
                    }
                    else {
                      archMap.drawElevation(scope.geoJson);
                    }
                  });
              }

              scope.eventBool = 1;
            });
          });
        scope.upload = function(){
          archGpxUploadService.uploadFileToUrl(scope.geoJson);
        }

      }
    };
  });

