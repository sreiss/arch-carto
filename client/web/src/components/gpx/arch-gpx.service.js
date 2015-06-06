'use strict'
angular.module('archCarto')
    .factory('archGpxService', function($http, httpConstant, $q,archHttpService) {
      var _gpxUrl = httpConstant.cartoServerUrl + '/map/gpx';

      return {
        getTrace: function(params) {
          return archHttpService.get(_gpxUrl, {params: params});
        },
        simplifyTrace: function(geoJson) {
          //console.log()
          var deferred = $q.defer();
          var coordonnees = [];
          for (var i = 0; i < geoJson.features[0].geometry.coordinates.length; i++) {
            coordonnees.push({
              x: geoJson.features[0].geometry.coordinates[i][0],
              y: geoJson.features[0].geometry.coordinates[i][1],
              z: geoJson.features[0].geometry.coordinates[i][2]
            });
          }
          var newCoordinates = simplify(coordonnees,0.0001);
          coordonnees = [];
          for (var i = 0; i < newCoordinates.length; i++) {
            coordonnees.push({
              0: newCoordinates[i]['x'],
              1: newCoordinates[i]['y'],
              2: newCoordinates[i]['z']
            });
          }
          //console.log(coordonnees);
          deferred.resolve(coordonnees);
          return deferred.promise;

        }
      };
    });
