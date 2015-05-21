'use strict'
angular.module('archCarto')
  .service('archPoiService', function(archHttpService, $q, httpConstant) {
    var poiUrl = httpConstant.cartoServerUrl + '/map/poi';

    return {
      getPoiList: function() {
        return archHttpService.get(poiUrl);
      },
      savePoi: function(poi) {
        return archHttpService.post(poiUrl, poi);
      }
    };
  });
