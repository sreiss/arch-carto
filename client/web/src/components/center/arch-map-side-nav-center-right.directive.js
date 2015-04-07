'use strict'
angular.module('archCarto')
  .directive('archMapSideNavCenterRight', function($stateParams, $mdSidenav) {
    return {
      restrict: 'E',
      templateUrl: 'components/center/arch-map-side-nav-center-right.html',
      link: function(scope, element, attributes) {
      }
    }
  });
