'use strict'
angular.module('archCarto')
  .directive('archMapSideNavCenterLeft', function($mdSidenav) {
    return {
      restrict: 'E',
      templateUrl: 'components/center/arch-map-side-nav-center-left.html',
      link: function(scope, element, attributes) {

      }
    }
  });
