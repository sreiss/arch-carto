'use strict';
angular.module('archCarto')
  .factory('archCartographerService', function(archHttpService, httpConstant) {
    var _auditUrl = httpConstant.cartoServerUrl + '/users/audit';

    return {
      getAuditEvents: function(criterias) {
        return archHttpService.get(_auditUrl, {
          params: criterias
        });
      }
    };
  });
