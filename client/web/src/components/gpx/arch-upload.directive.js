'use strict'

angular.module('archCarto')
  .directive('archGpxUploadForm', ['$parse', function ($parse,$mdSidenav) {
    return {
      restrict: 'E',
      scope: {
        poi: '=?',
        formValid: '='
      },
      templateUrl: 'components/gpx/arch-upload-form.html',
      controller: function($scope, httpConstant ,archGpxUploadService,archHttpService, $mdSidenav) {
        $mdSidenav('right').toggle();
        $mdSidenav('right').open();

      },

      link: function(scope, element, attrs) {

      }
    };
  }])
  .directive('onReadFile', function ($parse,archGpxUploadService, archGpxService, archInfoService, $state) {
    return {
      restrict: 'A',
      scope: false,
      link: function(scope, element, attrs) {
        var fn = $parse(attrs.onReadFile);

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
                  archInfoService.getDGeoJ(scope.geoJson).then(function(distance){
                    scope.geoJson.features[0].properties.dPlus = distance.deniPlus;
                    scope.geoJson.features[0].properties.dMinus = distance.deniMoins;

                  });
                  archInfoService.getDistanceGeoJ(scope.geoJson).then(function(distance){
                    scope.geoJson.features[0].properties.length = distance;
                  });
                });
                //console.log(scope.geoJson);

              });


            });
          };

          reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
        });
        scope.upload = function(){
          console.log(scope.geoJson);
          //debugger;
          archGpxUploadService.uploadFileToUrl(scope.geoJson)
            .then(function()
            {
              scope.$emit('upload');
            });

        }
      }
    };
  });

