'use strict'
angular.module('archCarto')
  .directive('archMapBugList', function(archBugService, $mdToast, $translate) {
    return {
      restrict: 'E',
      require: '^archMap',
      templateUrl: 'components/bug/arch-map-bug-list.html',
      controller: function($scope) {
        archBugService.getBugList()
          .then(function(bugs) {
            $scope.bugs = bugs;
          });
      },
      link: function(scope, element, attributes, archMap) {
        scope.filterOptions = {
          status: 'resolved'
        };

        scope.setFilter = function(status) {
          if (!status) {
            scope.filterOptions.status = '';
          } else {
            scope.filterOptions.status = status;
          }
        };

        scope.centerOnBug = function(bug) {
          archMap.setCenter(bug.coordinates);
        };

        scope.resolve = function(bug) {
          bug.status = 'resolved';
          archBugService.saveBug(bug)
            .then(function() {
              $translate(['BUG_MARKED_AS_RESOLVED'])
                .then(function(translations) {
                  $mdToast.show($mdToast.simple().content(translations.BUG_MARKED_AS_RESOLVED));
                });
            });
        };
      }
    };
  });
