'use strict';
angular.module('archCarto')
  .directive('archRatingsAverage', function(archRatingService) {
    return {
      restrict: 'E',
      templateUrl: 'components/course/arch-ratings-average.html',
      link: function(scope, element, attributes) {
        archRatingService.getList({
            courseId: scope.id
          })
          .then(function(result) {
            scope.ratings = result.value;
          });

        scope.$watch('ratings', function(ratings) {
          if (angular.isDefined(ratings)) {
            var total = 0;
            for (var i = 0; i < ratings.length; i += 1) {
              total += ratings[i].rate;
            }
            var average = total / ratings.length;
            scope.average = [];
            for (var j = 0; j < average; j += 1) {
              scope.average.push(j);
            }
          }
        });
      }
    }
  });
