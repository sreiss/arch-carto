'use strict'
angular.module('archCarto')
  .directive('archMapSideNavPoiRight', function($mdSidenav) {
    return {
      restrict: 'E',
      require: '^archMap',
      templateUrl: 'components/poi/arch-map-side-nav-poi-right.html',
      link: function(scope, element, attributes, archMap) {
        scope.close = function() {
          $mdSidenav('rightSideNav').close();
        };
      }
    }
  });
