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
        //debugger;
        var coordonnees = [];
        for (var i = 0; i < geoJson.features[0].geometry.coordinates.length; i++) {
          coordonnees.push({
            0: geoJson.features[0].geometry.coordinates[i][0],
            1: geoJson.features[0].geometry.coordinates[i][1],
            2: geoJson.features[0].geometry.coordinates[i][2]
          });
        }
        //console.log(coordonnees.x);
        deferred.resolve(simplify(coordonnees,0.0001));
        return deferred.promise;

      }
    };
  });
