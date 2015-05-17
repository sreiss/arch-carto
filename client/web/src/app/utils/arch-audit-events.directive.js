'use strict'
angular.module('archCarto')
  .directive('archAuditEvents', function() {
    return {
      restrict: 'E',
      scope: {
        auditEvents: '='
      },
      templateUrl: 'app/utils/arch-audit-events.html',
      link: function(scope, element, attributes) {

      }
    }
  });
