'use strict'
angular.module('archCarto')
  .service('archBugService', function(archHttpService, $q, httpConstant) {
    var bugUrl = httpConstant.cartoServerUrl + '/map/bug';

    return {
      getBugList: function (params) {
        return archHttpService.get(bugUrl, {params: params});
      },
      saveBug: function (bug) {
        return archHttpService.post(bugUrl, bug);
      }
    };
  });
