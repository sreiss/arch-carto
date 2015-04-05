'use strict'
angular.module('archCarto')
  .directive('archMapSideNavPoiLeft', [
    function() {
      return {
        restrict: 'E',
        templateUrl: 'components/poi/arch-map-side-nav-poi-left.html',
        link: function(scope, element, attributes) {

        }
      };
    }
  ]);
