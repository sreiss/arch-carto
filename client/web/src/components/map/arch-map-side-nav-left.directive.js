'use strict'
angular.module('archCarto')
  .directive('archMapSideNavLeft', [
    '$mdSidenav',
    function($mdSidenav) {
      return {
        restrict: 'E',
        templateUrl: 'components/map/arch-map-side-nav-left.html',
        link: function(scope, element, attributes) {
        }
      };
    }
  ]);
