'use strict'
angular.module('archCarto')
  .service('archMarkerPoiService', function(archHttpService, archSocketService, $q, httpConstant) {
    var _socket = archSocketService.openSocket('poi', '/map/poi');
    var poiUrl = httpConstant.cartoServerUrl + '/map/poi';

    var service = {
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
      }
      /*
      save: function(poi) {
        return archHttpService.post(poiUrl, poi);
      }
      */
    };

    return archSocketService.initService('poi', service);
  });
