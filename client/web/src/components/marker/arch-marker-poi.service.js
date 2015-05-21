'use strict'
angular.module('archCarto')
  .service('archMarkerPoiService', function(archHttpService, $q, httpConstant) {
    var poiUrl = httpConstant.apiUrl + '/map/poi';

    return {
      toGeoJson: function(poi) {
        return {
          properties: {
            name: poi.name,
            description: poi.description,
            type: poi.type._id,
            medias: []
          },
          geometry: {
            coordinates: [poi.coordinates.lng, poi.coordinates.lat]
          }
        }
      },
      getList: function() {
        return archHttpService.get(poiUrl);
      },
      get: function(poiId, options) {
        return archHttpService.get(poiUrl + '/' + poiId, {
          params: options
        });
      },
      save: function(poi) {
        return archHttpService.post(poiUrl, poi);
      }
    };

  });
