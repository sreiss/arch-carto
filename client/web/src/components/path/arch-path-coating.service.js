'use strict'
angular.module('archCarto')
  .factory('archPathCoatingService', function(archHttpService, httpConstant) {
    var _coatingUrl = httpConstant.cartoServerUrl + '/map/coating';

    return {
      getList: function() {
        return archHttpService.get(_coatingUrl);
      }
    }
  });
