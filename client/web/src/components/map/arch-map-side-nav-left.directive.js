'use strict'
angular.module('archCarto')
  .directive('archSideNavLeft', [
    '$mdSidenav',
    function($mdSidenav) {
      return {
        restrict: 'E',
        templateUrl: 'app/side-nav/arch-side-nav-left.html',
        link: function(scope, element, attributes) {
          scope.showPoiActions = function() {
            $mdSidenav('sideNavRight').toggle();
          }
        }
      };
    }
  ]);
