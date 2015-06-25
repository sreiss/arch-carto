'use strict'
angular.module('archCarto')
  .factory('archElevationService', function(archHttpService, $http) {
    var key = "Fmjtd%7Cluu82l61n5%2Cbn%3Do5-948nl0";
    var _eleUrl = 'http://open.mapquestapi.com/elevation/v1/profile?key='+key+'&shapeFormat=raw';
    return {
      getElevation: function(lat, lng) {
        return archHttpService.get(_eleUrl, {
          params: {
            latLngCollection: lat + ',' + lng
          }
        });
      },
      getElevationGeoJ: function(geoJson) {
        var tabCoordinates = "";
        //for(var i = 0; i < geoJson.features[0].geometry.coordinates.length; i++){
        for(var i = 0; i < geoJson._latlngs.length; i++){
          if(i == 0)
          {
            //var coordinates = geoJson.features[0].geometry.coordinates[i][0]+","+geoJson.features[0].geometry.coordinates[i][1];
            var coordinates = geoJson._latlngs[i].lat+","+geoJson._latlngs[i].lng;
            tabCoordinates = tabCoordinates.concat(coordinates);
          }
          else
          {
            tabCoordinates = tabCoordinates.concat(',');
            //var coordinates = geoJson.features[0].geometry.coordinates[i][0]+","+geoJson.features[0].geometry.coordinates[i][1];
            var coordinates = geoJson._latlngs[i].lat+","+geoJson._latlngs[i].lng;
            tabCoordinates = tabCoordinates.concat(coordinates);
          }
        }
        return archHttpService.get(_eleUrl, {
          params: {
            latLngCollection: tabCoordinates
          }
        });
      }
    };
  });
