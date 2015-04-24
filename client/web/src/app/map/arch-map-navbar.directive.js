'use strict'
angular.module('archCarto')
  .directive('archMapNavbar', function() {
    return {
      restrict: 'E',
      templateUrl: 'app/map/arch-map-navbar.html'
    }
  });
