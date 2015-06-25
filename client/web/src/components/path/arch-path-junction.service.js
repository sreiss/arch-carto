'use strict';
angular.module('archCarto')
  .factory('archPathJunctionService', function(archHttpService, httpConstant, archSocketService, archToastService, archTranslateService, archLayerService) {
    archSocketService.openSocket('junction', '/map/junction');
    var _junctionUrl = httpConstant.cartoServerUrl + '/map/junction';

    var service = archSocketService.initService('junction', {
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
    });

    service.error(function(err) {
      $log.error(err);
      archTranslateService(err.message)
        .then(function (translation) {
          archToastService.showToastError(translation);
        });
    });

    service.onNew(function(result) {

      archTranslateService(result.message)
        .then(function(translation) {
          archToastService.showToastSuccess(translation);
          archLayerService.addLayers('path', 'junction', result.value);
          archLayerService.addLayers('path', 'path', result.value.properties.paths);
        });
    });

    return service;
  });
