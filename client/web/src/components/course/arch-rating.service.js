'use strict';
angular.module('archCarto')
  .factory('archRatingService', function(archSocketService, archHttpService, httpConstant) {
    var _ratingUrl = httpConstant.cartoServerUrl + '/map/rating';

    return {
      get: function(id) {
        return archHttpService.get(_ratingUrl + '/' + id);
      },
      getList: function(query) {
        return archHttpService.get(_ratingUrl, {
          params: query
        });
      }
    };


  });
