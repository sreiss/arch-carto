'use strict'
angular.module('archCarto')
  .directive('archParallax', [
    '$window',
    function($window) {
      return {
        restrict: 'A',
        link: function(scope, element, attributes) {
          var windowElement = angular.element($window);
          var speed = parseInt(attributes.archParallax, 10) || 4;

          var parallax = function() {
            var yPos = -(windowElement.scrollTop() / speed);

            // Put together our final background position
            var coords = '50% '+ yPos + 'px';

            // Move the background
            element.css({ backgroundPosition: coords });
          };

          parallax();
          windowElement.on('scroll', parallax);
        }
      };
    }
  ]);
