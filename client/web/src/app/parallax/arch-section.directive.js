'use strict'
angular.module('archCarto')
  .directive('archSection', function($window) {
    return {
      restrict: 'E',
      link: function(scope, element, attributes) {
        var windowElem = angular.element($window);

        windowElem.on('resize', function() {
          element.css('height', '100%');
        });
      }
    }
  });
