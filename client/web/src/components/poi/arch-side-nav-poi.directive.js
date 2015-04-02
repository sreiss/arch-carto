'use strict'
angular.module('archCarto')
  .directive('archSideNavPoi', [
    function() {
      return {
        restrict: 'E',
        templateUrl: 'components/poi/arch-side-nav-poi.html',
        link: function(scope, element, attributes) {

        }
      };
    }
  ]);
