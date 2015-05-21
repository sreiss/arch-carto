'use strict';
angular.module('archCarto')
  .factory('archPathJunctionService', function(archHttpService, httpConstant) {
    var _junctionUrl = httpConstant.cartoServerUrl + '/map/junction';

    return {
      toGeoJson: function(junction) {
        return {
          properties: {
            paths: junction.paths
          },
          geometry: {
            coordinates: [junction.coordinates.lng, junction.coordinates.lat]
          }
        }
      },
      save: function(junction) {
        return archHttpService.post(_junctionUrl, junction);
      },
      getList: function() {
        return archHttpService.get(_junctionUrl);
      }
    }
  });
