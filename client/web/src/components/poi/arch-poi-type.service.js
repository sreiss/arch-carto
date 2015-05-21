'use strict'
angular.module('archCarto')
  .factory('archPoiTypeService', function($http, httpConstant, $q) {
    var poiTypeUrl = httpConstant.cartoServerUrl + '/map/poi-type';

    return {
      getPoiTypeList: function(success) {
        return $http.get(poiTypeUrl).success(success);
      },
      savePoiType: function(poiType, success) {
        return $http.post(poiTypeUrl, poiType).success(success);
      }
    };
  });
