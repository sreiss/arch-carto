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
        leafletData.getMap()
          .then(function(map){
            map.on('draw:edited', function (e) {
              console.log(e.layers);
              debugger;
              //console.log(e.layers._layers[81].feature);
              //debugger;
              //$scope.geoJson.features[0] = e.layers._layers[81].feature;
              //console.log($scope.geoJson);
              //archMap.drawElevation(scope.geoJson);
              //for(var i = 0; i< $scope.geoJson.features[0].geometry.coordinates.length; i++ )
              //{
              //  $scope.geoJson.features[0].geometry.coordinates[i][0] = e.layers._layers[81]._latlngs[i].lat;
              //  $scope.geoJson.features[0].geometry.coordinates[i][1] = e.layers._layers[81]._latlngs[i].lng;
              //
              //  var lat = $scope.geoJson.features[0].geometry.coordinates[i][0];
              //  var lng = $scope.geoJson.features[0].geometry.coordinates[i][1];
              //  //var previousHeight = $scope.geoJson.features[0].geometry.coordinates[i][2];
              //  debugger;
              //
              //
              //  //var test =  archElevationService.getElevationGeoJ($scope.geoJson);
              //  //console.log(test);
              //  //archElevationService.getElevation(lat, lng)
              //  //  .success(function(result){
              //  //    var height = result.elevationProfile[0].height;
              //  //    console.log($scope.geoJson.features[0].geometry.coordinates[i]);
              //  //    console.log(i);
              //  //    debugger;
              //  //    $scope.geoJson.features[0].geometry.coordinates[i][2] = height;
              //  //    //debugger;
              //  //  });
              //};
              var taille = e.layers._layers[81]._latlngs.length;
              console.log(taille);
              archElevationService.getElevationGeoJ(e.layers._layers[81])
                .then(function(result){
                  console.log(result);
                  debugger;
                  for(var i = 0; i < taille; i++ )
                  {
                    debugger;
                    var height = result.elevationProfile[0].height;
                    //$scope.geoJson.features[0].geometry.coordinates[].push(e.layers._layers[81]._latlngs[i].lat,e.layers._layers[81]._latlngs[i].lng,height);
                    //$scope.geoJson.features[0].geometry.coordinates[i][1] = e.layers._layers[81]._latlngs[i].lng;
                    //$scope.geoJson.features[0].geometry.coordinates[i][2] = height;
                    console.log(i);
                  }
                  console.log($scope.geoJson);
                  //var height = result.elevationProfile[0].height;
                  //console.log($scope.geoJson.features[0].geometry.coordinates[i]);
                  //console.log(i);
                  //debugger;
                  //$scope.geoJson.features[0].geometry.coordinates[i][2] = height;
                  //debugger;
                });
              //console.log(scope.geoJson.features[0]);

              //debugger;
            });
          });
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
                      console.log(scope.geoJson);
                      archMap.drawElevation(scope.geoJson);
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
        scope.upload = function(){
          console.log(scope.geoJson);
          debugger;

        }

      }
    };
  });

