'use strict';
angular.module('archCarto')
  .directive('archCartographer', function($mdSidenav, archCartographerService) {
    return {
      restrict: 'E',
      templateUrl: 'components/cartographer/arch-cartographer.html',
      link: function(scope, element, attributes) {
        $mdSidenav('right').open();

        scope.auditEvents = false;

        archCartographerService.getAuditEvents({})
          .then(function(result) {
            scope.auditEvents = result.value;
          })
          .catch(function(err) {
            scope.auditEvents = null;
          });
      }
    }
  });
