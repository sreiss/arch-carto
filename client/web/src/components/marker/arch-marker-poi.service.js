'use strict';
angular.module('archCarto')
  .service('archMarkerPoiService', function(archHttpService, archSocketService, archCrudService, $q, httpConstant, $mdSidenav, $mdToast) {
    archSocketService.openSocket('poi', '/map/poi');
    var _poiUrl = httpConstant.cartoServerUrl + '/map/poi';

    var service = archSocketService.initService('poi', {
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
      }
    });
    return archCrudService.initService('poi', service, _poiUrl);
  });
