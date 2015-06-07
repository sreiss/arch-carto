'use strict'
angular.module('archCarto')
    .factory('archElevationService', function(archHttpService) {
      var key = "Fmjtd%7Cluu82l61n5%2Cbn%3Do5-948nl0";
      var _eleUrl = 'http://open.mapquestapi.com/elevation/v1/profile?key='+key+'&shapeFormat=raw';
      return {
        getElevation: function(coordinates) {
          return archHttpService.get(_eleUrl, {
            params: {
              latLngCollection: coordinates[0] + ',' + coordinates[1]
            }
          });
        }
      };
    });
