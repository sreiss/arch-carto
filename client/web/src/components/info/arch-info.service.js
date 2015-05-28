'use strict'
angular.module('archCarto')
  .factory('archInfoService', function($q) {

    return {
      getDistanceGeoJ: function(geoJson) {
        var deferred = $q.defer();
        var coordonnees = [];
        for (var i = 0; i < geoJson.features[0].geometry.coordinates.length; i++) {
          coordonnees.push({
            latitude: geoJson.features[0].geometry.coordinates[i][0],
            longitude: geoJson.features[0].geometry.coordinates[i][1]
          });
        }
        deferred.resolve(geolib.getPathLength(coordonnees));
        return deferred.promise;
      },
      getDGeoJ: function(geoJson) {
        //algorithme naif, le mieux c'est avec un seuil de 10 metres
        var deferred = $q.defer();
        var oldValue;
        var newValue;
        var denivele;
        var dPlus = 0;
        var dMinus = 0;
        for (var i = 0; i+1 < geoJson.features[0].geometry.coordinates.length; i++) {
          oldValue = geoJson.features[0].geometry.coordinates[i][2];
          newValue = geoJson.features[0].geometry.coordinates[i+1][2];
          denivele = newValue - oldValue;
          if(denivele > 0)
          {
            dPlus += denivele;
          }
          else
          {
            dMinus += denivele;
          }

        }
        var result = { deniPlus: dPlus, deniMoins: dMinus};
        deferred.resolve(result);
        return deferred.promise;

      },
      getDistance: function(course) {
        var deferred = $q.defer();
        var coordonnees = [];
        for (var i = 0; i < course.geometry.coordinates.length; i++) {
          coordonnees.push({
            latitude: course.geometry.coordinates[i][0],
            longitude: course.geometry.coordinates[i][1]
          });
        }
        deferred.resolve(geolib.getPathLength(coordonnees));
        return deferred.promise;
      },
      getD: function(course) {
        //algorithme naif, le mieux c'est avec un seuil de 10 metres
        var deferred = $q.defer();
        var oldValue;
        var newValue;
        var denivele;
        var dPlus = 0;
        var dMinus = 0;
        for (var i = 0; i+1 < course.geometry.coordinates.length; i++) {
          oldValue = course.geometry.coordinates[i][2];
          newValue = course.geometry.coordinates[i+1][2];
          denivele = newValue - oldValue;
          if(denivele > 0)
          {
            dPlus += denivele;
          }
          else
          {
            dMinus += denivele;
          }

        }
        var result = { deniPlus: dPlus, deniMoins: dMinus};
        deferred.resolve(result);
        return deferred.promise;

      }
    };

  });
