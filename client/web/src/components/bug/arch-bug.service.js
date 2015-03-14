'use strict'
angular.module('archCarto')
  .service('archBugService', function(archHttpService, $q, httpConstant) {
    var bugUrl = httpConstant.apiUrl + '/map/bug';

    return {
      getBugList: function () {
        return archHttpService.get(bugUrl);
      },
      saveBug: function (bug) {
        return archHttpService.post(bugUrl, bug);
      }
    };
  });
