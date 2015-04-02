'use strict'
angular.module('archCarto')
  .directive('archSideNavDefault', [
    function() {
      return {
        restrict: 'E',
        templateUrl: 'app/side'
      };
    }
  ]);
