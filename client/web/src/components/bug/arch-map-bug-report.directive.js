'use strict'
angular.module('archCarto')
  .directive('archMapBugReport', function($translate, $mdToast, archBugService) {
    return {
      restrict: 'E',
      require: '^archMap',
      templateUrl: 'components/bug/arch-map-bug-report.html',
      link: function(scope, element, attributes, archMap) {
        scope.bug = {
          coordinates: scope.mapStatus.selectedCoordinates,
          status: 'unsolved'
        };

        scope.reportBug = function(bug) {
          archBugService.saveBug(bug)
            .then(function() {
              archMap.refreshMarkers();
              $translate(['BUG_REPORTED']).then(function(translations) {
                $mdToast.show($mdToast.simple().content(translations.BUG_REPORTED));
                scope.closeRight();
              });
            });
        };
      }
    };
  });
