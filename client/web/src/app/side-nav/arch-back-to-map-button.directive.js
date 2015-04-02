'use strict'
angular.module('archCarto')
  .directive('archBackToMapButton', [
    function() {
      return {
        restrict: 'E',
        templateUrl: 'app/side-nav/arch-back-to-map-button.html',
        link: function(scope, element, attributes) {

        }
      }
    }
  ]);
