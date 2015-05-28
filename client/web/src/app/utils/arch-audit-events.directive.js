'use strict'
angular.module('archCarto')
  .directive('archAuditEvents', function(archAuditService) {
    return {
      restrict: 'E',
      scope: {
        auditEvents: '='
      },
      templateUrl: 'app/utils/arch-audit-events.html',
      controller: function($scope) {
      }
    }
  });
