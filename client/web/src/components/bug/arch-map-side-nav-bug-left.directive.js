'use strict'
angular.module('archCarto')
  .directive('archSiveNavBug', [
    function() {
      return {
        restrict: 'E',
        templateUrl: 'components/bug/arch-side-nav-bug.html',
        link: function(scope, element, attributes) {

        }
      };
    }
  ]);
