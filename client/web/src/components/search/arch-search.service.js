'use strict'
angular.module('archCarto')
  .factory('archSearchService', function($http, httpConstant, $q,archHttpService) {
    var _searchUrl = httpConstant.cartoServerUrl + '/map/search';

    return {
      postSearch: function(filter) {

        return archHttpService.post(_searchUrl, filter);
      }
    };
  });
