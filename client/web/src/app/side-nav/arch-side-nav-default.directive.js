'use strict'
angular.module('archCarto')
  .directive('archSideNavDefault', [
    '$mdSidenav',
    function($mdSidenav) {
      return {
        restrict: 'E',
        templateUrl: 'app/side-nav/arch-side-nav-default.html',
        link: function(scope, element, attributes) {
          scope.showPoiActions = function() {
            $mdSidenav('sideNavRight').toggle();
          }
        }
      };
    }
  ]);
