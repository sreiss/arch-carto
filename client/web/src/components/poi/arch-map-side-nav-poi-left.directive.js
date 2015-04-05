'use strict'
angular.module('archCarto')
  .directive('archSideNavPoiLeft', [
    function() {
      return {
        restrict: 'E',
        templateUrl: 'components/poi/arch-side-nav-poi-left.html',
        link: function(scope, element, attributes) {

        }
      };
    }
  ]);
